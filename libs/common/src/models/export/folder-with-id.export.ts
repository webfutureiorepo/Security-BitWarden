import { Folder as FolderDomain } from "../domain/folder";
import { FolderView } from "../view/folder.view";

import { FolderExport } from "./folder.export";

export class FolderWithIdExport extends FolderExport {
  id: string;

  // Use build method instead of ctor so that we can control order of JSON stringify for pretty print
  build(o: FolderView | FolderDomain) {
    this.id = o.id;
    super.build(o);
  }
}
