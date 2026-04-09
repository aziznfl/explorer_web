import type { BaseEntry } from './BaseEntry';
import type { ExplorerFile } from './ExplorerFile';

export interface ExplorerFolder extends BaseEntry {
  type: 'folder';
  children?: (ExplorerFolder | ExplorerFile)[];
}
