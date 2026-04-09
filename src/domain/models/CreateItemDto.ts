export interface CreateItemDto {
  name: string;
  type: 'folder' | 'file';
  parentId?: string | null;
}
