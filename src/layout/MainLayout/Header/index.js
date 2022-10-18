// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Box, Grid } from '@mui/material';

// project imports
import LogoSection from '../LogoSection';
import SearchSection from './SearchSection';
import MobileSection from './MobileSection';
import ProfileSection from './ProfileSection';
import LocalizationSection from './LocalizationSection';
import MegaMenuSection from './MegaMenuSection';
import NotificationSection from './NotificationSection';
import { useDispatch, useSelector } from 'store';
import { openDrawer } from 'store/slices/menu';

// assets
import { IconMenu2 } from '@tabler/icons';

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const Header = () => {
    const theme = useTheme();

    const dispatch = useDispatch();
    const { drawerOpen } = useSelector((state) => state.menu);

    return (
        <>
            <Grid container direction="row" justifyContent="center" alignItems="center">
                <LogoSection />
            </Grid>
        </>
    );
};

export default Header;
