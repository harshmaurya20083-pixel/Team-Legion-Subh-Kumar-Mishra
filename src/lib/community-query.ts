import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { listPublishedCommunities } from './communities.functions';
export const publicCommunitiesOptions = queryOptions({ queryKey: ['public-communities'], queryFn: () => listPublishedCommunities(), staleTime: 0 });
export const usePublicCommunities = () => useSuspenseQuery(publicCommunitiesOptions).data;
