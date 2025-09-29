# Hostname-Based Routing

## Overview
The router supports hostname-based route patterns for multi-domain applications. Routes that don't start with `/` are treated as hostname patterns.

## Pattern Syntax
```typescript
const routes: Routes = {
  // Standard pathname routes
  '/': () => import('./Home.svelte'),
  '/about': () => import('./About.svelte'),
  
  // Hostname-specific routes
  'auth.example.com/': () => import('./AuthHome.svelte'),
  'auth.example.com/login': () => import('./Login.svelte'),
  'app.example.com/': () => import('./AppHome.svelte'),
  '*.example.com/admin': () => import('./Admin.svelte'),
  
  // Wildcard subdomain patterns
  '*.myapp.com/': () => import('./TenantHome.svelte'),
  '*.myapp.com/dashboard': () => import('./Dashboard.svelte')
};
```

## How It Works
1. Routes starting with `/` match pathname only (current behavior)
2. Routes containing text before `/` are hostname patterns
3. Hostname patterns are checked against `window.location.hostname`
4. Wildcards (`*`) match any subdomain

## Pattern Matching Priority
1. Exact hostname + pathname matches first
2. Wildcard hostname + pathname matches second  
3. Pathname-only routes match last

## Cross-Domain Navigation
- Same-hostname navigation uses History API (SPA behavior)
- Different-hostname navigation triggers full page reload
- Guards can redirect across domains by returning full URLs

## Example Implementation
```typescript
// Multi-tenant app with subdomains
const routes: Routes = {
  // Main marketing site
  'www.myapp.com/': () => import('./Marketing.svelte'),
  'www.myapp.com/pricing': () => import('./Pricing.svelte'),
  
  // Auth subdomain
  'auth.myapp.com/': () => import('./Login.svelte'),
  'auth.myapp.com/register': () => import('./Register.svelte'),
  
  // Tenant subdomains
  '*.myapp.com/': () => import('./TenantDashboard.svelte'),
  '*.myapp.com/settings': () => import('./TenantSettings.svelte')
};
```