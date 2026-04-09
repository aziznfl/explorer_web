<template>
  <Teleport to="body">
    <div class="toast-container">
      <TransitionGroup name="toast">
        <div 
          v-if="errorState.lastError" 
          :key="errorState.lastError.timestamp"
          class="toast error shadow-lg"
        >
          <div class="toast-icon">⚠️</div>
          <div class="toast-content">
            <div class="toast-title">API Error {{ errorState.lastError.status ? `(${errorState.lastError.status})` : '' }}</div>
            <div class="toast-message">{{ errorState.lastError.message }}</div>
          </div>
          <button class="toast-close" @click="clearLast">✕</button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { errorState } from '../../infrastructure/api/ErrorHandler';

const clearLast = () => {
  errorState.lastError = null;
};
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 12px;
  pointer-events: none;
}

.toast {
  pointer-events: auto;
  min-width: 320px;
  max-width: 450px;
  background: rgba(15, 23, 42, 0.9);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-left: 4px solid #ef4444;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2);
}

.toast-icon {
  font-size: 1.25rem;
  margin-top: 2px;
}

.toast-content {
  flex: 1;
}

.toast-title {
  font-weight: 600;
  color: #f8fafc;
  font-size: 0.875rem;
  margin-bottom: 4px;
}

.toast-message {
  color: #94a3b8;
  font-size: 0.8125rem;
  line-height: 1.5;
}

.toast-close {
  background: transparent;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 4px;
  font-size: 0.75rem;
  transition: color 0.2s;
}

.toast-close:hover {
  color: #f8fafc;
}

/* Transitions */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(30px) scale(0.95);
}

.toast-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
