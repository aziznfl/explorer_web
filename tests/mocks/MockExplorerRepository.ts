import type { IExplorerRepository } from '../../src/domain/repositories/IExplorerRepository';
import type { ExplorerFolder, ExplorerEntry, CreateItemDto, UpdateItemDto } from '../../src/domain/models';

const mockFolders: ExplorerFolder[] = [
  { id: '1', name: 'Documents', type: 'folder', parentId: 'root', path: '/Documents', children: [
    { id: '1-1', name: 'Work', type: 'folder', parentId: '1', path: '/Documents/Work', children: [
      { id: '1-1-1', name: 'Resume.pdf', type: 'file', parentId: '1-1', path: '/Documents/Work/Resume.pdf' } as any,
      { id: '1-1-2', name: 'Project_Alpha', type: 'folder', parentId: '1-1', path: '/Documents/Work/Project_Alpha', children: [] },
    ] },
    { id: '1-2', name: 'Private', type: 'folder', parentId: '1', path: '/Documents/Private', children: [] },
  ] },
  {
    id: '2', name: 'Images', type: 'folder', parentId: 'root', path: '/Images', children: [
      { id: '2-1', name: 'Vacation', type: 'folder', parentId: '2', path: '/Images/Vacation', children: [] },
      { id: '2-2', name: 'Profile.png', type: 'file', parentId: '2', path: '/Images/Profile.png' } as any,
    ]
  },
  { id: '3', name: 'Videos', type: 'folder', parentId: 'root', path: '/Videos', children: [] },
];

const allEntries: ExplorerEntry[] = [...mockFolders];

export class MockExplorerRepository implements IExplorerRepository {
  async getFolderChildren(folderId: string): Promise<ExplorerEntry[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    if (folderId === 'root') return mockFolders;

    const findFolder = (list: ExplorerEntry[]): ExplorerFolder | undefined => {
      for (const entry of list) {
        if (entry.type === 'folder') {
          if (entry.id === folderId) return entry as ExplorerFolder;
          const found = findFolder((entry as ExplorerFolder).children || []);
          if (found) return found;
        }
      }
      return undefined;
    };

    return findFolder(mockFolders)?.children || [];
  }

  async searchEntries(query: string): Promise<ExplorerEntry[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const results: ExplorerEntry[] = [];
    const traverse = (entries: ExplorerEntry[]) => {
      for (const entry of entries) {
        if (entry.name.toLowerCase().includes(query.toLowerCase())) {
          results.push(entry);
        }
        if (entry.type === 'folder' && (entry as ExplorerFolder).children) {
          traverse((entry as ExplorerFolder).children!);
        }
      }
    };
    traverse(allEntries);
    return results;
  }

  async createEntry(data: CreateItemDto): Promise<ExplorerEntry> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const base = {
      id: Math.random().toString(36).slice(2, 9),
      name: data.name,
      type: data.type,
      parentId: data.parentId || 'root',
      path: `/${data.name}`,
    };
    if (data.type === 'folder') return { ...base, type: 'folder', children: [] } as ExplorerFolder;
    return { ...base, type: 'file' } as ExplorerEntry;
  }

  async updateEntry(id: string, data: UpdateItemDto): Promise<ExplorerEntry> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id,
      name: data.name || 'Updated',
      type: 'file',
      parentId: data.parentId || 'root',
      path: '/updated',
    } as ExplorerEntry;
  }

  async deleteEntry(_id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return true;
  }
}
