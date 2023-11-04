import { Jsonify } from "type-fest";

import { PasswordHistoryData } from "../data/password-history.data";
import { PasswordHistoryView } from "../view/password-history.view";

import Domain from "./domain-base";
import { EncString } from "./enc-string";
import { SymmetricCryptoKey } from "./symmetric-crypto-key";

export class Password extends Domain {
  password: EncString;
  lastUsedDate: Date;

  constructor(obj?: PasswordHistoryData) {
    super();
    if (obj == null) {
      return;
    }

    this.buildDomainModel(this, obj, {
      password: null,
    });
    this.lastUsedDate = new Date(obj.lastUsedDate);
  }

  decrypt(orgId: string, encKey?: SymmetricCryptoKey): Promise<PasswordHistoryView> {
    return this.decryptObj(
      new PasswordHistoryView(this),
      {
        password: null,
      },
      orgId,
      encKey
    );
  }

  toPasswordHistoryData(): PasswordHistoryData {
    const ph = new PasswordHistoryData();
    ph.lastUsedDate = this.lastUsedDate.toISOString();
    this.buildDataModel(this, ph, {
      password: null,
    });
    return ph;
  }

  static fromJSON(obj: Partial<Jsonify<Password>>): Password {
    if (obj == null) {
      return null;
    }

    const password = EncString.fromJSON(obj.password);
    const lastUsedDate = obj.lastUsedDate == null ? null : new Date(obj.lastUsedDate);

    return Object.assign(new Password(), obj, {
      password,
      lastUsedDate,
    });
  }
}
