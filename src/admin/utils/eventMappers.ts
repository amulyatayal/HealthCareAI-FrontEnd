import type {
  AdminEventApi,
  EventCreateRequest,
  EventType,
  EventUpdateRequest,
} from '../../types/admin';

export interface EventFormState {
  title: string;
  date: string;
  time: string;
  location: string;
  type: EventType;
  isVirtual: boolean;
  description: string;
}

export const EMPTY_EVENT_FORM: EventFormState = {
  title: '',
  date: '',
  time: '',
  location: '',
  type: 'wellness',
  isVirtual: false,
  description: '',
};

export function getEventId(event: AdminEventApi): string {
  const id = event.id?.trim();
  return id || '';
}

export function apiEventToForm(event: AdminEventApi): EventFormState {
  const d = new Date(event.starts_at);
  const date = d.toISOString().slice(0, 10);
  const time = d.toISOString().slice(11, 16);

  return {
    title: event.title,
    date,
    time,
    location: event.location ?? '',
    type: event.type,
    isVirtual: event.is_virtual,
    description: event.description ?? '',
  };
}

export function formToCreateRequest(form: EventFormState): EventCreateRequest {
  return {
    title: form.title.trim(),
    date: form.date,
    time: form.time,
    location: form.location.trim() || null,
    type: form.type,
    is_virtual: form.isVirtual,
    description: form.description.trim() || null,
  };
}

export function formToUpdateRequest(form: EventFormState): EventUpdateRequest {
  return formToCreateRequest(form);
}

export { formatStartsAt } from '../../utils/eventDisplay';
