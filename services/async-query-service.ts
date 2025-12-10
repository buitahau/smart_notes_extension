import { browser } from 'wxt/browser';
import { queryService } from './query-service';

const QUERY_STORAGE_PREFIX = 'smart_note_async_query_';

export type AsyncQueryStatus = 'pending' | 'in-progress' | 'completed';

export interface AsyncQuery<T = Awaited<ReturnType<typeof queryService.sendQuery>>> {
  id: string;
  query: string;
  status: AsyncQueryStatus;
  response: T | null;
}

const generateId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `async-query-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

class AsyncQueryService<T = Awaited<ReturnType<typeof queryService.sendQuery>>> {
  private getStorageKey(id: string) {
    return `${QUERY_STORAGE_PREFIX}${id}`;
  }

  async create(query: string): Promise<string> {
    const id = generateId();
    const queryObj: AsyncQuery<T> = {
      id,
      query,
      status: 'in-progress',
      response: null,
    };

    await browser.storage.local.set({ [this.getStorageKey(id)]: queryObj });

    // Fire and forget background query execution.
    this.processQuery(queryObj).catch((error) => {
      console.error('Failed to process async query', error);
    });

    return id;
  }

  private async processQuery(queryObj: AsyncQuery<T>): Promise<void> {
    try {
      const response = (await queryService.sendQuery(queryObj.query)) as T;
      const updatedQuery: AsyncQuery<T> = {
        ...queryObj,
        status: 'completed',
        response,
      };

      await browser.storage.local.set({
        [this.getStorageKey(queryObj.id)]: updatedQuery,
      });
    } catch (error) {
      const failedQuery: AsyncQuery<T> = {
        ...queryObj,
        status: 'completed',
        response: null,
      };
      await browser.storage.local.set({
        [this.getStorageKey(queryObj.id)]: failedQuery,
      });
    }
  }

  async get(id: string): Promise<{ status: AsyncQueryStatus; response: T | null } | null> {
    const key = this.getStorageKey(id);
    const result = await browser.storage.local.get(key);
    const queryObj = result?.[key] as AsyncQuery<T> | undefined;

    if (!queryObj) {
      return null;
    }

    if (queryObj.status === 'completed') {
      await browser.storage.local.remove(key);
    }

    return {
      status: queryObj.status,
      response: queryObj.response,
    };
  }
}

export const asyncQueryService = new AsyncQueryService();
