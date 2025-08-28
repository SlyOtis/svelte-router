# Manual Test Instructions for Component Preservation

## Test Setup
1. Open browser developer console (F12)
2. Navigate to http://localhost:5173

## Test Steps

### Test 1: Child Route Navigation (Should Preserve Parent)
1. Navigate to `/admin` 
   - Console should show: `[Admin Layout xxx] Component MOUNTED`
   - Note the instance ID (xxx)

2. Click on "Settings" link (navigates to `/admin/settings`)
   - Console should NOT show Admin Layout being destroyed or re-mounted
   - Settings component should mount

3. Click on "Profile" link (navigates to `/admin/profile`)
   - Console should NOT show Admin Layout being destroyed or re-mounted
   - Profile component should mount, Settings should destroy

4. Click on "Dashboard" link (navigates to `/admin`)
   - Console should NOT show Admin Layout being destroyed or re-mounted
   - Dashboard component should mount, Profile should destroy

**Expected Result**: The Admin Layout instance ID should remain the same throughout all child navigation

### Test 2: Parent Route Change (Should Re-mount)
1. From `/admin`, navigate to `/shop`
   - Console SHOULD show: `[Admin Layout xxx] Component DESTROYED`
   - Console SHOULD show: `[Shop Layout yyy] Component MOUNTED`

2. Navigate back to `/admin`
   - Console SHOULD show: `[Shop Layout yyy] Component DESTROYED`
   - Console SHOULD show: `[Admin Layout zzz] Component MOUNTED` (new instance ID)

**Expected Result**: Parent components should re-mount when switching between different parent routes

## Success Criteria
✅ Parent components (Admin, Shop) are preserved when navigating between their child routes
✅ Parent components are properly destroyed and re-created when switching to different parent routes
✅ Child components mount and unmount as expected