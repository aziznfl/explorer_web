import type { EntryType } from './EntryTypes';

export interface BaseEntry {
  id: string;
  name: string;
  parentId: string | null;
  type: EntryType;
  path: string;
}
