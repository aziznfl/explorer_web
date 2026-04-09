<template>
  <div class="search-bar">
    <div class="search-input-wrapper">
      <span class="search-icon">🔍</span>
      <input 
        type="text" 
        v-model="query" 
        placeholder="Search files and folders..."
        @input="handleInput"
      />
      <button v-if="query" class="clear-btn" @click="clearSearch">✕</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const query = ref('');
const emit = defineEmits<{
  (e: 'search', q: string): void;
}>();

const handleInput = () => {
  emit('search', query.value);
};

const clearSearch = () => {
  query.value = '';
  emit('search', '');
};
</script>

<style scoped>
.search-bar {
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background: var(--bg-secondary);
  border-radius: 8px;
  padding: 0 12px;
  border: 1px solid var(--border-color);
  transition: border-color 0.2s;
}

.search-input-wrapper:focus-within {
  border-color: var(--accent-color);
}

.search-icon {
  font-size: 14px;
  color: var(--text-secondary);
}

input {
  background: transparent;
  border: none;
  color: var(--text-primary);
  padding: 10px 8px;
  width: 100%;
  outline: none;
  font-size: 0.9rem;
}

.clear-btn {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 4px;
  font-size: 12px;
}

.clear-btn:hover {
  color: var(--text-primary);
}
</style>
