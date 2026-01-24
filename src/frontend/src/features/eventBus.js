/**
 * Global event bus instance for the application.
 * This is the central event bus that all components and modules use for communication.
 * It provides publish/subscribe functionality for decoupling components and enabling event-driven architecture.
 */

import { createEventBus } from "../../../shared/createEventBus.js";

export const eventBus = createEventBus();