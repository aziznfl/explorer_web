import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import SearchBar from '../../src/presentation/components/SearchBar.vue';

describe('SearchBar.vue', () => {
  it('emits search event on input', async () => {
    const wrapper = mount(SearchBar);
    const input = wrapper.find('input');
    
    await input.setValue('test query');
    
    expect(wrapper.emitted()).toHaveProperty('search');
    expect(wrapper.emitted('search')?.[0]).toEqual(['test query']);
  });

  it('clears search when clear button is clicked', async () => {
    const wrapper = mount(SearchBar);
    const input = wrapper.find('input');
    
    await input.setValue('test query');
    const clearBtn = wrapper.find('.clear-btn');
    await clearBtn.trigger('click');
    
    expect(input.element.value).toBe('');
    expect(wrapper.emitted('search')?.slice(-1)[0]).toEqual(['']);
  });
});
