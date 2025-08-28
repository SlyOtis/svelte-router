# SDM Server Router Refresh Fix - Implementation Plan

## Problem Summary

The Samna Device Manager (SDM) web application experiences unwanted component re-mounting when navigating between routes. The Sidebar and CLIDownload components refresh on every route change, causing:
- API calls to re-fire (`/api/status/version`, `/api/cli-releases`)
- Visual flickering and loading states
- Poor user experience with UI elements resetting
- Unnecessary network traffic

## Root Cause Analysis

### Current Architecture Issues

1. **Nested Router Problem**
   - App.svelte contains the main Router
   - MainPage.svelte contains a nested Router for sub-routes
   - Both routers react to the same global `resolvedRoute` store

2. **Component Re-instantiation**
   - The `sly-svelte-location-router` library replaces components instead of updating them
   - When RouteComp changes, the entire component tree is destroyed and recreated
   - This happens even when only child routes change within MainPage

3. **Global State Conflicts**
   - Single global `Config.isInitialized` prevents proper nested router initialization
   - Shared `resolvedRoute` store causes cascading updates
   - Event listeners are only set up once globally, not per router instance

4. **Library Limitations**
   - The router doesn't distinguish between parent and child route changes
   - No true support for nested routing with component preservation
   - Components are replaced via `<RouteComp>` instead of being kept alive

## Solution Approaches

### Option 1: Single Router with Layout Wrapper (Recommended)
**Effort: Low | Risk: Low | Impact: High**

Restructure the application to use a single router with persistent layout components outside the routed content.

**Pros:**
- Simplest solution with immediate results
- No library changes required
- Clear separation of persistent UI from routed content
- Easy to implement and test

**Cons:**
- Requires restructuring component hierarchy
- May need route path adjustments

### Option 2: Switch to SvelteKit
**Effort: High | Risk: Medium | Impact: High**

Migrate the entire application to SvelteKit which has built-in nested routing support.

**Pros:**
- Industry standard solution
- True nested routing with layouts
- Better performance and SEO
- Server-side rendering capabilities

**Cons:**
- Major refactoring required
- Learning curve for team
- Potential compatibility issues with existing code
- Time-intensive migration

### Option 3: Custom Router Implementation
**Effort: Medium | Risk: Medium | Impact: High**

Build a custom router that properly supports nested routes with component preservation.

**Pros:**
- Tailored to exact needs
- Full control over behavior
- Can maintain similar API to current router

**Cons:**
- Maintenance burden
- Potential bugs in custom implementation
- Time to develop and test

### Option 4: Fork and Fix sly-svelte-location-router
**Effort: Medium | Risk: Low | Impact: High**

Fork the existing router library and fix the component preservation issue.

**Pros:**
- Minimal changes to existing code
- Can contribute back to open source
- Maintains current routing API

**Cons:**
- Need to maintain fork
- Requires deep understanding of router internals
- May have unforeseen edge cases

## Recommended Implementation (Option 1)

### Phase 1: Restructure Component Hierarchy

#### Step 1: Create New Layout Component
Create `AppLayout.svelte` to hold persistent UI elements:

```svelte
<!-- src/components/AppLayout.svelte -->
<script lang="ts">
  import Sidebar from './Sidebar.svelte'
  import { DeviceListPanel } from './devicelist'
  import { uiState } from '@lib/ui'
  import { gridColumnAnimate } from '@lib/actions/gridColumnAnimate'
  
  let { children } = $props()
</script>

<div class="relative h-screen w-full bg-base-200 overflow-hidden"
     use:gridColumnAnimate={{ isOpen: $uiState.isSidebarOpen, openWidth: 256, closedWidth: 64 }}>
  <Sidebar />
  <main class="overflow-hidden relative h-full w-full"
        use:gridColumnAnimate={{ isOpen: $uiState.isDevicesOpen, openWidth: 320, closedWidth: 0 }}>
    <DeviceListPanel />
    <div class="w-full h-full overflow-auto">
      {@render children()}
    </div>
  </main>
</div>
```

#### Step 2: Update App.svelte
Simplify to single router with layout:

```svelte
<!-- src/App.svelte -->
<script lang="ts">
  import { Router } from 'sly-svelte-location-router'
  import type { Routes } from 'sly-svelte-location-router'
  import { authState } from '@lib/auth'
  import { derived } from 'svelte/store'
  import ToastContainer from '@components/ToastContainer.svelte'
  import AppLayout from '@components/AppLayout.svelte'
  import Modals from '@components/Modals.svelte'
  
  const isAuthenticated = derived(authState, state => state.isAuthenticated)
  const isLoading = derived(authState, state => state.isLoading)
  
  const routes: Routes = {
    '/': '/main',
    '/login': {
      name: 'login',
      component: () => import('@pages/LoginPage.svelte')
    },
    '/main': {
      name: 'dashboard',
      component: () => import('@pages/DashboardPage.svelte'),
      guard: authGuard
    },
    '/main/device-token': {
      name: 'device-token',
      component: () => import('@pages/DeviceTokenPage.svelte'),
      guard: authGuard
    },
    '/main/admin': {
      name: 'admin',
      component: () => import('@pages/UserPage.svelte'),
      guard: authGuard
    },
    '/main/device/:id': {
      name: 'device-details',
      component: () => import('@pages/DeviceDetailsPage.svelte'),
      guard: authGuard
    }
  }
  
  async function authGuard() {
    if (!$isLoading && !$isAuthenticated) {
      return { path: '/login', state: { message: 'Please login to continue' } }
    }
  }
</script>

<ToastContainer />

<Router {routes} fallback={() => import('@pages/ErrorPage.svelte')}>
  {#snippet children()}
    <div class="flex items-center justify-center min-h-screen">
      <span class="loading loading-spinner loading-lg"></span>
    </div>
  {/snippet}
  {#snippet wrapper(component)}
    {#if $currentRoute?.path?.startsWith('/main')}
      <AppLayout>
        <component />
      </AppLayout>
    {:else}
      <component />
    {/if}
  {/snippet}
</Router>
<Modals />
```

#### Step 3: Remove Nested Router from MainPage
MainPage.svelte becomes unnecessary - delete it or convert to a simple layout component.

#### Step 4: Update Route Links
Update all navigation links to use full paths:
- `/` → `/main`
- `/device-token` → `/main/device-token`
- `/admin` → `/main/admin`
- `/device/:id` → `/main/device/:id`

### Phase 2: Optimize Component Initialization

#### Step 1: Add Caching to APK Store
Update `/lib/apk.ts` to prevent redundant fetches:

```typescript
class APKVersionStore {
  private cache = new Map<string, { data: any, timestamp: number }>()
  private CACHE_TTL = 5 * 60 * 1000 // 5 minutes
  
  async fetchServerVersion() {
    const cached = this.cache.get('serverVersion')
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      serverVersion.set(cached.data)
      return
    }
    
    try {
      const response = await apiGet<{version: string}>('/api/status/version')
      serverVersion.set(response.version)
      this.cache.set('serverVersion', { 
        data: response.version, 
        timestamp: Date.now() 
      })
    } catch (error) {
      console.error('Failed to fetch server version:', error)
    }
  }
}
```

#### Step 2: Move Data Fetching to Layout Level
Initialize data once at the AppLayout level instead of in individual components:

```svelte
<!-- AppLayout.svelte -->
<script>
  import { onMount } from 'svelte'
  import { apkVersionStore } from '@lib/apk'
  
  onMount(() => {
    // Fetch once when layout mounts
    apkVersionStore.fetchServerVersion()
    apkVersionStore.refreshVersionData()
  })
</script>
```

### Phase 3: Testing & Validation

#### Test Cases
1. **Navigation without refresh**
   - Navigate between all routes
   - Verify Sidebar doesn't flicker
   - Check network tab for duplicate API calls

2. **State preservation**
   - Open/close sidebar and device panel
   - Navigate to different route
   - Verify UI state is maintained

3. **Authentication flow**
   - Test login/logout
   - Verify proper redirects
   - Check guard functionality

4. **Performance metrics**
   - Measure time to interactive
   - Count API calls per navigation
   - Monitor memory usage

### Phase 4: Deployment

#### Rollout Strategy
1. **Development Environment**
   - Implement changes in feature branch
   - Run full test suite
   - Performance profiling

2. **Staging Environment**
   - Deploy to test server
   - UAT with key users
   - Monitor for issues

3. **Production**
   - Deploy during low-traffic window
   - Monitor error rates
   - Have rollback plan ready

## Alternative Quick Fix (Temporary)

If immediate relief is needed before full implementation:

### Disable onMount API Calls
Add a singleton pattern to prevent duplicate fetches:

```typescript
// lib/singleton.ts
const initialized = new Set<string>()

export function runOnce(key: string, callback: () => void) {
  if (!initialized.has(key)) {
    initialized.add(key)
    callback()
  }
}

// In components
import { runOnce } from '@lib/singleton'

onMount(() => {
  runOnce('sidebar-version', () => {
    apkVersionStore.fetchServerVersion()
  })
})
```

## Success Metrics

- **Zero API calls** on route navigation (except route-specific data)
- **No visual flicker** in Sidebar or DeviceListPanel
- **Consistent UI state** across navigation
- **Page load time** under 2 seconds
- **Memory usage** stable after multiple navigations

## Timeline Estimate

### Option 1 Implementation
- Phase 1: 4-6 hours (restructuring)
- Phase 2: 2-3 hours (optimization)
- Phase 3: 2-3 hours (testing)
- Phase 4: 1-2 hours (deployment)
- **Total: 1.5-2 days**

### Risk Mitigation

1. **Backup current state** before changes
2. **Feature flag** for new routing if needed
3. **Incremental rollout** to catch issues early
4. **Monitoring** in place before deployment
5. **Rollback plan** documented and tested

## Conclusion

The recommended approach (Option 1) provides the best balance of:
- Quick implementation
- Low risk
- High impact on user experience
- Maintainability

This solution eliminates the core issue of component re-mounting while maintaining the current routing library, making it the most pragmatic choice for immediate resolution.