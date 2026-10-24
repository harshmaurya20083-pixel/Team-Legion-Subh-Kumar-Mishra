import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { listPublishedEvents } from './events.functions';
export const publicEventsOptions = queryOptions({ queryKey: ['public-events'], queryFn: () => listPublishedEvents(), staleTime: 0 });
export const usePublicEvents = () => useSuspenseQuery(publicEventsOptions).data;