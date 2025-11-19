import apiClient from './api-client';
import { API_ENDPOINTS } from '@utils/constants';
import { Note } from './note-service';

interface QueryResponse {
  success: boolean;
  notes: {
    intent: string;
    data: Note[];
    success: boolean;
    error: string | null;
    timestamp: string;
  };
}

class QueryService {
  async sendQuery(query: string): Promise<QueryResponse> {
    try {
      const response = await apiClient.post(API_ENDPOINTS.QUERY.BASE, { query });

      if (!response.data?.success) {
        return {
          success: false,
          notes: {
            intent: '',
            data: [],
            success: false,
            error: response.data?.message || 'Failed to execute query',
            timestamp: new Date().toISOString(),
          },
        };
      }

      // The response structure should be { success: true, notes: { intent: string, data: Note[], ... } }
      const notesResponse = response.data.notes;

      return {
        success: true,
        notes: {
          intent: notesResponse?.intent || 'query',
          data: Array.isArray(notesResponse?.data) ? notesResponse.data : [],
          success: notesResponse?.success ?? true,
          error: notesResponse?.error ?? null,
          timestamp: notesResponse?.timestamp || new Date().toISOString(),
        },
      };
    } catch (error) {
      return {
        success: false,
        notes: {
          intent: '',
          data: [],
          success: false,
          error: 'Network error occurred',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }
}

export const queryService = new QueryService();
