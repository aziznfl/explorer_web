import type { ExplorerEntry, CreateItemDto, UpdateItemDto, PaginatedResponse } from '../models';

export interface IExplorerRepository {
  getFolderChildren(folderId: string, options?: { sortBy?: string, order?: string, lastId?: string, limit?: number }): Promise<PaginatedResponse<ExplorerEntry>>;
  searchEntries(query: string, options?: { sortBy?: string, order?: string, lastId?: string, limit?: number }): Promise<PaginatedResponse<ExplorerEntry>>;
  createEntry(data: CreateItemDto): Promise<ExplorerEntry>;
  updateEntry(id: string, data: UpdateItemDto): Promise<ExplorerEntry>;
  deleteEntry(id: string): Promise<boolean>;
}
