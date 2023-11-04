import {
  Component,
  Input,
  OnInit,
  Output,
  ViewChild,
  EventEmitter,
  HostBinding,
  Optional,
  Self,
} from "@angular/core";
import { ControlValueAccessor, NgControl, Validators } from "@angular/forms";
import { NgSelectComponent } from "@ng-select/ng-select";

import { I18nService } from "@bitwarden/common/abstractions/i18n.service";

import { BitFormFieldControl } from "../form-field/form-field-control";

import { SelectItemView } from "./models/select-item-view";

// Increments for each instance of this component
let nextId = 0;

@Component({
  selector: "bit-multi-select",
  templateUrl: "./multi-select.component.html",
  providers: [{ provide: BitFormFieldControl, useExisting: MultiSelectComponent }],
})
/**
 * This component has been implemented to only support Multi-select list events
 */
export class MultiSelectComponent implements OnInit, BitFormFieldControl, ControlValueAccessor {
  @ViewChild(NgSelectComponent) select: NgSelectComponent;

  // Parent component should only pass selectable items (complete list - selected items = baseItems)
  @Input() baseItems: SelectItemView[];
  // Defaults to native ng-select behavior - set to "true" to clear selected items on dropdown close
  @Input() removeSelectedItems = false;
  @Input() placeholder: string;
  @Input() loading = false;
  @Input() disabled = false;

  // Internal tracking of selected items
  @Input() selectedItems: SelectItemView[];

  // Default values for our implementation
  loadingText: string;

  protected searchInputId = `search-input-${nextId++}`;

  /**Implemented as part of NG_VALUE_ACCESSOR */
  private notifyOnChange?: (value: SelectItemView[]) => void;
  /**Implemented as part of NG_VALUE_ACCESSOR */
  private notifyOnTouched?: () => void;

  @Output() onItemsConfirmed = new EventEmitter<any[]>();

  constructor(private i18nService: I18nService, @Optional() @Self() private ngControl?: NgControl) {
    if (ngControl != null) {
      ngControl.valueAccessor = this;
    }
  }

  ngOnInit(): void {
    // Default Text Values
    this.placeholder = this.placeholder ?? this.i18nService.t("multiSelectPlaceholder");
    this.loadingText = this.i18nService.t("multiSelectLoading");
  }

  /** Helper method for showing selected state in custom template */
  isSelected(item: any): boolean {
    return this.selectedItems?.find((selected) => selected.id === item.id) != undefined;
  }

  /**
   * The `close` callback will act as the only trigger for signifying the user's intent of completing the selection
   * of items. Selected items will be emitted to the parent component in order to allow for separate data handling.
   */
  onDropdownClosed(): void {
    // Early exit
    if (this.selectedItems == null || this.selectedItems.length == 0) {
      return;
    }

    // Emit results to parent component
    this.onItemsConfirmed.emit(this.selectedItems);

    // Remove selected items from base list based on input property
    if (this.removeSelectedItems) {
      let updatedBaseItems = this.baseItems;
      this.selectedItems.forEach((selectedItem) => {
        updatedBaseItems = updatedBaseItems.filter((item) => selectedItem.id !== item.id);
      });

      // Reset Lists
      this.selectedItems = null;
      this.baseItems = updatedBaseItems;
    }
  }

  /**Implemented as part of NG_VALUE_ACCESSOR */
  writeValue(obj: SelectItemView[]): void {
    this.selectedItems = obj;
  }

  /**Implemented as part of NG_VALUE_ACCESSOR */
  registerOnChange(fn: (value: SelectItemView[]) => void): void {
    this.notifyOnChange = fn;
  }

  /**Implemented as part of NG_VALUE_ACCESSOR */
  registerOnTouched(fn: any): void {
    this.notifyOnTouched = fn;
  }

  /**Implemented as part of NG_VALUE_ACCESSOR */
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  /**Implemented as part of NG_VALUE_ACCESSOR */
  protected onChange(items: SelectItemView[]) {
    if (!this.notifyOnChange) {
      return;
    }

    this.notifyOnChange(items);
  }

  /**Implemented as part of NG_VALUE_ACCESSOR */
  protected onBlur() {
    if (!this.notifyOnTouched) {
      return;
    }

    this.notifyOnTouched();
  }

  /**Implemented as part of BitFormFieldControl */
  @HostBinding("attr.aria-describedby")
  get ariaDescribedBy() {
    return this._ariaDescribedBy;
  }
  set ariaDescribedBy(value: string) {
    this._ariaDescribedBy = value;
    this.select?.searchInput.nativeElement.setAttribute("aria-describedby", value);
  }
  private _ariaDescribedBy: string;

  /**Implemented as part of BitFormFieldControl */
  get labelForId() {
    return this.searchInputId;
  }

  /**Implemented as part of BitFormFieldControl */
  @HostBinding() @Input() id = `bit-multi-select-${nextId++}`;

  /**Implemented as part of BitFormFieldControl */
  @HostBinding("attr.required")
  @Input()
  get required() {
    return this._required ?? this.ngControl?.control?.hasValidator(Validators.required) ?? false;
  }
  set required(value: any) {
    this._required = value != null && value !== false;
  }
  private _required: boolean;

  /**Implemented as part of BitFormFieldControl */
  get hasError() {
    return this.ngControl?.status === "INVALID" && this.ngControl?.touched;
  }

  /**Implemented as part of BitFormFieldControl */
  get error(): [string, any] {
    const key = Object.keys(this.ngControl?.errors)[0];
    return [key, this.ngControl?.errors[key]];
  }
}
