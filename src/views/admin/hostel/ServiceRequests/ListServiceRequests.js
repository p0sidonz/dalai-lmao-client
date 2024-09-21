/* eslint-disable */

import PropTypes from 'prop-types';

// material-ui
import { FormControl, InputLabel, useTheme, Select, MenuItem, Button, TextField, CardActions, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogContentText, Typography, DialogActions, Chip, } from '@mui/material';

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


const ListServiceRequests = () => {
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
                .get(`/adminx/getAllServiceRequest`)
                .then((r) => {
                    setWorkerList(r.data.data);
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
            // fetchWorker()
            // fetchAllHostel()
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
            .get(`/adminx/getAllServiceRequest`)
            .then((r) => {
                workerList(r.data);
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



    const getChipColor = (status) => {
        switch (status) {
            case "pending":
                return "warning";
            case "accepted":
                return "success";
            case "rejected":
                return "error";
            default:
                return "primary";
        }
    }

    useEffect(() => {
        fetchWorker()
    }, [])

    const renameStatus = (status) => {
        switch (status) {
            case "pending":
                return "Pending";
            case "accepted":
                return "Resolved";
            case "rejected":
                return "error";
            default:
                return "primary";
        }
    }


    const columns = [
        { field: "id", headerName: "ID", },
        {
            field: "description", headerName: "Issue", width: 250, editable: true, renderCell: (params) => {
                return (
                    <>
                        <Typography align="left" component="div">
                            {params.row.description}
                        </Typography>

                    </>
                )
            }
        },
        {
            field: "userInfo", headerName: "Student", width: 200,
            renderCell: (params) => {
                return (<>
                    <Typography sx={{ mr: 2 }} align="left" component="div">{`${params.row.userInfo?.first_name} ${params.row.userInfo?.last_name}`}</Typography>
                    <Typography align="left" component="div"> {"("}{params.row.userInfo?.roomNo || "no room no."}{")"}</Typography>
                </>)
            }

        },
        {
            width: 150,
            field: "serviceName",
            headerName: "Service Requested",
            valueGetter: (params) => params.row.serviceName,
        },
        {
            field: "hostelName",
            headerName: "Hostel",
            valueGetter: (params) => params.row.hostelName,
        },
        {
            field: "status", headerName: "Status", width: 200,
            renderCell: (params) => {
                return (<Chip color={getChipColor(params.row.status)} label={renameStatus(params.row.status)} />)
            }
        },
        {
            field: "workerInfo", headerName: "Worker", width: 200,
            renderCell: (params) => {
                return (<>
                    <Typography sx={{ mr: 2 }} align="left" component="div">{params.row.workerInfo?.name}</Typography>
                    <Typography align="left" component="div"> {"("}{params.row.workerInfo?.phoneNumber}{")"}</Typography>
                </>)
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

        // {
        //     field: "actions",
        //     width: 350,
        //     headerName: "Actions",
        //     renderCell: (params) => (
        //         <>

        //             <Button
        //                 sx={{ mx: 1 }}
        //                 variant="contained"
        //                 color="primary"
        //                 onClick={() => handleRowClick(params.event, params.row)}
        //             >
        //                 View
        //             </Button>
        //             {/* <Button
        //                 sx={{ mx: 1 }}
        //                 variant="outlined"
        //                 color="info"
        //                 onClick={() => {
        //                     setWorkerModalOpen(true)
        //                     setSelectedWorkerId(params.row.id)
        //                 }}
        //             >
        //                 View Students
        //             </Button> */}
        //             <Button
        //                 sx={{ mx: 1 }}
        //                 variant="outlined"
        //                 color="error"
        //                 onClick={() => {
        //                     setItemModalOpen(true)
        //                     setSelectedWorkerId(params.row.id)
        //                 }}
        //             >
        //                 Delete
        //             </Button>
        //         </>
        //     ),
        // },

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
        title={"List of all the Service Requests"}
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
        fetchWorker={fetchWorker}
    />
}



const ListWorkerTable = ({ fetchWorker,servicesList, hostelList, handleAddNew, handleUpdateWorker, handleAddNewWorker, columns, setShowModal, showModal, title, workerList, loading, handleOnChangeHostel, itemModalOpen, handleDeleteWorker, setWorkerModalOpen, setItemModalOpen, setSelectedWorkerId, selectedWorkerId, selectedWorker, setSelectedWorker }) => {
    const theme = useTheme();
    const handleCloseModal = () => {
        setShowModal(false);
    };

    const dispatch = useDispatch();

    // table data for student
    function createData(id, description, created_at, hostelName, status, serviceName, userInfo, workerInfo) {
        return { id, description, created_at, hostelName, status, serviceName, userInfo, workerInfo };
    }


    const rows = workerList?.map((item) => {
        return createData(
            item.id,
            item.description,
            item.created_at,
            item.UserInfo?.HostelAssigned[0]?.HostelInfo?.name || "Not Assigned",
            item.status,
            item.ServiceInfo.title || "Not Assigned",
            item.UserInfo,
            item.ServiceInfo.Worker[0]

        );
    });

    const [selectedRequestId, setSelectedRequestId] = useState(null)
    const [selectedRequest, setSelectedRequest] = useState(null)
    const [requestModalOpen, setRequestModalOpen] = useState(false)
    const [requestLoading, setRequestLoading] = useState(false)

    const handleRequestModalOpen = () => {
        setRequestModalOpen(true);
    }

    const handleRequestModalClose = () => {
        setRequestModalOpen(false);
    }


    const handleRowClick = (event, row) => {
        console.log("handleRowClick", event.row.description)
        setSelectedRequest(event.row)
        setRequestModalOpen(true)
    };

    const handleMarkThisAsResolved = (id) => {
        setRequestLoading(true)
        axiosServices.get(`/adminx/markAsResolved/${selectedRequest.id}`)
            .then((r) => {
                dispatch(
                    openSnackbar({
                        open: true,
                        message: "Request marked as resolved",
                        variant: 'alert',
                        alert: {
                            color: 'success'
                        },
                        close: true
                    })
                );
                setRequestLoading(false)
                fetchWorker()
                setRequestModalOpen(false)
            })
            .catch((err) => {
                console.log(err)
                dispatch(
                    openSnackbar({
                        open: true,
                        message: "Error marking request as resolved",
                        variant: 'alert',
                        alert: {
                            color: 'error'
                        },
                        close: true
                    })
                );
                setRequestLoading(false)
            });
    }

    return (


        <MainCard title={title}
        // secondary={
        //     <>
        //         <Button onClick={handleAddNew} variant="contained">
        //             {' '}
        //             Add Worker
        //         </Button>
        //     </>
        // }
        >

            <div style={{ height: 500, width: '100%' }}>
                <DataGrid
                    onCellClick={handleRowClick}
                    getRowHeight={({ id, densityFactor }) => {
                        if (id % 2 === 0) {
                            return 100 * densityFactor;
                        }

                        return null;
                    }}
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

                    {/* <FormControl variant="standard" sx={{ mt: 1, minWidth: 120 }} fullWidth>
                        <InputLabel id="Service">Please Select Service</InputLabel>
                        <Select onChange={(e) => setSelectedWorker({ ...selectedWorker, serviceId: e.target.value })} sx={{ mt: 2 }} fullWidth size='sm' defaultValue={selectedWorker?.serviceId}>
                            {servicesList?.map((item) => {
                                return <MenuItem value={item.id}>{item.title}</MenuItem>
                            })}
                        </Select>
                    </FormControl> */}
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

            <CustomModal
                handleClose={() => setRequestModalOpen(false)}
                isActive={requestModalOpen}
                title="Service Request"
                closeText="close"
                saveColor="error"
                handleSave={handleDeleteWorker}
            >
                <Typography>
                    <b>Issue:</b> {selectedRequest?.description}
                </Typography>

               {selectedRequest?.status !== "accepted" &&  <Button sx={{mt: 2, mb: 2}}
                variant='contained' color='primary'
                onClick={handleMarkThisAsResolved}>Mark this Request as Resolved</Button>}
            </CustomModal>

        </MainCard>
    );
}





export default ListServiceRequests;
