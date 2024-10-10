import type {SvelteComponent} from "svelte";
import type {RouteDefinition, Routes} from "./types";

export interface RouterProps {
    routes: Routes
    fallback?: RouteDefinition
}

export default class Router extends SvelteComponent<RouterProps> {}