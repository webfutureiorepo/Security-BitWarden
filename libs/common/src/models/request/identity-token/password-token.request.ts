import { ClientType } from "../../../enums/clientType";
import { Utils } from "../../../misc/utils";
import { CaptchaProtectedRequest } from "../captcha-protected.request";
import { DeviceRequest } from "../device.request";

import { TokenTwoFactorRequest } from "./token-two-factor.request";
import { TokenRequest } from "./token.request";

export class PasswordTokenRequest extends TokenRequest implements CaptchaProtectedRequest {
  constructor(
    public email: string,
    public masterPasswordHash: string,
    public captchaResponse: string,
    protected twoFactor: TokenTwoFactorRequest,
    device?: DeviceRequest
  ) {
    super(twoFactor, device);
  }

  toIdentityToken(clientId: ClientType) {
    const obj = super.toIdentityToken(clientId);

    obj.grant_type = "password";
    obj.username = this.email;
    obj.password = this.masterPasswordHash;

    if (this.captchaResponse != null) {
      obj.captchaResponse = this.captchaResponse;
    }

    return obj;
  }

  alterIdentityTokenHeaders(headers: Headers) {
    headers.set("Auth-Email", Utils.fromUtf8ToUrlB64(this.email));
  }
}
