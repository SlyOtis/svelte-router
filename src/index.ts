import Router from './Router.svelte'
import {onDestroy} from "svelte"

let routes: Routes
let restrictions: RouterConf['restrictions']
export let currRoute: Route

function getRoute(key?: string, data?: any): Route {
  let route = routes[Object.keys(routes)
    .find(routeKey => routeKey === key)
  || Object.keys(routes)[0]] as Route
  
  route.data = data
  return route
}

function getRouteByUrl(url?: string, data?: any): {key: string, route: Route, invalid: boolean} {
  let route: Route | null = null
  let key: string | null = null
  let invalid = false
  
  for (let routeKey of Object.keys(routes)) {
    route = routes[routeKey] as Route
    
    if (!!route && url === route.path) {
      key = routeKey
      break
    }
  }
  
  if (!key || !route) {
    key = Object.keys(routes)[0]
    route = routes[key]
    invalid = true
  }
  
  route.data = data
  
  return {
    route,
    key,
    invalid
  }
}

export function link(node: HTMLAnchorElement, data?: any) {
  
  function onClick(e: MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    
    window.dispatchEvent(new CustomEvent('routing-url-changed', {
      detail: {
        url: node.href,
        data
      }
    }))
  }
  
  node.addEventListener('click', onClick)
  
  return {
    destroy() {
      node.removeEventListener('click', onClick);
    }
  };
}

export function route(node: HTMLElement, route: Omit<RouteChange, 'changeState'> | string) {
  function onClick(e: MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    
    if (!route) {
      throw new Error('No route info given')
    }
    
    if (typeof route === 'string') {
      window.dispatchEvent(new CustomEvent('routing-changed', {
        detail: {
          key: route,
          changeState: 'push'
        }
      }))
    } else {
      window.dispatchEvent(new CustomEvent('routing-changed', {
        detail: {
          ...route,
          changeState: 'push'
        }
      }))
    }
  }
  
  node.addEventListener('click', onClick)
  
  return {
    destroy() {
      node.removeEventListener('click', onClick);
    }
  };
}

export function goTo(route: Omit<RouteChange, 'changeState'> | string, changeState?: ChangeState) {
  routeChange(
    typeof route === 'string' ? {key: route} : route,
    changeState === undefined ? 'push' : changeState
  )
}

export function goNext() {
  window.history.forward()
  //TODO:: Fix these
  routeChange({
    key: window.history.state,
  })
}

export function goPrev() {
  window.history.back()
  //TODO:: Fix these
  routeChange({
    key: window.history.state
  })
}

function routeChange(route: RouteChange, changeState?: ChangeState) {
  window.dispatchEvent(new CustomEvent('routing-changed', {
    detail: {
      changeState,
      ...route,
    }
  }))
}

type RouteChange = {
  key: string
  data?: any
  changeState?: ChangeState
}

type ChangeState = 'push' | 'replace'

type RouteUrlChange = Omit<RouteChange, 'key'> & {url: string}

export type Route = {
  path: string
  comp: any
  title: string
  data?: any
  restrictions?: Array<string>
  disableSlot?: boolean
}

export type Routes = {[key: string]: Omit<Route, 'data'>}
/**
 * Returns false for when the route is let through (not restricted), and
 * false, or route key to redirect to when restricted.
 */
export type RestrictionResolver = (route: Route) => false | string
export type RouterConf = {
  routes: Routes,
  onRouteChanged: (route: Route) => void,
  rewriteInvalid: boolean,
  onInvalidRoute?: string,
  restrictions?: {
    [restriction: string]: RestrictionResolver
  }
}

export function isRouteRestricted(route: Route): false | string {
  
  console.log('Checking restrictions for ' + route.title)
  
  if (!restrictions) {
    return false
  }
  
  for (let curr of Object.keys(restrictions)) {
    if (route.restrictions?.includes(curr)) {
      const res = restrictions!![curr](route)
      if (res) {
        return res
      }
    }
  }
  
  return false
}

function processRoute(key: string, route: Route): { route: Route, key: string } {
  const iSRestricted = isRouteRestricted(route)
  
  if (iSRestricted) {
    return {
      route: getRoute(iSRestricted, route.data),
      key: iSRestricted
    }
  }
  
  return {
    key,
    route
  }
}

export function createRouter(conf: RouterConf): Route {
  
  function onChange({detail: {key, data, changeState}}: {detail: RouteChange } & any) {
    changeRoute(key, getRoute(key, data), changeState)
  }
  
  function onUrlChange({detail: {url, data, changeState}}: {detail: RouteUrlChange} & any) {
    const route = getRouteByUrl(url, data)
    changeRoute(route.key, route.route, changeState)
  }
  
  function onPopState({state: {key, data}}: { state: RouteChange } & any) {
    changeRoute(key, getRoute(key, data))
  }
  
  function changeRoute(_key: string, _route: Route, changeState?: ChangeState) {
    const {
      key,
      route
    } = processRoute(_key, _route)
    
    conf.onRouteChanged(route)
    currRoute = route
    
    if (!!changeState) {
      (window.history as any)[`${changeState}State`]({key, data: route.data}, route.title, route.path)
    }
  }
  
  window.addEventListener('routing-changed', onChange)
  window.addEventListener('routing-url-changed', onUrlChange)
  window.addEventListener('popstate', onPopState)
  
  onDestroy(() => {
    window.removeEventListener('routing-changed', onChange)
    window.removeEventListener('routing-url-changed', onUrlChange)
    window.removeEventListener('popstate', onPopState)
  })
  
  routes = conf.routes
  restrictions = conf.restrictions
  const requestedRoute = getRouteByUrl(window.location.pathname)
  let initialRoute = {
    ...processRoute(requestedRoute.key, requestedRoute.route),
    invalid: requestedRoute.invalid,
    prev: requestedRoute.key
  }
  
  if (conf.onInvalidRoute && requestedRoute.invalid) {
    // Given that the user has added the 404 route.
    initialRoute = {
      ...initialRoute,
      key: conf.onInvalidRoute,
      route: getRoute(conf.onInvalidRoute),
      prev: requestedRoute.key
    }
  }
  
  const {key, route, prev} = initialRoute
  window.history.replaceState({key, data: route.data, prev}, route.title, route.path)
  
  return route
}

export default Router