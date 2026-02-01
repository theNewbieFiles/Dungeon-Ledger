// Overload 1: No data (void result)
export function ok(): Result<void>;

// Overload 2: With data
export function ok<T>(data: T): Result<T>;

// Implementation
export function ok<T>(data?: T): Result<T | void> {
  return { success: true, data: data as T };
}

export function fail(): Result<never> {
    return { success: false };
}

export type Result<T> =
    | { success: true; data: T }
    | { success: false };

