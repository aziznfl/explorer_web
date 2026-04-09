<template>
  <div class="tree-node">
    <div 
      class="node-content" 
      :class="{ 'is-selected': isSelected }"
      @click="handleFolderClick"
    >
      <div v-if="folder.isLoading" class="toggle-icon loading">
        <div class="mini-loader"></div>
      </div>
      <span 
        v-else-if="hasChildren || !folder.isLoaded" 
        class="toggle-icon" 
        :class="{ 'is-open': isOpen, 'disabled': folder.isLoaded && !hasChildren }" 
        @click.stop="toggleOpen"
      >
        ▶
      </span>
      <span v-else class="toggle-spacer"></span>
      <span class="folder-icon">{{ folder.id === 'root' ? '💻' : '📁' }}</span>
      <span class="node-name">{{ folder.name }}</span>
    </div>
    
    <div v-if="isOpen && hasChildren" class="node-children">
      <TreeNode 
        v-for="child in folderChildren" 
        :key="child.id" 
        :folder="child" 
        :selected-id="selectedId"
        :on-fetch-sub-folders="onFetchSubFolders"
        @select="(id) => $emit('select', id)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { FolderTreeNode } from '../models/FolderTreeNode';

const props = defineProps<{
  folder: FolderTreeNode;
  selectedId: string | null;
  onFetchSubFolders: (folder: FolderTreeNode) => Promise<void>;
}>();

const emit = defineEmits<{
  (e: 'select', id: string): void;
}>();

const isOpen = ref(props.folder.id === 'root');

const isSelected = computed(() => props.selectedId === props.folder.id);

const folderChildren = computed(() => {
  return (props.folder.children || []) as FolderTreeNode[];
});

const hasChildren = computed(() => folderChildren.value.length > 0);

const handleFolderClick = () => {
  emit('select', props.folder.id);
  if (!isOpen.value && (!props.folder.isLoaded || hasChildren.value)) {
    toggleOpen();
  }
};

const toggleOpen = async () => {
  if (props.folder.isLoaded && !hasChildren.value) return;
  
  isOpen.value = !isOpen.value;
  if (isOpen.value && !props.folder.isLoaded) {
    await props.onFetchSubFolders(props.folder);
  }
};

onMounted(() => {
  if (isOpen.value && !props.folder.isLoaded) {
    props.onFetchSubFolders(props.folder);
  }
});
</script>

<style scoped>
.tree-node {
  user-select: none;
}

.node-content {
  display: flex;
  align-items: center;
  padding: 6px 12px;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  margin: 2px 0;
  gap: 10px;
}

.node-content:hover {
  background: rgba(255, 255, 255, 0.05);
}

.node-content.is-selected {
  background: var(--accent-color);
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.toggle-icon {
  font-size: 8px;
  transition: transform 0.2s;
  color: var(--text-secondary);
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

.toggle-icon:hover:not(.disabled) {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
}

.toggle-icon.is-open {
  transform: rotate(90deg);
}

.toggle-icon.disabled {
  opacity: 0.2;
  cursor: default;
}

.mini-loader {
  width: 10px;
  height: 10px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-top-color: var(--accent-color);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.toggle-spacer {
  width: 16px;
}

.folder-icon {
  font-size: 16px;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
}

.node-name {
  font-size: 0.85rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.node-children {
  padding-left: 14px;
  border-left: 1px solid rgba(255, 255, 255, 0.05);
  margin-left: 7px;
}
</style>
