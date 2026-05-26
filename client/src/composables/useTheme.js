import { ref, watch } from 'vue'

// Singleton state shared across all component instances
const theme = ref(localStorage.getItem('theme') || 'system')
const resolvedTheme = ref('light')

function resolve(preference) {
  if (preference === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return preference
}

function applyTheme(resolved) {
  document.documentElement.dataset.theme = resolved
  resolvedTheme.value = resolved
}

// Initial application
applyTheme(resolve(theme.value))

// System media query listener — only active when preference is 'system'
const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

function onSystemChange(e) {
  if (theme.value === 'system') {
    applyTheme(e.matches ? 'dark' : 'light')
  }
}

mediaQuery.addEventListener('change', onSystemChange)

// Keep DOM in sync whenever the stored preference changes
watch(theme, (newPref) => {
  localStorage.setItem('theme', newPref)
  applyTheme(resolve(newPref))
})

function setTheme(t) {
  theme.value = t
}

function toggleTheme() {
  // Cycles only between light and dark, ignoring system
  theme.value = resolvedTheme.value === 'dark' ? 'light' : 'dark'
}

export function useTheme() {
  return { theme, resolvedTheme, setTheme, toggleTheme }
}
