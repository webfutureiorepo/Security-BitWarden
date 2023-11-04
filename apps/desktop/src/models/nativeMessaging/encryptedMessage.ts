import { EncString } from "@bitwarden/common/models/domain/enc-string";

import { MessageCommon } from "./messageCommon";

export type EncryptedMessage = MessageCommon & {
  // Will decrypt to a DecryptedCommandData object
  encryptedCommand: EncString;
};
