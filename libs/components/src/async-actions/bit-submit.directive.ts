import { Directive, Input, OnDestroy, OnInit, Optional } from "@angular/core";
import { FormGroupDirective } from "@angular/forms";
import { BehaviorSubject, catchError, filter, of, Subject, switchMap, takeUntil } from "rxjs";

import { ValidationService } from "@bitwarden/common/abstractions/validation.service";

import { FunctionReturningAwaitable, functionToObservable } from "../utils/function-to-observable";

/**
 * Allow a form to perform async actions on submit, disabling the form while the action is processing.
 */
@Directive({
  selector: "[formGroup][bitSubmit]",
})
export class BitSubmitDirective implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private _loading$ = new BehaviorSubject<boolean>(false);
  private _disabled$ = new BehaviorSubject<boolean>(false);

  @Input("bitSubmit") protected handler: FunctionReturningAwaitable;

  readonly loading$ = this._loading$.asObservable();
  readonly disabled$ = this._disabled$.asObservable();

  constructor(
    private formGroupDirective: FormGroupDirective,
    @Optional() validationService?: ValidationService
  ) {
    formGroupDirective.ngSubmit
      .pipe(
        filter(() => !this.disabled),
        switchMap(() => {
          // Calling functionToObservable exectues the sync part of the handler
          // allowing the function to check form validity before it gets disabled.
          const awaitable = functionToObservable(this.handler);

          // Disable form
          this.loading = true;

          return awaitable.pipe(
            catchError((err: unknown) => {
              validationService?.showError(err);
              return of(undefined);
            })
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: () => (this.loading = false),
        complete: () => (this.loading = false),
      });
  }

  ngOnInit(): void {
    this.formGroupDirective.statusChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((c) => this._disabled$.next(c === "DISABLED"));
  }

  get disabled() {
    return this._disabled$.value;
  }

  set disabled(value: boolean) {
    this._disabled$.next(value);
  }

  get loading() {
    return this._loading$.value;
  }

  set loading(value: boolean) {
    this.disabled = value;
    this._loading$.next(value);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
