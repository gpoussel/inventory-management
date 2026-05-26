<template>
  <div class="app">
    <AppSidebar
      @show-profile-details="showProfileDetails = true"
      @show-tasks="showTasks = true"
    />
    <div class="app-body">
      <FilterBar />
      <main class="main-content">
        <router-view />
      </main>
    </div>

    <ProfileDetailsModal
      :is-open="showProfileDetails"
      @close="showProfileDetails = false"
    />
    <TasksModal
      :is-open="showTasks"
      :tasks="tasks"
      @close="showTasks = false"
      @add-task="addTask"
      @delete-task="deleteTask"
      @toggle-task="toggleTask"
    />
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { api } from './api'
import { useAuth } from './composables/useAuth'
import { useI18n } from './composables/useI18n'
import FilterBar from './components/FilterBar.vue'
import AppSidebar from './components/AppSidebar.vue'
import ProfileDetailsModal from './components/ProfileDetailsModal.vue'
import TasksModal from './components/TasksModal.vue'

export default {
  name: 'App',
  components: {
    FilterBar,
    AppSidebar,
    ProfileDetailsModal,
    TasksModal
  },
  setup() {
    const { currentUser } = useAuth()
    const { t } = useI18n()
    const showProfileDetails = ref(false)
    const showTasks = ref(false)
    const apiTasks = ref([])
    // Track mutations to mock tasks reactively, since currentUser is a computed
    // whose tasks array is recreated on each evaluation — direct splice/assignment
    // on that array doesn't trigger Vue reactivity.
    const deletedMockTaskIds = ref(new Set())
    const mockTaskStatuses = ref({})

    // Merge mock tasks from currentUser with API tasks
    const tasks = computed(() => {
      const mockTasks = currentUser.value.tasks
        .filter(t => !deletedMockTaskIds.value.has(t.id))
        .map(t => mockTaskStatuses.value[t.id] !== undefined
          ? { ...t, status: mockTaskStatuses.value[t.id] }
          : t
        )
      return [...mockTasks, ...apiTasks.value]
    })

    const loadTasks = async () => {
      try {
        apiTasks.value = await api.getTasks()
      } catch (err) {
        console.error('Failed to load tasks:', err)
      }
    }

    const addTask = async (taskData) => {
      try {
        const newTask = await api.createTask(taskData)
        // Add new task to the beginning of the array
        apiTasks.value.unshift(newTask)
      } catch (err) {
        console.error('Failed to add task:', err)
      }
    }

    const deleteTask = async (taskId) => {
      try {
        // Check if it's a mock task (from currentUser)
        const isMockTask = currentUser.value.tasks.some(t => t.id === taskId)

        if (isMockTask) {
          deletedMockTaskIds.value = new Set([...deletedMockTaskIds.value, taskId])
        } else {
          // Remove from API tasks
          await api.deleteTask(taskId)
          apiTasks.value = apiTasks.value.filter(t => t.id !== taskId)
        }
      } catch (err) {
        console.error('Failed to delete task:', err)
      }
    }

    const toggleTask = async (taskId) => {
      try {
        // Check if it's a mock task (from currentUser)
        const mockTask = currentUser.value.tasks.find(t => t.id === taskId)

        if (mockTask) {
          // Resolve current status (may have been toggled before) then flip it
          const current = mockTaskStatuses.value[taskId] ?? mockTask.status
          mockTaskStatuses.value = { ...mockTaskStatuses.value, [taskId]: current === 'pending' ? 'completed' : 'pending' }
        } else {
          // Toggle API task
          const updatedTask = await api.toggleTask(taskId)
          const index = apiTasks.value.findIndex(t => t.id === taskId)
          if (index !== -1) {
            apiTasks.value[index] = updatedTask
          }
        }
      } catch (err) {
        console.error('Failed to toggle task:', err)
      }
    }

    onMounted(loadTasks)

    return {
      t,
      showProfileDetails,
      showTasks,
      tasks,
      addTask,
      deleteTask,
      toggleTask
    }
  }
}
</script>

<style>
/* ─── Light theme defaults (no data-theme attr = light) ─────────────────── */
:root {
  --bg-app: #f8fafc;
  --bg-surface: #ffffff;
  --bg-sidebar: #ffffff;
  --bg-elevated: #ffffff;
  --bg-hover: #f1f5f9;
  --bg-subtle: #f8fafc;
  --bg-inset: #f8fafc;

  --border-subtle: #f1f5f9;
  --border-default: #e2e8f0;
  --border-strong: #cbd5e1;

  --text-primary: #0f172a;
  --text-secondary: #475569;
  --text-tertiary: #64748b;
  --text-muted: #94a3b8;
  --text-inverse: #ffffff;

  --accent: #3b82f6;
  --accent-hover: #2563eb;
  --accent-active: #1d4ed8;
  --accent-soft-bg: #eff6ff;
  --accent-soft-text: #1d4ed8;
  --accent-ring: rgba(59, 130, 246, 0.25);
  --accent-gradient: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);

  --success-bg: #dcfce7;
  --success-text: #15803d;
  --success-solid: #16a34a;
  --warning-bg: #fef3c7;
  --warning-text: #b45309;
  --warning-solid: #d97706;
  --danger-bg: #fee2e2;
  --danger-text: #b91c1c;
  --danger-solid: #dc2626;
  --info-bg: #dbeafe;
  --info-text: #1d4ed8;
  --info-solid: #3b82f6;

  --shadow-xs: 0 1px 2px rgba(15, 23, 42, 0.04);
  --shadow-sm: 0 1px 2px rgba(15, 23, 42, 0.04), 0 1px 3px rgba(15, 23, 42, 0.06);
  --shadow-md: 0 4px 6px -1px rgba(15, 23, 42, 0.06), 0 2px 4px -2px rgba(15, 23, 42, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.06);
  --shadow-xl: 0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.08);

  /* Theme-independent tokens */
  --radius-xs: 4px;
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-pill: 999px;

  --font-mono: 'SF Mono', 'JetBrains Mono', Menlo, Monaco, Consolas, monospace;
  --sidebar-w: 248px;
  --transition-fast: 120ms cubic-bezier(0.16, 1, 0.3, 1);
  --transition-base: 200ms cubic-bezier(0.16, 1, 0.3, 1);

  color-scheme: light;
}

/* ─── Explicit light theme ───────────────────────────────────────────────── */
[data-theme="light"] {
  --bg-app: #f8fafc;
  --bg-surface: #ffffff;
  --bg-sidebar: #ffffff;
  --bg-elevated: #ffffff;
  --bg-hover: #f1f5f9;
  --bg-subtle: #f8fafc;
  --bg-inset: #f8fafc;

  --border-subtle: #f1f5f9;
  --border-default: #e2e8f0;
  --border-strong: #cbd5e1;

  --text-primary: #0f172a;
  --text-secondary: #475569;
  --text-tertiary: #64748b;
  --text-muted: #94a3b8;
  --text-inverse: #ffffff;

  --accent: #3b82f6;
  --accent-hover: #2563eb;
  --accent-active: #1d4ed8;
  --accent-soft-bg: #eff6ff;
  --accent-soft-text: #1d4ed8;
  --accent-ring: rgba(59, 130, 246, 0.25);
  --accent-gradient: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);

  --success-bg: #dcfce7;
  --success-text: #15803d;
  --success-solid: #16a34a;
  --warning-bg: #fef3c7;
  --warning-text: #b45309;
  --warning-solid: #d97706;
  --danger-bg: #fee2e2;
  --danger-text: #b91c1c;
  --danger-solid: #dc2626;
  --info-bg: #dbeafe;
  --info-text: #1d4ed8;
  --info-solid: #3b82f6;

  --shadow-xs: 0 1px 2px rgba(15, 23, 42, 0.04);
  --shadow-sm: 0 1px 2px rgba(15, 23, 42, 0.04), 0 1px 3px rgba(15, 23, 42, 0.06);
  --shadow-md: 0 4px 6px -1px rgba(15, 23, 42, 0.06), 0 2px 4px -2px rgba(15, 23, 42, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.06);
  --shadow-xl: 0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.08);

  color-scheme: light;
}

/* ─── Dark theme ─────────────────────────────────────────────────────────── */
[data-theme="dark"] {
  --bg-app: #0b1120;
  --bg-surface: #131c2e;
  --bg-sidebar: #0f172a;
  --bg-elevated: #1a2540;
  --bg-hover: #1e293b;
  --bg-subtle: #131c2e;
  --bg-inset: #0a101c;

  --border-subtle: #1e293b;
  --border-default: #1e293b;
  --border-strong: #334155;

  --text-primary: #f1f5f9;
  --text-secondary: #cbd5e1;
  --text-tertiary: #94a3b8;
  --text-muted: #64748b;
  --text-inverse: #0f172a;

  --accent: #60a5fa;
  --accent-hover: #93c5fd;
  --accent-active: #bfdbfe;
  --accent-soft-bg: rgba(59, 130, 246, 0.12);
  --accent-soft-text: #93c5fd;
  --accent-ring: rgba(96, 165, 250, 0.3);
  --accent-gradient: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);

  --success-bg: rgba(34, 197, 94, 0.12);
  --success-text: #86efac;
  --success-solid: #22c55e;
  --warning-bg: rgba(245, 158, 11, 0.14);
  --warning-text: #fcd34d;
  --warning-solid: #f59e0b;
  --danger-bg: rgba(239, 68, 68, 0.14);
  --danger-text: #fca5a5;
  --danger-solid: #ef4444;
  --info-bg: rgba(59, 130, 246, 0.14);
  --info-text: #93c5fd;
  --info-solid: #60a5fa;

  --shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.3);
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.4);
  --shadow-md: 0 4px 8px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 10px 20px rgba(0, 0, 0, 0.45);
  --shadow-xl: 0 20px 40px rgba(0, 0, 0, 0.5);

  color-scheme: dark;
}

/* ─── Reset ──────────────────────────────────────────────────────────────── */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* ─── Scrollbar (webkit) ─────────────────────────────────────────────────── */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track {
  background: var(--bg-subtle);
}
::-webkit-scrollbar-thumb {
  background: var(--border-strong);
  border-radius: var(--radius-pill);
}
::-webkit-scrollbar-thumb:hover {
  background: var(--text-muted);
}

/* Firefox scrollbar */
* {
  scrollbar-width: thin;
  scrollbar-color: var(--border-strong) var(--bg-subtle);
}

/* ─── Body ───────────────────────────────────────────────────────────────── */
body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background: var(--bg-app);
  color: var(--text-primary);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  transition: background-color 200ms ease, color 200ms ease;
}

/* ─── Layout ─────────────────────────────────────────────────────────────── */
.app {
  display: flex;
  flex-direction: row;
  min-height: 100vh;
}

.app-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  background: var(--bg-app);
}

.main-content {
  flex: 1;
  padding: 24px 32px;
  max-width: 1600px;
  width: 100%;
}

/* ─── Page header ────────────────────────────────────────────────────────── */
.page-header {
  margin-bottom: 1.5rem;
}

.page-header h2 {
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.375rem;
  letter-spacing: -0.025em;
}

.page-header p {
  color: var(--text-tertiary);
  font-size: 0.938rem;
}

/* ─── Stats grid ─────────────────────────────────────────────────────────── */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.25rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  background: var(--bg-surface);
  padding: 1.25rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-default);
  box-shadow: var(--shadow-xs);
}

.stat-card:hover {
  border-color: var(--border-strong);
  box-shadow: var(--shadow-md);
}

.stat-label {
  color: var(--text-tertiary);
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.625rem;
}

.stat-value {
  font-size: 2.25rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.025em;
}

.stat-card.warning .stat-value {
  color: var(--warning-solid);
}

.stat-card.success .stat-value {
  color: var(--success-solid);
}

.stat-card.danger .stat-value {
  color: var(--danger-solid);
}

.stat-card.info .stat-value {
  color: var(--info-solid);
}

/* ─── Card ───────────────────────────────────────────────────────────────── */
.card {
  background: var(--bg-surface);
  border-radius: var(--radius-lg);
  padding: 1.25rem;
  border: 1px solid var(--border-default);
  box-shadow: var(--shadow-xs);
  margin-bottom: 1.25rem;
}

.card:hover {
  border-color: var(--border-strong);
  box-shadow: var(--shadow-md);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.875rem;
  border-bottom: 1px solid var(--border-default);
}

.card-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.025em;
}

/* ─── Table ──────────────────────────────────────────────────────────────── */
.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: var(--bg-subtle);
  border-top: 1px solid var(--border-default);
  border-bottom: 1px solid var(--border-default);
}

th {
  text-align: left;
  padding: 0.5rem 0.75rem;
  font-weight: 600;
  color: var(--text-secondary);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

td {
  padding: 0.5rem 0.75rem;
  border-top: 1px solid var(--border-subtle);
  color: var(--text-secondary);
  font-size: 0.875rem;
}

tbody tr {
  transition: background-color var(--transition-fast);
}

tbody tr:hover {
  background: var(--bg-hover);
}

/* Zebra striping helps readability, especially in dark mode */
tbody tr:nth-child(even) {
  background: var(--bg-subtle);
}

tbody tr:nth-child(even):hover {
  background: var(--bg-hover);
}

/* ─── Badges ─────────────────────────────────────────────────────────────── */
.badge {
  display: inline-block;
  padding: 0.313rem 0.75rem;
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.badge.success {
  background: var(--success-bg);
  color: var(--success-text);
}

.badge.warning {
  background: var(--warning-bg);
  color: var(--warning-text);
}

.badge.danger {
  background: var(--danger-bg);
  color: var(--danger-text);
}

.badge.info {
  background: var(--info-bg);
  color: var(--info-text);
}

.badge.increasing {
  background: var(--success-bg);
  color: var(--success-text);
}

.badge.decreasing {
  background: var(--danger-bg);
  color: var(--danger-text);
}

.badge.stable {
  background: var(--info-bg);
  color: var(--info-text);
}

.badge.high {
  background: var(--danger-bg);
  color: var(--danger-text);
}

.badge.medium {
  background: var(--warning-bg);
  color: var(--warning-text);
}

.badge.low {
  background: var(--info-bg);
  color: var(--info-text);
}

/* ─── Feedback states ────────────────────────────────────────────────────── */
.loading {
  text-align: center;
  padding: 3rem;
  color: var(--text-tertiary);
  font-size: 0.938rem;
}

.error {
  background: var(--danger-bg);
  border: 1px solid var(--danger-solid);
  color: var(--danger-text);
  padding: 1rem;
  border-radius: var(--radius-md);
  margin: 1rem 0;
  font-size: 0.938rem;
}

/* ─── Button utilities ───────────────────────────────────────────────────── */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-sm);
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid var(--border-default);
  background: var(--bg-surface);
  color: var(--text-primary);
  transition: border-color var(--transition-fast), background var(--transition-fast), box-shadow var(--transition-fast);
}

.btn:hover {
  border-color: var(--border-strong);
  background: var(--bg-hover);
}

.btn-primary {
  background: var(--accent);
  border-color: var(--accent);
  color: var(--text-inverse);
}

.btn-primary:hover {
  background: var(--accent-hover);
  border-color: var(--accent-hover);
}

.btn-primary:active {
  background: var(--accent-active);
  border-color: var(--accent-active);
}
</style>
