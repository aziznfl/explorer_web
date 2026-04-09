<template>
  <div class="explorer-container">
    <aside class="sidebar">
      <div class="sidebar-header">
        <h2>WebExplorer</h2>
      </div>
      <FolderTree 
        :folders="folders" 
        :selected-id="selectedFolderId"
        :on-fetch-sub-folders="fetchSubFolders"
        @select="selectFolder"
      />
    </aside>

    <main class="main-content">
      <header class="top-nav">
        <SearchBar @search="search" />
      </header>
      
      <div v-if="isLoading && !folders.length" class="loader-container">
        <div class="loader"></div>
      </div>
      
      <div v-else class="content-body">
        <div v-if="searchQuery" class="search-results-view fade-in">
          <div class="section-header">
            <h3>Search Results for "{{ searchQuery }}"</h3>
            <SortControl 
              v-model="sortBy" 
              v-model:order="sortOrder"
              @change="setSort"
            />
          </div>
          <FileGrid 
            :items="searchResults" 
            :selected-id="selectedEntry?.id"
            :has-more="hasMore"
            :is-loading-more="isLoadingMore"
            @select="selectedEntry = $event"
            @clear-selection="selectedEntry = null"
            @open="(item) => selectFolder(item.id)"
            @load-more="loadMore"
          />
        </div>
        <div v-else class="folder-view fade-in">
          <div class="section-header">
            <div class="breadcrumbs">
              <span class="breadcrumb-item">My Computer</span>
              <span v-if="selectedFolderName" class="separator">/</span>
              <span v-if="selectedFolderName" class="breadcrumb-item active">{{ selectedFolderName }}</span>
              <button class="refresh-btn" @click="refreshCurrentFolder" title="Refresh">
                🔄
              </button>
            </div>
            <div class="header-actions">
              <SortControl 
                v-model="sortBy" 
                v-model:order="sortOrder"
                @change="setSort"
              />
              <ActionBar 
                v-if="selectedFolderId" 
                :selected-entry="selectedEntry"
                @add="addItem" 
                @rename="onRename"
                @delete="onDelete"
              />
            </div>
          </div>
          <FileGrid 
            :items="currentPathItems" 
            :selected-id="selectedEntry?.id"
            :has-more="hasMore"
            :is-loading-more="isLoadingMore"
            @select="selectedEntry = $event"
            @clear-selection="selectedEntry = null"
            @open="(item) => selectFolder(item.id)"
            @load-more="loadMore"
          />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useExplorer } from '../composables/useExplorer';
import FolderTree from '../components/FolderTree.vue';
import FileGrid from '../components/FileGrid.vue';
import SearchBar from '../components/SearchBar.vue';
import ActionBar from '../components/ActionBar.vue';
import SortControl from '../components/SortControl.vue';

const { 
  folders, 
  currentPathItems, 
  selectedFolderId, 
  isLoading, 
  isLoadingMore,
  hasMore,
  searchQuery, 
  searchResults, 
  selectedEntry,
  sortBy,
  sortOrder,
  fetchStructure, 
  fetchSubFolders,
  selectFolder,
  findFolderById,
  refreshCurrentFolder,
  search,
  addItem,
  setSort,
  loadMore
} = useExplorer();

onMounted(() => {
  fetchStructure();
});

const selectedFolderName = computed(() => {
  if (!selectedFolderId.value || selectedFolderId.value === 'root') return '';
  return findFolderById(folders.value, selectedFolderId.value)?.name ?? '';
});

const onRename = (item: any) => {
  console.log('Skip rename for now', item);
};

const onDelete = (item: any) => {
  console.log('Skip delete for now', item);
};
</script>

<style scoped>
.sidebar-header {
  padding: 24px;
  border-bottom: 1px solid var(--border-color);
}

.sidebar-header h2 {
  font-size: 1.25rem;
  letter-spacing: -0.025em;
  background: linear-gradient(135deg, var(--text-primary), var(--text-secondary));
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.top-nav {
  background: var(--glass-bg);
  backdrop-filter: blur(8px);
  z-index: 10;
}

.content-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.section-header {
  padding: 12px 24px;
  background: rgba(30, 41, 59, 0.3);
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 48px;
}

.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: var(--text-secondary);
  flex: 1;
}

.breadcrumb-item.active {
  color: var(--accent-color);
  font-weight: 600;
}

.separator {
  opacity: 0.3;
}

.loader-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loader {
  width: 40px;
  height: 40px;
  border: 3px solid var(--bg-accent);
  border-top-color: var(--accent-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.search-results-view, .folder-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.refresh-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  margin-left: 8px;
  opacity: 0.6;
}

.refresh-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  opacity: 1;
  transform: rotate(45deg);
}

.refresh-btn:active {
  transform: rotate(180deg);
}
</style>
