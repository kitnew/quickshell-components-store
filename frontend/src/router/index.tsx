import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/Layout';
import ComponentsPage from '../pages/ComponentsPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ComponentDetailPage from '../pages/ComponentDetailPage';
import ComponentFormPage from '../pages/ComponentFormPage';
import UserPage from '../pages/UserPage';

const router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            { path: '/', element: <ComponentsPage /> },
            { path: '/login', element: <LoginPage /> },
            { path: '/register', element: <RegisterPage /> },
            { path: '/components/new', element: <ComponentFormPage /> },
            { path: '/components/:id', element: <ComponentDetailPage /> },
            { path: '/components/:id/edit', element: <ComponentFormPage /> },
            { path: '/me', element: <UserPage /> },
        ],
    },
]);

export default router;
