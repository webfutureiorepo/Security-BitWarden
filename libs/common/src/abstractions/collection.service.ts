import { CollectionData } from "../models/data/collection.data";
import { Collection } from "../models/domain/collection";
import { TreeNode } from "../models/domain/tree-node";
import { CollectionView } from "../models/view/collection.view";

export abstract class CollectionService {
  clearCache: (userId?: string) => Promise<void>;
  encrypt: (model: CollectionView) => Promise<Collection>;
  decryptMany: (collections: Collection[]) => Promise<CollectionView[]>;
  get: (id: string) => Promise<Collection>;
  getAll: () => Promise<Collection[]>;
  getAllDecrypted: () => Promise<CollectionView[]>;
  getAllNested: (collections?: CollectionView[]) => Promise<TreeNode<CollectionView>[]>;
  getNested: (id: string) => Promise<TreeNode<CollectionView>>;
  upsert: (collection: CollectionData | CollectionData[]) => Promise<any>;
  replace: (collections: { [id: string]: CollectionData }) => Promise<any>;
  clear: (userId: string) => Promise<any>;
  delete: (id: string | string[]) => Promise<any>;
}
