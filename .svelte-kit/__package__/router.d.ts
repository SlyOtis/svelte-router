import type { RouteDefinition, Routes } from "./types";
export declare function initRouter(routes: Routes): boolean;
export declare function execFallback(fallback: RouteDefinition): () => Promise<any>;
export declare function navigate(path: string, state?: any): void;
export declare function getRoutes(): Routes;
