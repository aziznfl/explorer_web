<template>
  <div class="action-bar">
    <template v-if="selectedEntry">
      <button class="btn btn-secondary" @click="$emit('rename', selectedEntry)">
        <span class="icon">✏️</span>
        Rename
      </button>
      <button class="btn btn-danger" @click="$emit('delete', selectedEntry)">
        <span class="icon">🗑️</span>
        Delete
      </button>
    </template>
    <template v-else>
      <button class="btn btn-primary" @click="showAddDialog('folder')">
        <span class="icon">📁+</span>
        New Folder
      </button>
      <button class="btn btn-secondary" @click="showAddDialog('file')">
        <span class="icon">📄+</span>
        New File
      </button>
    </template>

    <!-- Simple Overlay Dialog -->
    <Teleport to="body">
      <div v-if="isDialogVisible" class="dialog-overlay" @click.self="closeDialog">
        <div class="dialog-content fade-in">
          <h3>Create New {{ activeType === 'folder' ? 'Folder' : 'File' }}</h3>
          <div class="input-group">
            <input 
              v-model="newItemName" 
              type="text" 
              :placeholder="activeType === 'folder' ? 'Folder name...' : 'File name...'"
              @keyup.enter="confirmAdd"
              ref="nameInput"
            />
          </div>
          <div class="dialog-actions">
            <button class="btn btn-ghost" @click="closeDialog">Cancel</button>
            <button class="btn btn-primary" :disabled="!newItemName" @click="confirmAdd">Create</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';

import type { ExplorerEntry } from '../../domain/models';

defineProps<{
  selectedEntry?: ExplorerEntry | null;
}>();

const emit = defineEmits<{
  (e: 'add', name: string, type: 'file' | 'folder'): void;
  (e: 'rename', item: ExplorerEntry): void;
  (e: 'delete', item: ExplorerEntry): void;
}>();

const isDialogVisible = ref(false);
const activeType = ref<'file' | 'folder'>('folder');
const newItemName = ref('');
const nameInput = ref<HTMLInputElement | null>(null);

const showAddDialog = (type: 'file' | 'folder') => {
  activeType.value = type;
  newItemName.value = '';
  isDialogVisible.value = true;
  nextTick(() => {
    nameInput.value?.focus();
  });
};

const closeDialog = () => {
  isDialogVisible.value = false;
};

const confirmAdd = () => {
  if (newItemName.value) {
    emit('add', newItemName.value, activeType.value);
    closeDialog();
  }
};
</script>

<style scoped>
.action-bar {
  display: flex;
  gap: 12px;
  padding: 0 24px;
}

.btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid transparent;
}

.btn-primary {
  background: var(--accent-color);
  color: white;
}

.btn-primary:hover {
  background: var(--accent-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-primary);
  border-color: rgba(255, 255, 255, 0.1);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
}

.btn-ghost {
  background: transparent;
  color: var(--text-secondary);
}

.btn-ghost:hover {
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.05);
}

.btn-danger {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border-color: rgba(239, 68, 68, 0.2);
}

.btn-danger:hover {
  background: rgba(239, 68, 68, 0.2);
  color: #f87171;
}

.dialog-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.dialog-content {
  background: #1e293b;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.dialog-content h3 {
  margin-bottom: 20px;
  font-size: 1.125rem;
  color: var(--text-primary);
}

.input-group {
  margin-bottom: 24px;
}

.input-group input {
  width: 100%;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 12px 16px;
  color: var(--text-primary);
  outline: none;
  transition: border-color 0.2s;
}

.input-group input:focus {
  border-color: var(--accent-color);
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.icon {
  font-size: 1.1em;
}
</style>
