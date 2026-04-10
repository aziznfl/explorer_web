import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MockExplorerRepository } from '../mocks/MockExplorerRepository';

const mockRepo = new MockExplorerRepository();

vi.mock('../../src/infrastructure/repositories/FileItemRepository', () => ({
  FileItemRepository: class {
    getFolderChildren(...args: Parameters<MockExplorerRepository['getFolderChildren']>) {
      return mockRepo.getFolderChildren(...args);
    }
    searchEntries(...args: Parameters<MockExplorerRepository['searchEntries']>) {
      return mockRepo.searchEntries(...args);
    }
    createEntry(...args: Parameters<MockExplorerRepository['createEntry']>) {
      return mockRepo.createEntry(...args);
    }
    updateEntry(...args: Parameters<MockExplorerRepository['updateEntry']>) {
      return mockRepo.updateEntry(...args);
    }
    deleteEntry(...args: Parameters<MockExplorerRepository['deleteEntry']>) {
      return mockRepo.deleteEntry(...args);
    }
  },
}));

import { useExplorer } from '../../src/presentation/composables/useExplorer';

describe('Explorer Integration', () => {
  let explorer: ReturnType<typeof useExplorer>;

  beforeEach(() => {
    explorer = useExplorer();
  });

  it('initially has no selected entry and is not loading', () => {
    expect(explorer.selectedEntry.value).toBeNull();
    expect(explorer.isLoading.value).toBe(false);
  });

  it('fetches structure and builds root node with children', async () => {
    await explorer.fetchStructure();

    const rootNode = explorer.folders.value[0];
    expect(rootNode.name).toBe('My Computer');
    expect(rootNode.children?.length).toBeGreaterThan(0);
    expect(rootNode.children?.[0].name).toBe('Documents');
  });

  it('selects a folder and fetches its contents', async () => {
    await explorer.fetchStructure();
    const documentsFolderId = explorer.folders.value[0].children?.[0].id ?? '1';

    await explorer.selectFolder(documentsFolderId);

    expect(explorer.selectedFolderId.value).toBe(documentsFolderId);
    expect(explorer.currentPathItems.value.length).toBeGreaterThan(0);
    expect(explorer.currentPathItems.value.some(item => item.name === 'Work')).toBe(true);
  });

  it('performs search across structure', async () => {
    vi.useFakeTimers();

    // Trigger search
    explorer.search('Resume');
    
    // Advance timers by more than debounce (300ms) + mock delay (10ms)
    await vi.advanceTimersByTimeAsync(400);

    vi.useRealTimers();

    expect(explorer.searchResults.value.length).toBe(1);
    expect(explorer.searchResults.value[0].name).toBe('Resume.pdf');
  });

  it('clears search results on empty query', async () => {
    await explorer.search('');
    expect(explorer.searchResults.value).toEqual([]);
  });
});
