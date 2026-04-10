import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import FileGrid from '../../src/presentation/components/FileGrid.vue';
import type { ExplorerEntry } from '../../src/domain/models';

describe('FileGrid.vue', () => {
  const mockItems: ExplorerEntry[] = [
    { id: '1', name: 'Folder 1', type: 'folder', parentId: null, path: '/Folder 1' } as any,
    { id: '2', name: 'File 1.txt', type: 'file', parentId: null, path: '/File 1.txt' } as any,
  ];

  it('renders items correctly', () => {
    const wrapper = mount(FileGrid, { props: { items: mockItems } });

    expect(wrapper.text()).toContain('Folder 1');
    expect(wrapper.text()).toContain('File 1.txt');
  });

  it('emits open event on double click folder', async () => {
    const wrapper = mount(FileGrid, { props: { items: mockItems } });

    const folderItem = wrapper.findAll('.grid-item')[0];
    await folderItem.trigger('dblclick');

    expect(wrapper.emitted()).toHaveProperty('open');
    expect(wrapper.emitted('open')?.[0]).toEqual([mockItems[0]]);
  });

  it('does not emit open event on double click file', async () => {
    const wrapper = mount(FileGrid, { props: { items: mockItems } });

    const fileItem = wrapper.findAll('.grid-item')[1];
    await fileItem.trigger('dblclick');

    expect(wrapper.emitted()).not.toHaveProperty('open');
  });

  it('emits select event on click', async () => {
    const wrapper = mount(FileGrid, { props: { items: mockItems } });

    const item = wrapper.findAll('.grid-item')[0];
    await item.trigger('click');

    expect(wrapper.emitted()).toHaveProperty('select');
    expect(wrapper.emitted('select')?.[0]).toEqual([mockItems[0]]);
  });

  it('renders empty state when no items', () => {
    const wrapper = mount(FileGrid, { props: { items: [] } });

    expect(wrapper.text()).toContain('This folder is empty');
  });

  it('shows sentinel when hasMore is true', () => {
    const wrapper = mount(FileGrid, { props: { items: mockItems, hasMore: true } });

    expect(wrapper.find('.sentinel').exists()).toBe(true);
  });
});
