import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ExplorerService } from '../../src/application/services/ExplorerService';
import type { IExplorerRepository } from '../../src/domain/repositories/IExplorerRepository';
import type { PaginatedResponse, ExplorerEntry, ExplorerFolder } from '../../src/domain/models';

const makePaginated = <T>(data: T[]): PaginatedResponse<T> => ({
  data,
  meta: { limit: 50 },
});

describe('ExplorerService', () => {
  let service: ExplorerService;
  let mockRepository: IExplorerRepository;

  const mockFolders: ExplorerFolder[] = [
    { id: '1', name: 'Documents', type: 'folder', parentId: 'root', path: '/Documents', children: [] },
  ];

  const mockItems: ExplorerEntry[] = [
    { id: '1-1', name: 'File 1', type: 'file', parentId: '1', path: '/Documents/File 1' } as ExplorerEntry,
  ];

  beforeEach(() => {
    mockRepository = {
      getFolderChildren: vi.fn(),
      searchEntries: vi.fn(),
      createEntry: vi.fn(),
      updateEntry: vi.fn(),
      deleteEntry: vi.fn(),
    };
    service = new ExplorerService(mockRepository);
  });

  it('should fetch sub-folders (structure)', async () => {
    vi.mocked(mockRepository.getFolderChildren).mockResolvedValue(makePaginated(mockFolders));

    const result = await service.getStructure();
    expect(result).toEqual(mockFolders);
    expect(mockRepository.getFolderChildren).toHaveBeenCalledWith('root', { limit: 1000 });
  });

  it('should fetch folder contents and return paginated response', async () => {
    const paginated = makePaginated(mockItems);
    vi.mocked(mockRepository.getFolderChildren).mockResolvedValue(paginated);

    const result = await service.getContents('1');
    expect(result).toEqual(paginated);
    expect(mockRepository.getFolderChildren).toHaveBeenCalledWith('1', undefined);
  });

  it('should search for entries and return paginated response', async () => {
    const paginated = makePaginated(mockItems);
    vi.mocked(mockRepository.searchEntries).mockResolvedValue(paginated);

    const result = await service.search('File');
    expect(result).toEqual(paginated);
    expect(mockRepository.searchEntries).toHaveBeenCalledWith('File', undefined);
  });

  it('should return empty paginated result on empty search query', async () => {
    const result = await service.search('');
    expect(result.data).toEqual([]);
    expect(mockRepository.searchEntries).not.toHaveBeenCalled();
  });

  it('should create an entry', async () => {
    vi.mocked(mockRepository.createEntry).mockResolvedValue(mockItems[0]);

    const result = await service.createEntry({ name: 'File 1', type: 'file', parentId: '1' });
    expect(result).toEqual(mockItems[0]);
  });

  it('should update an entry', async () => {
    vi.mocked(mockRepository.updateEntry).mockResolvedValue(mockItems[0]);

    const result = await service.updateEntry('1-1', { name: 'File 1' });
    expect(result).toEqual(mockItems[0]);
  });

  it('should delete an entry', async () => {
    vi.mocked(mockRepository.deleteEntry).mockResolvedValue(true);

    const result = await service.deleteEntry('1-1');
    expect(result).toBe(true);
  });
});
