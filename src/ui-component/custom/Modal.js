/* eslint-disable */

import PropTypes from 'prop-types';
import { useState } from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import PerfectScrollbar from 'react-perfect-scrollbar';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2)
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1)
    }
}));

function CustomModal({ fullWidth, title, handleClose, children, isActive, closeText, saveText, size, handleSave, saveColor, fullScreen }) {
    const [maxWidth, setMaxWidth] = useState(size ? size : 'lg');
    return (
        <div>
            <BootstrapDialog
                fullScreen={fullScreen}
                color="transparent"
                sx={{ backdropFilter: 'blur(3px)' }}
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={isActive}
                fullWidth={fullWidth}
                maxWidth={maxWidth}
            >
                <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                    {title}
                </DialogTitle>

                <PerfectScrollbar component="div">
                    <DialogContent dividers>{children}</DialogContent>
                </PerfectScrollbar>

                <DialogActions>
                    <Button autoFocus onClick={handleClose}>
                        {closeText}
                    </Button>

                    {saveText && <Button color={saveColor || 'primary'} autoFocus onClick={handleSave}>
                        {saveText}
                    </Button>}
                </DialogActions>
            </BootstrapDialog>
        </div>
    );
}

export default CustomModal;
