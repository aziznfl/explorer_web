import type { ExplorerEntry, ExplorerFolder, ExplorerFile } from '../../domain/models';

export interface FileItemDto {
  id: string;
  name: string;
  type: string;
  parentId: string | null;
  path?: string;
  createdAt: string;
  updatedAt: string;
}

export class FileItemMapper {
  static toEntry(dto: FileItemDto): ExplorerEntry {
    if (dto.type === 'folder') {
      return {
        id: dto.id,
        name: dto.name,
        type: 'folder',
        parentId: dto.parentId,
        path: dto.path || `/${dto.name}`,
        children: [],
      } as ExplorerFolder;
    }

    return {
      id: dto.id,
      name: dto.name,
      type: 'file',
      parentId: dto.parentId,
      path: dto.path || `/${dto.name}`,
      extension: dto.name.split('.').pop(),
      modifiedAt: dto.updatedAt,
    } as ExplorerFile;
  }

  static toEntries(dtos: FileItemDto[]): ExplorerEntry[] {
    return dtos.map(dto => this.toEntry(dto));
  }
}

