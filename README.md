# sly-svelte-router

A SPA router for Svelte based on the History API.

## How it works

1. Router initialization:
   - The `createRouter` function sets up the router with provided routes and configurations.
   - It adds event listeners for routing changes and popstate events.
   - Initializes the first route based on the current URL.

2. Route changes:
   - Routes can be changed using `goTo`, `goNext`, `goPrev` functions, or `link` and `route` directives.
   - These trigger custom events ('routing-changed' or 'routing-url-changed').

3. Route processing:
   - When a route change is requested, the router checks for restrictions.
   - If restricted, it redirects to an allowed route.

4. Route rendering:
   - The `Router.svelte` component renders the current route component.
   - It also updates the document title and handles slot content.

5. History management:
   - The router uses the History API to manage browser history.
   - It pushes or replaces state depending on the navigation action.

6. Restrictions:
   - Routes can have restrictions that are checked before navigation.
   - Custom restriction resolvers can be provided to handle complex logic.

## Key Components

- `Router.svelte`: Main component for rendering routes.
- `createRouter`: Function to initialize the router.
- `link` and `route` directives: For declarative routing in templates.
- `goTo`, `goNext`, `goPrev`: Programmatic navigation functions.

## DISCONTINUED

This project is no longer maintained. For an updated and improved version, please check out [sly-svelte-location-router](https://www.npmjs.com/package/sly-svelte-location-router).
