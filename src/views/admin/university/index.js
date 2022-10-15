import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import axiosServices from 'utils/axios';
import { Button } from '@mui/material';
import { useModal } from '../../../hooks/useModal';
import CustomModal from 'ui-component/custom/Modal';
import AddNewMenu from './addNewMenu';
import moment from 'moment';
import EditMenuItem from './editMenuItem';
import { openSnackbar } from 'store/slices/snackbar';
import { useDispatch } from 'react-redux';

//  Edit Stuf
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const UniversityAdmin = () => {
    const dispatch = useDispatch();
    const [data, setData] = useState([]);
    const [uniId, setUniId] = useState();
    const [menuEditItem, setMenuEditItem] = useState({});
    const [itemModalOpen, setItemModalOpen, toggleModal] = useModal();
    const [itemModalEditOpen, setItemModalEditOpen, toggleEditModal] = useModal();

    const [deleteId, setDeleteId] = useState();

    //  Delete
    const [open, setOpen] = useState(false);
    const handleClickOpen = (id) => {
        setDeleteId(id);
        setOpen(true);
    };

    const fetchMenus = async () => {
        await axiosServices
            .get('/adminx/menulist')
            .then((res) => {
                console.log(res);
                setUniId(res.data.id);
                setData([...res.data.UniversityMenu]);
            })
            .catch((error) => {
                console.log(error);
            });
    };
    const handleClose = () => {
        setOpen(false);
    };
    const deleteMenuItem = () => {
        axiosServices
            .post('university-menu/delete', { menu_id: deleteId })
            .then((r) => {
                console.log(r);
                dispatch(
                    openSnackbar({
                        open: true,
                        message: 'Menu Deleted',
                        variant: 'alert',
                        alert: {
                            color: 'success'
                        },
                        close: true
                    })
                );
                fetchMenus();
                handleClose();
            })
            .catch((err) => {
                console.log(err);
                dispatch(
                    openSnackbar({
                        open: true,
                        message: err.data.message,
                        variant: 'alert',
                        alert: {
                            color: 'error'
                        },
                        close: true
                    })
                );
            });
    };

    const handleEditButton = (data) => {
        toggleEditModal();
        setMenuEditItem({ ...data });
    };
    const handleModal = (e) => {
        toggleModal();
    };

    const columns = [
        { field: 'name', headerName: 'Name', width: 200 },
        { field: 'description', headerName: 'Description', width: 300 },
        {
            field: 'created_at',
            headerName: 'Creation Date',
            width: 200,
            renderCell: (params) => moment(params.value).format('LL')
        },
        {
            field: 'action',
            headerName: 'Action',
            width: 200,
            renderCell: (params) => (
                <>
                    <Button onClick={() => handleEditButton(params.row)} color="secondary">
                        Edit
                    </Button>{' '}
                    <Button onClick={() => handleClickOpen(params.row.id)} color="error">
                        Delete
                    </Button>
                </>
            )
        }
    ];

    useEffect(() => {
        fetchMenus();
        return null;
    }, []);

    const a = null;
    return (
        <>
            <MainCard
                title="Menu List"
                secondary={
                    <>
                        <Button onClick={handleModal} variant="contained">
                            {' '}
                            Add Menu
                        </Button>
                    </>
                }
            >
                <div style={{ height: 300, width: '100%' }}>
                    <DataGrid disableSelectionOnClick sx={{ border: 0 }} rows={data} columns={columns} />
                </div>
            </MainCard>

            <CustomModal
                fullWidth="false"
                handleClose={() => setItemModalOpen(false)}
                isActive={itemModalOpen}
                title="Add New Menu"
                closeText="Cancel"
            >
                <AddNewMenu universityId={uniId} />
            </CustomModal>

            <CustomModal
                fullWidth="false"
                handleClose={() => setItemModalEditOpen(false)}
                isActive={itemModalEditOpen}
                title="Edit Menu Item"
                closeText="Cancel"
            >
                <EditMenuItem menuEditItem={menuEditItem} toggleEditModal={toggleEditModal} fetchMenus={fetchMenus} />
            </CustomModal>

            <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">Are you sure you want to delete?</DialogTitle>
                <DialogActions>
                    <Button color="error" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button onClick={deleteMenuItem} autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default UniversityAdmin;
