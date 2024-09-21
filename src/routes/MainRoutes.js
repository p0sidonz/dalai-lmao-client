/* eslint-disable */
import { lazy } from 'react';

// project imports
import AuthGuard from 'utils/route-guard/AuthGuard';
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import ListHostel from 'views/admin/hostel/ManageHostel/ListHostel';
import ManageStudent from 'views/admin/hostel/ManageStudent';
import ManageWorker from 'views/admin/hostel/ManageWorker';
import ManageService from 'views/admin/hostel/ManageService/index'
import Polling from 'views/admin/hostel/Polling';
import ServiceRequests from 'views/admin/hostel/ServiceRequests';
import ListWaterCooler from 'views/admin/hostel/WaterCooler/ListWaterCooler';

// sample page routing
const UniversityMenu = Loadable(lazy(() => import('views/universityMenu')));
const UniversityAdmin = Loadable(lazy(() => import('views/admin/university')));
const HostelMain = Loadable(lazy(() => import('views/admin/hostel')));

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
        },
        {
            path: '/hostel',
            element: <HostelMain />
        },
        {
            path: '/hostel/list',
            element: <ListHostel />
        },
        {
            path: '/student/list',
            element: <ManageStudent />
        },
        {
            path: '/worker/list',
            element: <ManageWorker />
        },
        {
            path: '/service/list',
            element: <ManageService />
        },
        {
            path: '/polling/list',
            element: <Polling />
        },
        {
            path: '/service-requested/list',
            element: <ServiceRequests />
        },
        {
            path: '/water-coolers/list',
            element: <ListWaterCooler />
        }
    ]
};

export default MainRoutes;
