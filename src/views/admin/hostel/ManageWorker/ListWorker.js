/* eslint-disable */

import PropTypes from 'prop-types';

// material-ui
import { FormControl, InputLabel, useTheme, Select, MenuItem, Button, TextField, CardActions, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogContentText, Typography, DialogActions, } from '@mui/material';

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


const ListWorker = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [hostelList, setHostelList] = useState([]);
    const [workerList, setWorkerList] = useState([]);
    const [selectedWorkerId, setSelectedWorkerId] = useState(null);
    const [selectedServiceId, setSelectedServiceId] = useState(null)
    const [selectedWorker, setSelectedWorker] = useState(null);
    const [itemModalOpen, setItemModalOpen, toggleModal] = useModal();
    const [workerModalOpen, setWorkerModalOpen] = useState(false)
    const [showModal, setShowModal] = useState(false);
    const [servicesList, setServicesList] = useState([])

    const dispatch = useDispatch();



    const fetchWorker = async () => {
        setIsLoading(true);
        await
            axiosServices
                .get(`/adminx/getAllWorkers`)
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
        axiosServices.post(`/adminx/deleteWorker/${selectedWorkerId}`).then((r) => {
            dispatch(
                openSnackbar({
                    open: true,
                    message: 'Worker Deleted',
                    variant: 'alert',
                    alert: {
                        color: 'success'
                    },
                    close: true
                })
            );
            fetchWorker()
            fetchAllHostel()
            fetchAllService()
            setItemModalOpen(false)
        }).catch((err) => {
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
            console.log(err)
        })
    }

    const fetchWorkerData = async (workerId) => {
        console.log(workerId)
        return await axiosServices
            .get(`/adminx/getOneWorker/${workerId}`)
            .then((r) => {
                console.log(r.data)
                return r.data;
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const fetchAllService = async () => {
        return await axiosServices
            .get(`/adminx/getAllServices`)
            .then((r) => {
                setServicesList(r.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const fetchAllHostel = async () => {
        return await axiosServices
            .get(`/adminx/getAllHostels`)
            .then((r) => {
                setHostelList(r.data);
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
        fetchAllHostel()
        fetchAllService()
    }, [])


    const columns = [
        { field: "id", headerName: "ID", },
        {
            field: "name", headerName: "Name", width: 150, editable: true, renderCell: (params) => {
                return (
                    <>
                        <Typography align="left" component="div">
                            {params.row.name}
                        </Typography>

                    </>
                )
            }
        },
        {
            field: "hostelName",
            headerName: "Hostel Name",
            valueGetter: (params) => params.row.hostelName,
        },
        { field: "phoneNumber", headerName: "Phone Number", editable: true, width: 150, },
        { field: "email", headerName: "Email", width: 200, },

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
            field: "assignedService", headerName: "Assigned Service", width: 200, renderCell: (params) => {
                return (
                    <>
                        {/* {params.row.hostel_name?.HostelInfo?.name || "Not Assigned"} */}

                        {
                            //hostelData array make select option
                            <Select disabled onChange={(e) => handleOnChangeHostel(e, params.row)} size='sm' defaultValue={0} value={params.row.serviceId}>
                                <MenuItem value={0}>Please Select</MenuItem>
                                {servicesList?.map((item) => {
                                    return <MenuItem value={item.id}>{item.title}</MenuItem>
                                })}
                            </Select>
                        }

                    </>
                )

            },
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
        await axiosServices.post(`/adminx/updateWorker`, selectedWorker)
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
        await axiosServices.post(`/adminx/createWorker`, selectedWorker)
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


    const handleOnChangeHostel = (e, id) => {

        // let hostelId = e.target.value;
        // let userId = id.id;
        // if (hostelId === 0) return
        // let data = {
        //     userId,
        //     hostelId
        // }
        // axiosServices.post('/adminx/createHostelAssignment', data)
        //     .then((r) => {
        //         dispatch(
        //             openSnackbar({
        //                 open: true,
        //                 message: "Hostedl assigned successfully",
        //                 variant: 'alert',
        //                 alert: {
        //                     color: 'success'
        //                 },
        //                 close: true
        //             })
        //         );
        //         fetchAllStudents();
        //     })
        //     .catch((err) => {
        //         dispatch(
        //             openSnackbar({
        //                 open: true,
        //                 message: err.data.message,
        //                 variant: 'alert',
        //                 alert: {
        //                     color: 'error'
        //                 },
        //                 close: true
        //             })
        //         );
        //     })
    }


    return <ListWorkerTable
        title={"List of all the Workers"}
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
        hostelList={hostelList}
        handleOnChangeHostel={handleOnChangeHostel}
        servicesList={servicesList}
    />
}



const ListWorkerTable = ({ servicesList, hostelList, handleAddNew, handleUpdateWorker, handleAddNewWorker, columns, setShowModal, showModal, title, workerList, loading, handleOnChangeHostel, itemModalOpen, handleDeleteWorker, setWorkerModalOpen, setItemModalOpen, setSelectedWorkerId, selectedWorkerId, selectedWorker, setSelectedWorker }) => {
    const theme = useTheme();
    const handleCloseModal = () => {
        setShowModal(false);
    };

    // table data for student
    function createData(id, name, phoneNumber, email, created_at, hostelName, serviceId) {
        return { id, name, phoneNumber, email, created_at, hostelName, serviceId };
    }


    const rows = workerList?.map((item) => {
        return createData(
            item.id,
            item.name,
            item.phoneNumber,
            item.email,
            item.created_at,
            item.HostelInfo?.name,
            item.serviceId

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
                <DialogTitle id="form-dialog-title">{selectedWorkerId ? "Edit" : "Add"} Worker</DialogTitle>
                <DialogContent>
                    <DialogContentText>

                    </DialogContentText>
                    <TextField
                        onChange={(e) => setSelectedWorker({ ...selectedWorker, name: e.target.value })}
                        fullWidth
                        id="name"
                        label="Name"
                        variant="outlined"
                        margin="normal"
                        defaultValue={selectedWorker?.name}
                    />
                    <TextField
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
                    />}

                    <FormControl variant="standard" sx={{ mt: 1, minWidth: 120 }} fullWidth>
                        <InputLabel id="Hostel">Please Select Hostel</InputLabel>
                        <Select onChange={(e) => setSelectedWorker({ ...selectedWorker, hostelId: e.target.value })} sx={{ mt: 2 }} fullWidth size='sm' defaultValue={selectedWorker?.hostelId}>

                            {hostelList?.map((item) => {
                                return <MenuItem value={item.id}>{item.name}</MenuItem>
                            })}
                        </Select>
                    </FormControl>

                    <FormControl variant="standard" sx={{ mt: 1, minWidth: 120 }} fullWidth>
                        <InputLabel id="Service">Please Select Service</InputLabel>
                        <Select onChange={(e) => setSelectedWorker({ ...selectedWorker, serviceId: e.target.value })} sx={{ mt: 2 }} fullWidth size='sm' defaultValue={selectedWorker?.serviceId}>
                            {servicesList?.map((item) => {
                                return <MenuItem value={item.id}>{item.title}</MenuItem>
                            })}
                        </Select>
                    </FormControl>
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





export default ListWorker;
