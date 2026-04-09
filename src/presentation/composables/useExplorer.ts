import { ref, computed, watch } from 'vue';
import type { ExplorerFolder, ExplorerEntry } from '../../domain/models';
import type { FolderTreeNode } from '../models/FolderTreeNode';
import { ExplorerService } from '../../application/services/ExplorerService';
import { FileItemRepository } from '../../infrastructure/repositories/FileItemRepository';

const repository = new FileItemRepository();
const service = new ExplorerService(repository);

function toTreeNode(folder: ExplorerFolder): FolderTreeNode {
  return { ...folder, children: [], isOpen: false, isLoaded: false };
}

export function useExplorer() {
  const folders = ref<FolderTreeNode[]>([]);
  const currentPathItems = ref<ExplorerEntry[]>([]);
  const selectedFolderId = ref<string | null>('root');
  const isLoading = ref(false);
  const isLoadingMore = ref(false);
  const hasMore = ref(false);
  const lastId = ref<string | undefined>(undefined);
  const searchQuery = ref('');
  const searchResults = ref<ExplorerEntry[]>([]);
  const selectedEntry = ref<ExplorerEntry | null>(null);

  const sortBy = ref<'name' | 'kind'>('name');
  const sortOrder = ref<'asc' | 'desc'>('asc');

  watch([sortBy, sortOrder], () => {
    if (searchQuery.value) {
      search(searchQuery.value);
    } else if (selectedFolderId.value) {
      selectFolder(selectedFolderId.value);
    }
  });

  const pendingFetches = new Map<string, Promise<any>>();

  const fetchFolderData = (folderId: string, options?: { lastId?: string, limit?: number }): Promise<any> => {
    const key = `${folderId}-${options?.lastId || 'first'}`;
    if (!pendingFetches.has(key)) {
      const promise = service.getContents(folderId, {
        sortBy: sortBy.value,
        order: sortOrder.value,
        ...options
      }).finally(() => {
        setTimeout(() => pendingFetches.delete(key), 50);
      });
      pendingFetches.set(key, promise);
    }
    return pendingFetches.get(key)!;
  };

  const fetchStructure = async () => {
    isLoading.value = true;
    try {
      const response = await fetchFolderData('root', { limit: 1000 });
      const apiFolders = response.data.filter((i: any) => i.type === 'folder');
      
      folders.value = [{
        id: 'root',
        name: 'My Computer',
        type: 'folder',
        parentId: null,
        path: '/',
        children: apiFolders.map(toTreeNode),
        isOpen: true,
        isLoaded: true
      }];
      if (selectedFolderId.value === 'root' || !selectedFolderId.value) {
        selectFolder('root');
      }
      selectedEntry.value = null;
    } finally {
      isLoading.value = false;
    }
  };

  const fetchSubFolders = async (folder: FolderTreeNode) => {
    if (folder.isLoaded && !folder.needsRefresh) return;

    const updateFolderInTree = async (list: FolderTreeNode[]): Promise<boolean> => {
      for (let i = 0; i < list.length; i++) {
        if (list[i].id === folder.id) {
          list[i].isLoading = true;
          try {
            const response = await fetchFolderData(folder.id, { limit: 1000 });
            list[i].children = response.data.filter((i: any) => i.type === 'folder').map(toTreeNode);
            list[i].isLoaded = true;
            list[i].needsRefresh = false;
          } finally {
            list[i].isLoading = false;
          }
          return true;
        }
        if (list[i].children?.length) {
          const found = await updateFolderInTree(list[i].children as FolderTreeNode[]);
          if (found) return true;
        }
      }
      return false;
    };

    await updateFolderInTree(folders.value);
  };

  const selectFolder = async (folderId: string) => {
    selectedFolderId.value = folderId;
    selectedEntry.value = null;
    searchQuery.value = '';
    isLoading.value = true;
    try {
      const response = await fetchFolderData(folderId, { limit: 50 });
      currentPathItems.value = response.data;
      lastId.value = response.meta.lastId;
      hasMore.value = response.meta.hasMore || false;
    } finally {
      isLoading.value = false;
    }
  };

  const loadMore = async () => {
    if (isLoading.value || isLoadingMore.value || !hasMore.value) return;

    isLoadingMore.value = true;
    try {
      if (searchQuery.value) {
        const response = await service.search(searchQuery.value, {
          sortBy: sortBy.value,
          order: sortOrder.value,
          lastId: lastId.value,
          limit: 50
        });
        searchResults.value = [...searchResults.value, ...response.data];
        lastId.value = response.meta.lastId;
        hasMore.value = response.meta.hasMore || false;
      } else if (selectedFolderId.value) {
        const response = await fetchFolderData(selectedFolderId.value, { 
          lastId: lastId.value, 
          limit: 50 
        });
        currentPathItems.value = [...currentPathItems.value, ...response.data];
        lastId.value = response.meta.lastId;
        hasMore.value = response.meta.hasMore || false;
      }
    } finally {
      isLoadingMore.value = false;
    }
  };

  const findFolderById = (list: FolderTreeNode[], id: string): FolderTreeNode | null => {
    for (const f of list) {
      if (f.id === id) return f;
      if (f.children) {
        const found = findFolderById(f.children as FolderTreeNode[], id);
        if (found) return found;
      }
    }
    return null;
  };

  const refreshCurrentFolder = async () => {
    if (!selectedFolderId.value) return;
    await selectFolder(selectedFolderId.value);
    const folder = findFolderById(folders.value, selectedFolderId.value);
    if (folder) {
      folder.needsRefresh = true;
      await fetchSubFolders(folder);
    }
  };

  let currentSearchId = 0;
  const search = async (query: string) => {
    const searchId = ++currentSearchId;
    searchQuery.value = query;
    selectedEntry.value = null;
    
    if (!query) {
      searchResults.value = [];
      hasMore.value = false;
      lastId.value = undefined;
      return;
    }

    // Add a small delay for debouncing
    await new Promise(resolve => setTimeout(resolve, 300));
    if (searchId !== currentSearchId) return;

    isLoading.value = true;
    try {
      const response = await service.search(query, {
        sortBy: sortBy.value,
        order: sortOrder.value,
        limit: 50
      });
      
      if (searchId !== currentSearchId) return;

      searchResults.value = response.data;
      lastId.value = response.meta.lastId;
      hasMore.value = response.meta.hasMore || false;
    } finally {
      if (searchId === currentSearchId) {
        isLoading.value = false;
      }
    }
  };


  const addItem = async (name: string, type: 'file' | 'folder') => {
    if (!selectedFolderId.value) return;
    isLoading.value = true;
    try {
      await service.createEntry({
        name,
        type,
        parentId: selectedFolderId.value === 'root' ? null : selectedFolderId.value
      });
      await selectFolder(selectedFolderId.value);
      const parentFolder = findFolderById(folders.value, selectedFolderId.value);
      if (parentFolder) {
        parentFolder.needsRefresh = true;
        await fetchSubFolders(parentFolder);
      }
    } finally {
      isLoading.value = false;
    }
  };

  const setSort = (field: 'name' | 'kind', order?: 'asc' | 'desc') => {
    if (sortBy.value === field) {
      sortOrder.value = order || (sortOrder.value === 'asc' ? 'desc' : 'asc');
    } else {
      sortBy.value = field;
      sortOrder.value = order || 'asc';
    }
  };

  return {
    folders,
    currentPathItems: computed(() => currentPathItems.value),
    selectedFolderId,
    isLoading,
    isLoadingMore,
    hasMore,
    searchQuery,
    searchResults: computed(() => searchResults.value),
    selectedEntry,
    sortBy,
    sortOrder,
    fetchStructure,
    fetchSubFolders,
    selectFolder,
    findFolderById,
    refreshCurrentFolder,
    search,
    addItem,
    setSort,
    loadMore
  };
}
