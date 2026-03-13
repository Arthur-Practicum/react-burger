import { ROUTES } from '@/router';
import { Navigate, useLocation } from 'react-router-dom';

import { useAppSelector } from '@services/store.ts';

type ProtectedRouteProps = {
  children: React.ReactNode;
  onlyUnAuth: boolean;
  redirectTo?: string;
};

type LocationState = {
  from?: {
    pathname: string;
  };
};

export const ProtectedRoute = ({
  children,
  onlyUnAuth,
  redirectTo = ROUTES.Home,
}: ProtectedRouteProps): React.JSX.Element => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const location = useLocation();

  if (onlyUnAuth && !isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (!onlyUnAuth && isAuthenticated) {
    const state = location.state as LocationState | null;
    const fromLocation = state?.from?.pathname ?? '/';
    return <Navigate to={fromLocation} replace />;
  }

  return <>{children}</>;
};
