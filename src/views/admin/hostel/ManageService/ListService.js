/* eslint-disable */

import PropTypes from 'prop-types';

// material-ui
import { FormControl, InputLabel, Chip, useTheme, Select, MenuItem, Button, TextField, CardActions, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogContentText, Typography, DialogActions, } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import moment from 'moment/moment';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import axiosServices from 'utils/axios';
import { openSnackbar } from 'store/slices/snackbar';
import { DataGrid } from "@mui/x-data-grid";
import CustomModal from 'ui-component/custom/Modal';
import { useModal } from '../../../../hooks/useModal';

// =========================|| DATA WIDGET - APPLICATION SALES CARD ||========================= //


const ListService = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [workerList, setWorkerList] = useState([]);
    const [selectedWorkerId, setSelectedWorkerId] = useState(null);
    const [selectedWorker, setSelectedWorker] = useState(null);
    const [itemModalOpen, setItemModalOpen, toggleModal] = useModal();
    const [workerModalOpen, setWorkerModalOpen] = useState(false)
    const [showModal, setShowModal] = useState(false);

    const dispatch = useDispatch();



    const fetchWorker = async () => {
        setIsLoading(true);
        await
            axiosServices
                .get(`/adminx/getAllServices`)
                .then((r) => {
                    setWorkerList(r.data);
                    setIsLoading(false);

                })
                .catch((err) => {
                    dispatch(
                        openSnackbar({
                            open: true,
                            message: err.data,
                            variant: 'alert',
                            alert: {
                                color: 'error'
                            },
                            close: true
                        })
                    );
                    setIsLoading(false);
                });
    }

    const handleDeleteWorker = (e) => {
        console.log(e)
    }

    const fetchWorkerData = async (workerId) => {
        return await axiosServices
            .get(`/adminx/getOneService/${workerId}`)
            .then((r) => {
                console.log(r.data)
                return r.data;
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const handleRowClick = (event, row) => {
        setIsLoading(true)
        setSelectedWorkerId(row.id);
        fetchWorkerData(row.id).then((hostel) => {
            setSelectedWorker(hostel);
            setIsLoading(false)
            setShowModal(true)

        }
        ).catch((err) => {
            setIsLoading(false)
            console.log(err);
        })

    };



    useEffect(() => {
        fetchWorker()
    }, [])


    const columns = [
        { field: "id", headerName: "ID", },
        {
            field: "title", headerName: "Title", width: 150, editable: true, renderCell: (params) => {
                return (
                    <>
                        <Typography align="left" component="div">
                            {params.row.title}
                        </Typography>

                    </>
                )
            }
        },
        {
            field: "isPublished", headerName: "Published", editable: true, width: 150, renderCell: (params) => {
                return <Chip color={params.row.isPublished ? "success" : "error"} label={params.row.isPublished ? "Yes" : "No"} />

            }
        },

        {
            field: "created_at", headerName: "Date added", width: 200, renderCell: () => {
                return (
                    <>
                        <Typography align="left" component="div">
                            {moment().format('LL')}
                        </Typography>

                    </>
                )
            }
        },
        {
            field: "actions",
            width: 350,
            headerName: "Actions",
            renderCell: (params) => (
                <>

                    <Button
                        sx={{ mx: 1 }}
                        variant="contained"
                        color="primary"
                        onClick={() => handleRowClick(params.event, params.row)}
                    >
                        View
                    </Button>
                    {/* <Button
                        sx={{ mx: 1 }}
                        variant="outlined"
                        color="info"
                        onClick={() => {
                            setWorkerModalOpen(true)
                            setSelectedWorkerId(params.row.id)
                        }}
                    >
                        View Students
                    </Button> */}
                    <Button
                        sx={{ mx: 1 }}
                        variant="outlined"
                        color="error"
                        onClick={() => {
                            setItemModalOpen(true)
                            setSelectedWorkerId(params.row.id)
                        }}
                    >
                        Delete
                    </Button>
                </>
            ),
        },

    ];

    const handleUpdateWorker = async () => {
        await axiosServices.post(`/adminx/updateService`, selectedWorker)
            .then((r) => {
                dispatch(
                    openSnackbar({
                        open: true,
                        message: r.data.message,
                        variant: 'alert',
                        alert: {
                            color: 'success'
                        },
                        close: true
                    })
                );
                setShowModal(false)
                fetchWorker()
            })
            .catch((err) => {
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
    }

    const handleAddNewWorker = async () => {
        await axiosServices.post(`/adminx/createService`, selectedWorker)
            .then((r) => {
                dispatch(
                    openSnackbar({
                        open: true,
                        message: r.data.message,
                        variant: 'alert',
                        alert: {
                            color: 'success'
                        },
                        close: true
                    })
                );
                setShowModal(false)
                fetchWorker()
            })
            .catch((err) => {
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
    }

    const handleAddNew = () => {
        setSelectedWorkerId(null);
        setSelectedWorker(null);
        setShowModal(true);
    }



    return <ListWorkerTable
        title={"List of all the Services"}
        workerList={workerList}
        loading={isLoading}
        itemModalOpen={itemModalOpen}
        handleDeleteWorker={handleDeleteWorker}
        setItemModalOpen={setItemModalOpen}
        setWorkerModalOpen={setWorkerModalOpen}
        selectedWorkerId={selectedWorkerId}
        setSelectedWorkerId={setSelectedWorkerId}
        selectedWorker={selectedWorker}
        setSelectedWorker={setSelectedWorker}
        showModal={showModal}
        setShowModal={setShowModal}
        columns={columns}
        handleUpdateWorker={handleUpdateWorker}
        handleAddNewWorker={handleAddNewWorker}
        handleAddNew={handleAddNew}
    />
}



const ListWorkerTable = ({ handleAddNew, handleUpdateWorker, handleAddNewWorker, columns, setShowModal, showModal, title, workerList, loading, handleOnChangeHostel, itemModalOpen, handleDeleteWorker, setWorkerModalOpen, setItemModalOpen, setSelectedWorkerId, selectedWorkerId, selectedWorker, setSelectedWorker }) => {
    const theme = useTheme();
    const handleCloseModal = () => {
        setShowModal(false);
    };

    // table data for student
    function createData(id, title, isPublished, created_at) {
        return { id, title, isPublished, created_at };
    }


    const rows = workerList?.map((item) => {
        return createData(
            item.id,
            item.title,
            item.isPublished,
            item.created_at,

        );
    });


    return (


        <MainCard title={title} secondary={
            <>
                <Button onClick={handleAddNew} variant="contained">
                    {' '}
                    Add Worker
                </Button>
            </>
        }>

            <div style={{ height: 500, width: '100%' }}>
                <DataGrid
                    loading={loading}
                    rows={rows}
                    columns={columns}
                // onCellEditStop={(e) => {
                //     console.log(e)
                // }}
                />
            </div>

            <Dialog
                open={showModal}
                onClose={handleCloseModal}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                sx={{ p: 3 }}
            >
                <DialogTitle id="form-dialog-title">{selectedWorkerId ? "Edit" : "Add"} Service</DialogTitle>
                <DialogContent>
                    <DialogContentText>

                    </DialogContentText>
                    <TextField
                        onChange={(e) => setSelectedWorker({ ...selectedWorker, title: e.target.value })}
                        fullWidth
                        id="title"
                        label="Title"
                        variant="outlined"
                        margin="normal"
                        defaultValue={selectedWorker?.title}
                    />
                    <FormControl variant="standard" sx={{ m: 1, minWidth: 150 }}>
                        <InputLabel id="Published">Published</InputLabel>
                        <Select label="Published" value={selectedWorker?.isPublished} onChange={(e) => setSelectedWorker({ ...selectedWorker, isPublished: e.target.value })}>
                            <MenuItem value={"true"}>Yes</MenuItem>
                            <MenuItem value={"false"}>No</MenuItem>
                        </Select>
                    </FormControl>
                    {/* <TextField
                        onChange={(e) => setSelectedWorker({ ...selectedWorker, email: e.target.value })}
                        fullWidth
                        id="email"
                        label="Email"
                        variant="outlined"
                        margin="normal"
                        defaultValue={selectedWorker?.email}
                    />
                    <TextField
                        onChange={(e) => setSelectedWorker({ ...selectedWorker, phoneNumber: e.target.value })}
                        fullWidth
                        id="phoneNumber"
                        label="Phone Number"
                        variant="outlined"
                        margin="normal"
                        defaultValue={selectedWorker?.phoneNumber}
                    />
                    {selectedWorkerId?.id && <TextField
                        fullWidth
                        disabled
                        id="id"
                        label="id"
                        variant="outlined"
                        margin="normal"
                        defaultValue={selectedWorker?.id}
                    />} */}


                </DialogContent>
                <DialogActions sx={{ pr: 2.5 }}>
                    <Button
                        sx={{ color: theme.palette.error.dark, borderColor: theme.palette.error.dark }}
                        onClick={handleCloseModal}
                        color="secondary"
                    >
                        Cancel
                    </Button>
                    <Button
                        // onClick={handleCloseModal} 
                        onClick={selectedWorkerId ? handleUpdateWorker : handleAddNewWorker}
                        variant="contained" size="small" autoFocus

                    >
                        {selectedWorkerId ? "Update" : "Add"}
                    </Button>
                </DialogActions>
            </Dialog>


            <CustomModal
                handleClose={() => setItemModalOpen(false)}
                isActive={itemModalOpen}
                title="Are you sure you want to delete?"
                closeText="Cancel"
                saveText="Delete"
                saveColor="error"
                handleSave={handleDeleteWorker}
            />

        </MainCard>
    );
}





export default ListService;
