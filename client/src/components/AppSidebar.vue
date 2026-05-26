<template>
  <aside class="sidebar">
    <div class="sidebar-brand">
      <div class="brand-name">{{ t('nav.companyName') }}</div>
      <div class="brand-sub">{{ t('nav.subtitle') }}</div>
    </div>

    <nav class="sidebar-nav">
      <router-link to="/" :class="{ 'nav-active': $route.path === '/' }">
        <!-- Grid / overview icon -->
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" class="nav-icon">
          <rect x="1.5" y="1.5" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.5"/>
          <rect x="9.5" y="1.5" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.5"/>
          <rect x="1.5" y="9.5" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.5"/>
          <rect x="9.5" y="9.5" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.5"/>
        </svg>
        {{ t('nav.overview') }}
      </router-link>

      <router-link to="/inventory" :class="{ 'nav-active': $route.path === '/inventory' }">
        <!-- Box / package icon -->
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" class="nav-icon">
          <path d="M13.5 4.5L8 2L2.5 4.5V11.5L8 14L13.5 11.5V4.5Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
          <path d="M8 2V14M2.5 4.5L8 7L13.5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
        </svg>
        {{ t('nav.inventory') }}
      </router-link>

      <router-link to="/orders" :class="{ 'nav-active': $route.path === '/orders' }">
        <!-- Clipboard / list icon -->
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" class="nav-icon">
          <rect x="2.5" y="2.5" width="11" height="11" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
          <path d="M5 6H11M5 8.5H11M5 11H8.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        {{ t('nav.orders') }}
      </router-link>

      <router-link to="/spending" :class="{ 'nav-active': $route.path === '/spending' }">
        <!-- Wallet / dollar icon -->
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" class="nav-icon">
          <rect x="1.5" y="4.5" width="13" height="9" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
          <path d="M4.5 4.5V3.5C4.5 2.948 4.948 2.5 5.5 2.5H10.5C11.052 2.5 11.5 2.948 11.5 3.5V4.5" stroke="currentColor" stroke-width="1.5"/>
          <circle cx="11" cy="9" r="1" fill="currentColor"/>
        </svg>
        {{ t('nav.finance') }}
      </router-link>

      <router-link to="/demand" :class="{ 'nav-active': $route.path === '/demand' }">
        <!-- Trending up icon -->
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" class="nav-icon">
          <path d="M1.5 11.5L5.5 7.5L8.5 10.5L14.5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M11.5 4.5H14.5V7.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        {{ t('nav.demandForecast') }}
      </router-link>

      <router-link to="/reports" :class="{ 'nav-active': $route.path === '/reports' }">
        <!-- Bar chart icon -->
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" class="nav-icon">
          <rect x="1.5" y="8.5" width="3" height="5" rx="0.5" stroke="currentColor" stroke-width="1.5"/>
          <rect x="6.5" y="5.5" width="3" height="8" rx="0.5" stroke="currentColor" stroke-width="1.5"/>
          <rect x="11.5" y="2.5" width="3" height="11" rx="0.5" stroke="currentColor" stroke-width="1.5"/>
        </svg>
        {{ t('nav.reports') }}
      </router-link>
      <router-link to="/backlog" :class="{ 'nav-active': $route.path === '/backlog' }">
        {{ t('nav.backlog') }}
      </router-link>
    </nav>

    <div class="sidebar-footer">
      <ThemeToggle />
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
import ThemeToggle from './ThemeToggle.vue'
import LanguageSwitcher from './LanguageSwitcher.vue'
import ProfileMenu from './ProfileMenu.vue'

export default {
  name: 'AppSidebar',
  components: { ThemeToggle, LanguageSwitcher, ProfileMenu },
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
  background: var(--bg-sidebar);
  border-right: 1px solid var(--border-default);
  /* overflow: visible so dropdowns (ProfileMenu / LanguageSwitcher) can
     escape the sidebar bounds without clipping */
  overflow: visible;
}

.sidebar-brand {
  padding: 20px 16px 16px;
  border-bottom: 1px solid var(--border-default);
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
  gap: 8px;
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  text-decoration: none;
  position: relative;
  transition: background var(--transition-fast), color var(--transition-fast);
}

.sidebar-nav a:hover {
  background: var(--bg-hover);
}

.nav-icon {
  color: var(--text-tertiary);
  flex-shrink: 0;
  transition: color var(--transition-fast);
}

.sidebar-nav a.nav-active {
  background: var(--accent-soft-bg);
  color: var(--accent-soft-text);
  /* Left accent bar via inset box-shadow — avoids layout impact of border */
  box-shadow: inset 3px 0 0 var(--accent);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
}

.sidebar-nav a.nav-active .nav-icon {
  color: var(--accent);
}

.sidebar-footer {
  flex-shrink: 0;
  padding: 10px 8px;
  border-top: 1px solid var(--border-default);
  display: flex;
  flex-direction: column;
  gap: 6px;
}
</style>
