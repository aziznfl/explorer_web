import type { ExplorerFolder } from './ExplorerFolder';
import type { ExplorerFile } from './ExplorerFile';

export type EntryType = 'folder' | 'file';
export type ExplorerEntry = ExplorerFolder | ExplorerFile;
