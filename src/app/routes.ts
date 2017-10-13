import {LoginPage} from "../pages/login-page/login-page";
import {NotFoundPage} from "../pages/not-found-page/not-found-page";
import {DashboardPage} from "../pages/dashboard-page/dashboard-page";

export interface RoutesInterface {
  path: string,
  component?: any,
  authentication?: boolean|string,
  redirectTo?: string,
  pathMatch?: string
}

export const AppRoutes: RoutesInterface[] = [
  {
    path: 'login',
    component: LoginPage,
    authentication: false
  },
  {
    path: 'dashboard',
    component: DashboardPage,
    authentication: true
  },
  {
    path: 'page-not-found',
    component: NotFoundPage,
    authentication: false
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/page-not-found',
    pathMatch: 'full'
  }
];
