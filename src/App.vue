<template>
  <ExplorerView />
  <ToastNotification />
</template>

<script setup lang="ts">
import ExplorerView from './presentation/views/ExplorerView.vue';
import ToastNotification from './presentation/components/ToastNotification.vue';
import './presentation/styles/main.css';
</script>

<style>
/* Global styles if needed, but we use main.css */
</style>
