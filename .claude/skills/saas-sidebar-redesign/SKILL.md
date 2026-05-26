---
name: saas-sidebar-redesign
description: Use when redesigning this inventory management app's layout from a horizontal top-nav to a SaaS-style vertical sidebar. Triggered by requests to implement sidebar navigation, convert the top-nav layout, or give the app a Notion/Linear-style UI refresh.
---

# SaaS Sidebar Redesign

## Overview

Converts `App.vue` from a column layout (top-nav → FilterBar → content) to a row layout (sidebar | content column). Visual target: **Notion/Linear light** — off-white sidebar, clean hairline borders, compact 14px nav items, white content area.

**Always delegate all `.vue` file changes to the `vue-expert` subagent.**

## What Changes, What Doesn't

| Action | File | Change |
|--------|------|--------|
| Modify | `client/src/App.vue` | New template, updated global styles |
| Create | `client/src/components/AppSidebar.vue` | New sidebar shell component |
| Modify | `client/src/components/FilterBar.vue` | Fix sticky `top` value (see below) |

**Do NOT touch:** individual view files, `api.js`, composables, `main.js`, or router.

**Do NOT remove** any global styles in `App.vue` — `.stat-card`, `.card`, `.badge`, `.table-container`, `table`, `th`, `td`, `.loading`, `.error` are used by every view.

---

## Step 1 — Add Design Tokens to App.vue

Add a `:root` block at the top of the global `<style>` in `App.vue`:

```css
:root {
  --sidebar-w: 240px;
  --sidebar-bg: #f9f9f8;
  --sidebar-border: #e8e8e4;
  --nav-hover:  #ebebea;
  --nav-active: #e8e8e6;
  --body-bg: #ffffff;
  --text-primary: #37352f;
  --text-muted:   #9b9a97;
  --accent: #2563eb;
}
```

---

## Step 2 — Replace App.vue Layout Styles

Remove these classes entirely from App.vue global styles:
`.top-nav`, `.nav-container`, `.nav-tabs`, `.logo`, `.subtitle`

Replace `.app` and `.main-content` with:

```css
.app {
  display: flex;
  flex-direction: row;
  min-height: 100vh;
}

.app-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;        /* prevents flex children from overflowing */
  background: var(--body-bg);
}

.main-content {
  flex: 1;
  padding: 24px 32px;
  max-width: 1600px;
  width: 100%;
}
```

---

## Step 3 — Replace App.vue Template

Replace the entire `<template>` block. Move nav links, `LanguageSwitcher`, and `ProfileMenu` into `AppSidebar`. Keep `FilterBar` at the top of `.app-body`. Keep all modals unchanged.

```vue
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
```

Add `AppSidebar` to the `<script>` imports and `components` object. Remove the `LanguageSwitcher` and `ProfileMenu` imports — they now live in `AppSidebar.vue`.

---

## Step 4 — Fix FilterBar Sticky Offset

In `FilterBar.vue`, the sticky position is hardcoded to the old top-nav height. Update:

```css
/* was: top: 70px — references the removed top-nav */
.filters-bar {
  top: 0;
}
```

---

## Step 5 — Create AppSidebar.vue

Full component at `client/src/components/AppSidebar.vue`:

```vue
<template>
  <aside class="sidebar">
    <div class="sidebar-brand">
      <div class="brand-name">{{ t('nav.companyName') }}</div>
      <div class="brand-sub">{{ t('nav.subtitle') }}</div>
    </div>

    <nav class="sidebar-nav">
      <router-link to="/" :class="{ 'nav-active': $route.path === '/' }">
        {{ t('nav.overview') }}
      </router-link>
      <router-link to="/inventory" :class="{ 'nav-active': $route.path === '/inventory' }">
        {{ t('nav.inventory') }}
      </router-link>
      <router-link to="/orders" :class="{ 'nav-active': $route.path === '/orders' }">
        {{ t('nav.orders') }}
      </router-link>
      <router-link to="/spending" :class="{ 'nav-active': $route.path === '/spending' }">
        {{ t('nav.finance') }}
      </router-link>
      <router-link to="/demand" :class="{ 'nav-active': $route.path === '/demand' }">
        {{ t('nav.demandForecast') }}
      </router-link>
      <router-link to="/reports" :class="{ 'nav-active': $route.path === '/reports' }">
        Reports
      </router-link>
    </nav>

    <div class="sidebar-footer">
      <LanguageSwitcher />
      <ProfileMenu
        @show-profile-details="$emit('show-profile-details')"
        @show-tasks="$emit('show-tasks')"
      />
    </div>
  </aside>
</template>

<script>
import { useI18n } from '../composables/useI18n'
import LanguageSwitcher from './LanguageSwitcher.vue'
import ProfileMenu from './ProfileMenu.vue'

export default {
  name: 'AppSidebar',
  components: { LanguageSwitcher, ProfileMenu },
  emits: ['show-profile-details', 'show-tasks'],
  setup() {
    const { t } = useI18n()
    return { t }
  }
}
</script>

<style scoped>
.sidebar {
  width: var(--sidebar-w);
  height: 100vh;
  position: sticky;
  top: 0;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  background: var(--sidebar-bg);
  border-right: 1px solid var(--sidebar-border);
  overflow-y: auto;
}

.sidebar-brand {
  padding: 20px 16px 16px;
  border-bottom: 1px solid var(--sidebar-border);
  flex-shrink: 0;
}

.brand-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: -0.01em;
}

.brand-sub {
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 3px;
}

.sidebar-nav {
  flex: 1;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.sidebar-nav a {
  display: flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  text-decoration: none;
  transition: background 0.1s ease;
}

.sidebar-nav a:hover {
  background: var(--nav-hover);
}

.sidebar-nav a.nav-active {
  background: var(--nav-active);
}

.sidebar-footer {
  flex-shrink: 0;
  padding: 10px 8px;
  border-top: 1px solid var(--sidebar-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
```

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| FilterBar still sticks under the old top-nav gap | Set `top: 0` in FilterBar.vue (Step 4) |
| Content area overflows horizontally | Add `min-width: 0` on `.app-body` (Step 2) |
| Sidebar doesn't reach bottom of page | Use `height: 100vh; position: sticky; top: 0` on `.sidebar` (Step 5) |
| `LanguageSwitcher`/`ProfileMenu` missing from App.vue | Remove their imports from App.vue; they live in AppSidebar now |
| Modal events not working after refactor | `ProfileDetailsModal` and `TasksModal` stay in App.vue, not AppSidebar |
| Active nav indicator missing | Use `:class="{ 'nav-active': $route.path === '/...' }"` not Vue Router's built-in class (avoids partial-match issues with `/`) |
| Global styles wiped | Keep ALL existing global styles; only remove `.top-nav`, `.nav-container`, `.nav-tabs`, `.logo`, `.subtitle` |

## Verification Checklist

After implementation, confirm:
- [ ] Sidebar appears at exactly 240px on the left
- [ ] Navigating to each route highlights the correct nav item
- [ ] FilterBar is sticky at the top of the content area (not offset)
- [ ] Language switcher and profile menu work inside the sidebar
- [ ] Opening the tasks or profile modal works
- [ ] No horizontal scrollbar on the page
- [ ] All view content (tables, stat cards, charts) renders correctly
