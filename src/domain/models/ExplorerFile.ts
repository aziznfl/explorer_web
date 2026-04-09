import type { BaseEntry } from './BaseEntry';

export interface ExplorerFile extends BaseEntry {
  type: 'file';
  extension?: string;
  modifiedAt?: string;
}
