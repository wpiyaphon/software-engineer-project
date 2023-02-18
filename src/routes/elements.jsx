import { Suspense, lazy } from 'react';
// components
import LoadingScreen from '../components/loading-screen';

// ----------------------------------------------------------------------

const Loadable = (Component) => (props) =>
(
    <Suspense fallback={<LoadingScreen />}>
        <Component {...props} />
    </Suspense>
);

// ----------------------------------------------------------------------

// AUTH
export const LoginPage = Loadable(lazy(() => import('../pages/LoginPage')));

// Content
export const DashboardPage = Loadable(lazy(() => import('../pages/DashboardPage')));
export const CustomersPage = Loadable(lazy(() => import('../pages/CustomersPage')));
export const ProductsPage = Loadable(lazy(() => import('../pages/ProductsPage')));
export const OrdersPage = Loadable(lazy(() => import('../pages/OrdersPage')));



