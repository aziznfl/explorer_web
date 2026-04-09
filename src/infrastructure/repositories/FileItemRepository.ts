import { BaseApiClient } from '../api/BaseApiClient';
import { FileItemMapper, type FileItemDto } from '../dtos/FileItemDto';
import type { ExplorerEntry, CreateItemDto, UpdateItemDto, PaginatedResponse } from '../../domain/models';
import type { IExplorerRepository } from '../../domain/repositories/IExplorerRepository';

export class FileItemRepository implements IExplorerRepository {
  private readonly PREFIX = '/items';

  async getFolderChildren(folderId: string, options?: { sortBy?: string, order?: string, lastId?: string, limit?: number }): Promise<PaginatedResponse<ExplorerEntry>> {
    const base = folderId === 'root' ? `${this.PREFIX}/root/children` : `${this.PREFIX}/${folderId}/children`;
    const params = new URLSearchParams();
    if (options?.sortBy) params.append('sortBy', options.sortBy);
    if (options?.order) params.append('order', options.order);
    if (options?.lastId) params.append('lastId', options.lastId);
    if (options?.limit) params.append('limit', options.limit.toString());

    const url = params.toString() ? `${base}?${params}` : base;
    const response = await BaseApiClient.get<FileItemDto[]>(url);
    
    return {
      data: FileItemMapper.toEntries(response.data),
      meta: response.meta as any
    };
  }

  async searchEntries(query: string, options?: { sortBy?: string, order?: string, lastId?: string, limit?: number }): Promise<PaginatedResponse<ExplorerEntry>> {
    const params = new URLSearchParams({ q: query });
    if (options?.sortBy) params.append('sortBy', options.sortBy);
    if (options?.order) params.append('order', options.order);
    if (options?.lastId) params.append('lastId', options.lastId);
    if (options?.limit) params.append('limit', options.limit.toString());

    const response = await BaseApiClient.get<FileItemDto[]>(`${this.PREFIX}/search?${params}`);
    return {
      data: FileItemMapper.toEntries(response.data),
      meta: response.meta as any
    };
  }

  async createEntry(data: CreateItemDto): Promise<ExplorerEntry> {
    const response = await BaseApiClient.post<FileItemDto>(`${this.PREFIX}`, data);
    return FileItemMapper.toEntry(response.data);
  }

  async updateEntry(id: string, data: UpdateItemDto): Promise<ExplorerEntry> {
    const response = await BaseApiClient.patch<FileItemDto>(`${this.PREFIX}/${id}`, data);
    return FileItemMapper.toEntry(response.data);
  }

  async deleteEntry(id: string): Promise<boolean> {
    const response = await BaseApiClient.delete<{ success: boolean }>(`${this.PREFIX}/${id}`);
    return response.data.success;
  }
}

