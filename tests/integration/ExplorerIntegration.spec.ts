import { describe, it, expect, beforeEach } from 'vitest';
import { useExplorer } from '../../src/presentation/composables/useExplorer';

describe('Explorer Integration', () => {
  let explorer: ReturnType<typeof useExplorer>;

  beforeEach(() => {
    explorer = useExplorer();
  });

  it('initially has empty state', () => {
    expect(explorer.folders.value).toEqual([]);
    expect(explorer.currentPathItems.value).toEqual([]);
    expect(explorer.selectedFolderId.value).toBeNull();
  });

  it('fetches structure on demand', async () => {
    await explorer.fetchStructure();
    expect(explorer.folders.value.length).toBeGreaterThan(0);
    expect(explorer.folders.value[0].name).toBe('Documents');
  });

  it('selects a folder and fetches its contents', async () => {
    await explorer.fetchStructure();
    const firstFolderId = explorer.folders.value[0].id; // "1" for Documents
    
    await explorer.selectFolder(firstFolderId);
    
    expect(explorer.selectedFolderId.value).toBe(firstFolderId);
    expect(explorer.currentPathItems.value.length).toBeGreaterThan(0);
    // Work and Private folders
    expect(explorer.currentPathItems.value.some(item => item.name === 'Work')).toBe(true);
  });

  it('performs search across the structure', async () => {
    await explorer.search('Resume');
    expect(explorer.searchResults.value.length).toBe(1);
    expect(explorer.searchResults.value[0].name).toBe('Resume.pdf');
  });
});
