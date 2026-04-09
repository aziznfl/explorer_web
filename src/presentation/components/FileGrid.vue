<template>
  <div class="file-grid" @click.self="$emit('clear-selection')">
    <div 
      v-for="item in items" 
      :key="item.id" 
      class="grid-item"
      :class="{ 'is-selected': item.id === selectedId }"
      @click="$emit('select', item)"
      @dblclick="onDoubleClick(item)"
    >
      <div class="icon-wrapper">
        <span v-if="item.type === 'folder'" class="icon folder">📁</span>
        <span v-else class="icon file">📄</span>
      </div>
      <div class="item-name">{{ item.name }}</div>
    </div>
    
    <!-- Loading Sentinel -->
    <div v-if="hasMore" ref="sentinel" class="sentinel">
      <div v-if="isLoadingMore" class="grid-loader"></div>
    </div>

    <div v-if="items.length === 0 && !isLoadingMore" class="empty-state">
      This folder is empty
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import type { ExplorerEntry } from '../../domain/models';

const props = defineProps<{
  items: ExplorerEntry[];
  selectedId?: string | null;
  hasMore?: boolean;
  isLoadingMore?: boolean;
}>();

const emit = defineEmits<{
  (e: 'select', item: ExplorerEntry): void;
  (e: 'open', item: ExplorerEntry): void;
  (e: 'clear-selection'): void;
  (e: 'load-more'): void;
}>();

const sentinel = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;

const onDoubleClick = (item: ExplorerEntry) => {
  if (item.type === 'folder') {
    emit('open', item);
  }
};

const setupObserver = () => {
  if (observer) observer.disconnect();
  
  observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && props.hasMore && !props.isLoadingMore) {
      emit('load-more');
    }
  }, { 
    threshold: 0.1,
    root: null, // use viewport
    rootMargin: '100px' // start loading earlier
  });

  if (sentinel.value) {
    observer.observe(sentinel.value);
  }
};

onMounted(() => {
  setupObserver();
});

onUnmounted(() => {
  if (observer) observer.disconnect();
});

// Watch for changes that should trigger a re-observation
watch([() => props.hasMore, () => props.isLoadingMore], ([hasMore, isLoadingMore]) => {
  if (hasMore && !isLoadingMore) {
    // Small delay to ensure DOM has updated
    setTimeout(() => {
      if (sentinel.value && observer) {
        // Just re-observing ensures we get a fresh entry
        observer.unobserve(sentinel.value);
        observer.observe(sentinel.value);
      }
    }, 100);
  }
});

</script>

<style scoped>
.file-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 20px;
  padding: 20px;
  align-content: start;
  flex: 1;
  overflow-y: auto;
}

.grid-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  border: 1px solid transparent;
}

.grid-item:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
}

.grid-item.is-selected {
  background: var(--primary-light);
  border-color: var(--primary);
}

.icon-wrapper {
  font-size: 48px;
  margin-bottom: 8px;
  filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));
}

.item-name {
  font-size: 0.9rem;
  font-weight: 500;
  word-break: break-all;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}


.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 40px;
  color: #666;
  font-style: italic;
}

.sentinel {
  grid-column: 1 / -1;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.grid-loader {
  width: 24px;
  height: 24px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-top-color: var(--accent-color);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
