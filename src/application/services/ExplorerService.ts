import type { IExplorerRepository } from '../../domain/repositories/IExplorerRepository';
import type { ExplorerFolder, ExplorerEntry, CreateItemDto, UpdateItemDto, PaginatedResponse } from '../../domain/models';

export class ExplorerService {
  private repository: IExplorerRepository;

  constructor(repository: IExplorerRepository) {
    this.repository = repository;
  }

  async getSubFolders(folderId: string): Promise<ExplorerFolder[]> {
    const response = await this.repository.getFolderChildren(folderId, { limit: 1000 }); // Large limit for tree
    return response.data.filter(item => item.type === 'folder') as ExplorerFolder[];
  }

  async getStructure(): Promise<ExplorerFolder[]> {
    return this.getSubFolders('root');
  }

  async getContents(folderId: string, options?: { sortBy?: string, order?: string, lastId?: string, limit?: number }): Promise<PaginatedResponse<ExplorerEntry>> {
    return this.repository.getFolderChildren(folderId, options);
  }

  async search(query: string, options?: { sortBy?: string, order?: string, lastId?: string, limit?: number }): Promise<PaginatedResponse<ExplorerEntry>> {
    if (!query) return { data: [], meta: { limit: options?.limit || 50 } };
    return this.repository.searchEntries(query, options);
  }

  async createEntry(data: CreateItemDto): Promise<ExplorerEntry> {
    return this.repository.createEntry(data);
  }

  async updateEntry(id: string, data: UpdateItemDto): Promise<ExplorerEntry> {
    return this.repository.updateEntry(id, data);
  }

  async deleteEntry(id: string): Promise<boolean> {
    return this.repository.deleteEntry(id);
  }
}
