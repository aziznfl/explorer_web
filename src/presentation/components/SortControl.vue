<template>
  <div class="sort-control">
    <div class="sort-label">Sort by:</div>
    <div class="sort-options">
      <button 
        class="sort-button" 
        :class="{ active: modelValue === 'name' }"
        @click="handleSort('name')"
      >
        Name
        <span v-if="modelValue === 'name'" class="sort-icon">
          {{ order === 'asc' ? '↑' : '↓' }}
        </span>
      </button>
      <button 
        class="sort-button" 
        :class="{ active: modelValue === 'kind' }"
        @click="handleSort('kind')"
      >
        Kind
        <span v-if="modelValue === 'kind'" class="sort-icon">
          {{ order === 'asc' ? '↑' : '↓' }}
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: 'name' | 'kind';
  order: 'asc' | 'desc';
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: 'name' | 'kind'): void;
  (e: 'update:order', value: 'asc' | 'desc'): void;
  (e: 'change', field: 'name' | 'kind', order: 'asc' | 'desc'): void;
}>();

const handleSort = (field: 'name' | 'kind') => {
  let newOrder: 'asc' | 'desc' = 'asc';
  
  if (props.modelValue === field) {
    newOrder = props.order === 'asc' ? 'desc' : 'asc';
  }
  
  emit('update:modelValue', field);
  emit('update:order', newOrder);
  emit('change', field, newOrder);
};
</script>

<style scoped>
.sort-control {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.03);
  padding: 4px 12px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.sort-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
}

.sort-options {
  display: flex;
  gap: 4px;
}

.sort-button {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-size: 0.8rem;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease;
}

.sort-button:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-primary);
}

.sort-button.active {
  background: rgba(100, 108, 255, 0.15);
  color: var(--accent-color);
  font-weight: 600;
}

.sort-icon {
  font-size: 0.9rem;
  line-height: 1;
}
</style>
