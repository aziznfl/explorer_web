<template>
  <div class="folder-tree">
    <TreeNode 
      v-for="folder in folders" 
      :key="folder.id" 
      :folder="folder" 
      :selected-id="selectedId"
      :on-fetch-sub-folders="onFetchSubFolders"
      @select="(id) => $emit('select', id)"
    />
  </div>
</template>

<script setup lang="ts">
import type { FolderTreeNode } from '../models/FolderTreeNode';
import TreeNode from './TreeNode.vue';

defineProps<{
  folders: FolderTreeNode[];
  selectedId: string | null;
  onFetchSubFolders: (folder: FolderTreeNode) => Promise<void>;
}>();

defineEmits<{
  (e: 'select', id: string): void;
}>();
</script>

<style scoped>
.folder-tree {
  padding: 10px;
  overflow-y: auto;
  flex: 1;
}
</style>
