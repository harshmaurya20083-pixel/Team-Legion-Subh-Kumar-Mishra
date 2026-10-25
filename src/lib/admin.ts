// Admin visibility helper: the role is always verified server-side via has_role;
// this hook only decides whether to show the Moderation shortcut.
import { useQuery } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { useAccount } from './account';
import { myAdminStatus } from './events.functions';

export function useIsAdmin() {
  const { user, ready } = useAccount();
  const check = useServerFn(myAdminStatus);
  const query = useQuery({
    queryKey: ['admin-status', user?.id],
    queryFn: () => check(),
    enabled: ready && !!user,
    retry: false,
    staleTime: 5 * 60_000,
  });
  return query.data?.admin === true;
}
