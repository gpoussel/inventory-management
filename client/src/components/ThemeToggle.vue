<template>
  <button class="theme-button" @click="toggleTheme" :title="resolvedTheme === 'dark' ? t('theme.light') : t('theme.dark')">
    <span class="theme-label">{{ t('theme.label') }}</span>
    <!-- Sun icon — shown when currently dark (click = go light) -->
    <svg
      v-if="resolvedTheme === 'dark'"
      class="theme-icon"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
    >
      <circle cx="9" cy="9" r="3.5" stroke="currentColor" stroke-width="1.5"/>
      <path d="M9 1.5V3M9 15V16.5M1.5 9H3M15 9H16.5M3.697 3.697L4.757 4.757M13.243 13.243L14.303 14.303M14.303 3.697L13.243 4.757M4.757 13.243L3.697 14.303" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>
    <!-- Moon icon — shown when currently light (click = go dark) -->
    <svg
      v-else
      class="theme-icon"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
    >
      <path d="M15.5 10.5A7 7 0 1 1 7.5 2.5a5 5 0 0 0 8 8z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </button>
</template>

<script setup>
import { useTheme } from '../composables/useTheme'
import { useI18n } from '../composables/useI18n'

const { resolvedTheme, toggleTheme } = useTheme()
const { t } = useI18n()
</script>

<style scoped>
.theme-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.875rem;
  width: 100%;
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  cursor: pointer;
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
  transition: background var(--transition-fast), border-color var(--transition-fast);
}

.theme-button:hover {
  background: var(--bg-hover);
  border-color: var(--border-strong);
}

.theme-label {
  flex: 1;
  text-align: left;
}

.theme-icon {
  color: var(--text-tertiary);
  flex-shrink: 0;
  transition: transform var(--transition-base);
}

.theme-button:hover .theme-icon {
  color: var(--accent);
  transform: rotate(15deg);
}
</style>
