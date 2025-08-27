/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as ai from "../ai.js";
import type * as bookings from "../bookings.js";
import type * as comparisonItems from "../comparisonItems.js";
import type * as emails from "../emails.js";
import type * as events from "../events.js";
import type * as loyalty from "../loyalty.js";
import type * as nudges from "../nudges.js";
import type * as posts from "../posts.js";
import type * as pricingTiers from "../pricingTiers.js";
import type * as roi from "../roi.js";
import type * as services from "../services.js";
import type * as tenants from "../tenants.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  ai: typeof ai;
  bookings: typeof bookings;
  comparisonItems: typeof comparisonItems;
  emails: typeof emails;
  events: typeof events;
  loyalty: typeof loyalty;
  nudges: typeof nudges;
  posts: typeof posts;
  pricingTiers: typeof pricingTiers;
  roi: typeof roi;
  services: typeof services;
  tenants: typeof tenants;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
