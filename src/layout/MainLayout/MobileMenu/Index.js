import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import RestoreIcon from '@mui/icons-material/Restore';
import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import ChatIcon from '@mui/icons-material/Chat';
import MenuIcon from '@mui/icons-material/Menu';
import useAuth from 'hooks/useAuth';
import MenuBookIcon from '@mui/icons-material/MenuBook';

export default function SimpleBottomNavigation() {
    // const { user } = useAuth();
    const user = JSON.parse(window.localStorage.getItem('user'));
    const [value, setValue] = React.useState(0);

    const menuItemStudent = [
        { label: 'Menu', path: '/', role: 'student', icon: <HomeIcon /> },
        { label: 'Chat', path: '/chat', role: 'student', icon: <ChatIcon /> },
        { label: 'Settings', path: '/profile', role: 'student', icon: <MenuIcon /> }
    ];

    const menuItemUniversityOwner = [
        { label: 'University Menu', path: '/adminx', role: 'universityOwner', icon: <MenuBookIcon /> },
        { label: 'Chat', path: '/chat', role: 'student', icon: <ChatIcon /> },
        { label: 'Settings', path: '/profile', role: 'student', icon: <MenuIcon /> }
    ];

    const RenderMenuList = () => {
        switch (user.role) {
            case 'student':
                return menuItemStudent.map((item, index) => (
                    <BottomNavigationAction component={Link} to={item.path} label={item.label} icon={item.icon} />
                ));

            case 'universityOwner':
                return menuItemUniversityOwner.map((item, index) => (
                    <BottomNavigationAction component={Link} to={item.path} label={item.label} icon={item.icon} />
                ));

            default:
                return null;
        }
    };
    return (
        <Box sx={{ width: 500 }}>
            <BottomNavigation
                sx={{
                    position: 'fixed',
                    bottom: '0px',
                    left: '0px',
                    right: '0px',
                    marginBottom: '0px',
                    width: '100vw'
                }}
                showLabels
                value={value}
                onChange={(event, newValue) => {
                    setValue(newValue);
                }}
            >
                <RenderMenuList />
            </BottomNavigation>
        </Box>
    );
}
