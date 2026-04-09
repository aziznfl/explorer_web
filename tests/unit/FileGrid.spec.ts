import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import FileGrid from '../../src/presentation/components/FileGrid.vue';
import { ExplorerEntry } from '../../src/core/domain/models';

describe('FileGrid.vue', () => {
  const mockItems: ExplorerEntry[] = [
    { id: '1', name: 'Folder 1', type: 'folder', parentId: null, path: '/Folder 1' },
    { id: '2', name: 'File 1.txt', type: 'file', parentId: null, path: '/File 1.txt' },
  ];

  it('renders items correctly', () => {
    const wrapper = mount(FileGrid, {
      props: {
        items: mockItems
      }
    });

    expect(wrapper.text()).toContain('Folder 1');
    expect(wrapper.text()).toContain('File 1.txt');
  });

  it('emits navigate event on double click folder', async () => {
    const wrapper = mount(FileGrid, {
      props: {
        items: mockItems
      }
    });

    const folderItem = wrapper.findAll('.file-item')[0];
    await folderItem.trigger('dblclick');

    expect(wrapper.emitted()).toHaveProperty('navigate');
    expect(wrapper.emitted('navigate')?.[0]).toEqual(['1']);
  });

  it('does not emit navigate event on double click file', async () => {
    const wrapper = mount(FileGrid, {
      props: {
        items: mockItems
      }
    });

    const fileItem = wrapper.findAll('.file-item')[1];
    await fileItem.trigger('dblclick');

    expect(wrapper.emitted()).not.toHaveProperty('navigate');
  });

  it('renders empty state when no items', () => {
    const wrapper = mount(FileGrid, {
      props: {
        items: []
      }
    });

    expect(wrapper.text()).toContain('This folder is empty');
  });
});
