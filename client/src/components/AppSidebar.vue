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
        {{ t('nav.reports') }}
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
  /* overflow: visible so the ProfileMenu / LanguageSwitcher dropdowns can
     escape the sidebar instead of being clipped or forcing internal scroll.
     The sidebar's content fits easily within 100vh on any normal viewport. */
  overflow: visible;
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
  /* Stack LanguageSwitcher above ProfileMenu vertically so both fit the
     narrow sidebar width instead of being crammed onto one horizontal line */
  flex-direction: column;
  gap: 6px;
}
</style>
