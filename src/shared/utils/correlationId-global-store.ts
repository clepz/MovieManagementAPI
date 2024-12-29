import { AsyncLocalStorage } from 'async_hooks';

export interface ContextStore {
    correlationId: string;
}

export const correlationIdGlobalStore = new AsyncLocalStorage<ContextStore>();
