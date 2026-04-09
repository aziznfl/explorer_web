import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ExplorerService } from '../../src/application/services/ExplorerService';
import type { IExplorerRepository } from '../../src/domain/repositories/IExplorerRepository';
import type { ExplorerFolder, ExplorerEntry } from '../../src/domain/models';

describe('ExplorerService', () => {
  let service: ExplorerService;
  let mockRepository: IExplorerRepository;

  const mockFolders: ExplorerFolder[] = [
    { id: '1', name: 'Documents', type: 'folder', parentId: 'root', path: '/Documents' },
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
    vi.mocked(mockRepository.getFolderChildren).mockResolvedValue(mockFolders);

    const result = await service.getStructure();
    expect(result).toEqual(mockFolders);
    expect(mockRepository.getFolderChildren).toHaveBeenCalledWith('root');
  });

  it('should fetch folder contents', async () => {
    vi.mocked(mockRepository.getFolderChildren).mockResolvedValue(mockItems);

    const result = await service.getContents('1');
    expect(result).toEqual(mockItems);
    expect(mockRepository.getFolderChildren).toHaveBeenCalledWith('1', undefined, undefined);
  });

  it('should search for entries', async () => {
    vi.mocked(mockRepository.searchEntries).mockResolvedValue(mockItems);

    const result = await service.search('File');
    expect(result).toEqual(mockItems);
    expect(mockRepository.searchEntries).toHaveBeenCalledWith('File', undefined, undefined);
  });

  it('should return empty list on empty search query', async () => {
    const result = await service.search('');
    expect(result).toEqual([]);
    expect(mockRepository.searchEntries).not.toHaveBeenCalled();
  });
});
