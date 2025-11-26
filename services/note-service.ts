import apiClient from './api-client';
import { API_ENDPOINTS } from '@utils/constants';

export interface Note {
  id: string;
  content: string;
  dateAt: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  status?: 'pending' | 'completed';
}

export interface CreateNoteRequest {
  content: string;
  date?: string;
}

export interface UpdateNoteRequest {
  content: string;
  date?: string;
}

export interface GetNotesOptions {
  limit?: number;
  offset?: number;
  search?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'content';
  sortOrder?: 'asc' | 'desc';
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  note?: T;
  notes?: T[];
  pagination?: {
    limit: number;
    offset: number;
    count: number;
    hasMore: boolean;
  };
}

class NoteService {
  async createNote(noteData: CreateNoteRequest): Promise<Note> {
    const response = await apiClient.post<ApiResponse<Note>>(API_ENDPOINTS.NOTES.BASE, noteData);

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to create note');
    }

    return response.data.note!;
  }

  async getNotes(options: GetNotesOptions = {}): Promise<{ notes: Note[]; pagination: any }> {
    const params = new URLSearchParams();

    if (options.limit) params.append('limit', options.limit.toString());
    if (options.offset) params.append('offset', options.offset.toString());
    if (options.search) params.append('search', options.search);
    if (options.sortBy) params.append('sortBy', options.sortBy);
    if (options.sortOrder) params.append('sortOrder', options.sortOrder);

    const url = `${API_ENDPOINTS.NOTES.BASE}${params.toString() ? `?${params.toString()}` : ''}`;

    const response = await apiClient.get<ApiResponse<Note>>(url);

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch notes');
    }

    return {
      notes: response.data.notes || [],
      pagination: response.data.pagination,
    };
  }

  async getNoteById(id: string): Promise<Note> {
    const response = await apiClient.get<ApiResponse<Note>>(API_ENDPOINTS.NOTES.BY_ID(id));

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch note');
    }

    return response.data.note!;
  }

  async updateNote(id: string, noteData: UpdateNoteRequest): Promise<Note> {
    const response = await apiClient.put<ApiResponse<Note>>(
      API_ENDPOINTS.NOTES.BY_ID(id),
      noteData
    );

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to update note');
    }

    return response.data.note!;
  }

  async deleteNote(id: string): Promise<void> {
    const response = await apiClient.delete<ApiResponse<never>>(API_ENDPOINTS.NOTES.BY_ID(id));

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to delete note');
    }
  }
}

export const noteService = new NoteService();
