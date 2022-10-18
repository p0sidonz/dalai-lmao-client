import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import { useState } from 'react';
import { useTheme } from '@mui/material/styles';

const ShowLoader = ({ isLoading }) => {
    const theme = useTheme();
    return (
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isLoading}>
            <CircularProgress color="inherit" />
        </Backdrop>
    );
};

export default ShowLoader;
