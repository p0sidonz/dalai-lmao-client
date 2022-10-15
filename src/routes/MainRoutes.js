import { lazy } from 'react';

// project imports
import AuthGuard from 'utils/route-guard/AuthGuard';
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// sample page routing
const UniversityMenu = Loadable(lazy(() => import('views/universityMenu')));
const UniversityAdmin = Loadable(lazy(() => import('views/admin/university')));

const FoodList = Loadable(lazy(() => import('views/foodList')));
const FoodDetail = Loadable(lazy(() => import('views/FoodDetail')));
const ProfileSettings = Loadable(lazy(() => import('views/Settings/Profile')));
const Chat = Loadable(lazy(() => import('views/chat')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/',
    element: (
        <AuthGuard>
            <MainLayout />
        </AuthGuard>
    ),
    children: [
        {
            path: '/',
            element: <UniversityMenu />
        },
        {
            path: '/foodlist/:id',
            element: <FoodList />
        },
        {
            path: '/foodlist/detail/:id',
            element: <FoodDetail />
        },
        {
            path: '/profile/',
            element: <ProfileSettings />
        },
        {
            path: '/chat/',
            element: <Chat />
        },
        {
            path: '/sample-page',
            element: <UniversityMenu />
        },
        {
            path: '/adminx',
            element: <UniversityAdmin />
        }
    ]
};

export default MainRoutes;
