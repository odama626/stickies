import { store } from 'app/state';
import { useEffect } from 'react';
import { getAuthorizedAccount } from './actions';

export function useAccount() {
  const [account] = store.use(state => state?.usersById?.[state?.userId]);
  const authenticated = account?.id;

  useEffect(() => {
    const getAuth = () =>
      getAuthorizedAccount()
        .then(() => {
          const params = new URLSearchParams(location.search)
          if (params.get('sent') === 'true' && '/account/login' === location.pathname) {
            location.assign('/')
          }
        })
        .catch(() => {
          console.log('checking auth');
          setTimeout(getAuth, 1000 * 30);
        });

    getAuth();
  }, []);

  return { account, authenticated };
}
