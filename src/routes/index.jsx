import { Navigate, useRoutes } from 'react-router-dom';
// auth
import AuthGuard from '../auth/AuthGuard';
import GuestGuard from '../auth/GuestGuard';
// layouts
import DashboardLayout from '../layouts/dashboard';
//
import {
    LoginPage,
    DashboardPage,
    CustomersPage,
    ProductsPage,
    OrdersPage,
}
    from "./elements"

export default function Router() {
    return useRoutes([
        {
            path: '/',
            children: [
                { element: <Navigate to="/login" replace />, index: true },
                {
                    path: 'login',
                    element: (
                        <GuestGuard>
                            <LoginPage />
                        </GuestGuard>
                    ),
                },
            ],
        },
        {
            path: '/dashboard',
            element: (
                <AuthGuard>
                    <DashboardLayout />
                </AuthGuard>
            ),
            children: [
                {element: <Navigate to="/dashboard/app" replace />, index: true},
                {path: 'app', element: <DashboardPage />},
                {path: 'customers', element: <CustomersPage />},
                {path: 'products', element: <ProductsPage />},
                {path: 'orders', element: <OrdersPage />},
            ]
        },
    ])
}