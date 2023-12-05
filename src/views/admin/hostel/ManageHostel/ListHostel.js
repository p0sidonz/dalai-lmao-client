/* eslint-disable */

import React, { useState, useEffect } from "react";
import { Button, Modal, Dialog, DialogTitle, DialogContent, DialogContentText, Typography, DialogActions, useTheme, TextField } from "@mui/material";
import axiosServices from 'utils/axios';
import { DataGrid } from "@mui/x-data-grid";
import MainCard from 'ui-component/cards/MainCard';
import { openSnackbar } from 'store/slices/snackbar';
import { useDispatch } from 'react-redux';
import ShowLoader from 'ui-component/custom/Loader';
import CustomModal from 'ui-component/custom/Modal';
import { useModal } from '../../../../hooks/useModal';
import AssignedStudents from "./AssignedStudents";

const HostelDataGrid = ({ hostels, fetchAllHostels }) => {
    const theme = useTheme()
    const dispatch = useDispatch();
    const [selectedHostelId, setSelectedHostelId] = useState(null);
    const [selectedHostel, setSelectedHostel] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const [itemModalOpen, setItemModalOpen, toggleModal] = useModal();
    const [studentModalOpen, setStudentModalOpen] = useState(false)
    const fetchHostelData = async (hostelId) => {
        console.log(hostelId)
        return await axiosServices
            .get(`/adminx/getOneHostel/${hostelId}`)
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
        setSelectedHostelId(row.id);
        fetchHostelData(row.id).then((hostel) => {
            setSelectedHostel(hostel);
            setIsLoading(false)
            setShowModal(true)

        }
        ).catch((err) => {
            setIsLoading(false)
            console.log(err);
        })

    };

    const handleEditClick = async (event, hostelId) => {
        // Edit the hostel with the given ID
        await editHostel(hostelId);

        // Refresh the hostel list
        const updatedHostels = await fetchAllHostels();
        setHostels(updatedHostels);
    };

    const handleRemoveClick = async (event, hostelId) => {
        // Delete the hostel with the given ID
        await deleteHostel(hostelId);

        // Refresh the hostel list
        const updatedHostels = await fetchAllHostels();
        setHostels(updatedHostels);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleAddNew = () => {
        setSelectedHostelId(null);
        setSelectedHostel(null);
        setShowModal(true);
    }

    const handleDeleteHostel = async () => {
        axiosServices.post(`/adminx/deleteHostel/${selectedHostelId}`).then((r) => {
            dispatch(
                openSnackbar({
                    open: true,
                    message: 'Hostel Deleted',
                    variant: 'alert',
                    alert: {
                        color: 'success'
                    },
                    close: true
                })
            );
            fetchAllHostels()
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

    const handleUpdateHostel = () => {
        console.log("handleUpdateHostel")

    }

    const handleAddNewHostel = async () => {
        let hostelData = selectedHostel
        let { id } = JSON.parse(localStorage.getItem("university"))
        hostelData.universityId = id
        axiosServices.post(`/adminx/createHostel`, hostelData).then((r) => {

            dispatch(
                openSnackbar({
                    open: true,
                    message: 'Hostel Added',
                    variant: 'alert',
                    alert: {
                        color: 'success'
                    },
                    close: true
                })
            );
            fetchAllHostels()
            setShowModal(false)
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

    const columns = [
        { field: "id", headerName: "ID", },
        { field: "name", headerName: "Name", width: 150, },
        { field: "address", headerName: "Address", width: 150, },
        { field: "phoneNumber", headerName: "Phone Number", width: 150, },
        {
            field: "actions",
            width: 350,
            headerName: "Actions",
            renderCell: (params) => (
                <>
                    {/* <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleRowClick(params.event, params.row)}
                    >
                        Fetch One
                    </Button> */}
                    <Button
                        sx={{ mx: 1 }}
                        variant="contained"
                        color="primary"
                        onClick={() => handleRowClick(params.event, params.row)}
                    >
                        View
                    </Button>
                    <Button
                        sx={{ mx: 1 }}
                        variant="outlined"
                        color="info"
                        onClick={() => {
                            setStudentModalOpen(true)
                            setSelectedHostelId(params.row.id)
                        }}
                    >
                        View Students
                    </Button>
                    <Button
                        sx={{ mx: 1 }}
                        variant="outlined"
                        color="error"
                        onClick={() => {
                            setItemModalOpen(true)
                            setSelectedHostelId(params.row.id)
                        }}
                    >
                        Delete
                    </Button>
                </>
            ),
        },
    ];

    return (
        <>
            <MainCard
                title="Hostel List"
                secondary={
                    <>
                        <Button onClick={handleAddNew} variant="contained">
                            {' '}
                            Add Hostel
                        </Button>
                    </>
                }
            >

                <div style={{ height: 300, width: '100%' }}>
                    <DataGrid
                        rows={hostels}
                        columns={columns}
                    />
                </div>
            </MainCard>
            <Dialog
                open={showModal}
                onClose={handleCloseModal}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                sx={{ p: 3 }}
            >
                <DialogTitle id="form-dialog-title">{selectedHostelId ? "Edit" : "Add"} Hostel</DialogTitle>
                <DialogContent>
                    <DialogContentText>

                    </DialogContentText>
                    <TextField
                        onChange={(e) => setSelectedHostel({ ...selectedHostel, name: e.target.value })}
                        fullWidth
                        id="name"
                        label="Name"
                        variant="outlined"
                        margin="normal"
                        defaultValue={selectedHostel?.name}
                    />
                    <TextField
                        onChange={(e) => setSelectedHostel({ ...selectedHostel, address: e.target.value })}
                        fullWidth
                        id="address"
                        label="Address"
                        variant="outlined"
                        margin="normal"
                        defaultValue={selectedHostel?.address}
                    />
                    <TextField
                        onChange={(e) => setSelectedHostel({ ...selectedHostel, phoneNumber: e.target.value })}
                        fullWidth
                        id="phoneNumber"
                        label="Phone Number"
                        variant="outlined"
                        margin="normal"
                        defaultValue={selectedHostel?.phoneNumber}
                    />
                    {selectedHostelId?.id && <TextField
                        fullWidth
                        disabled
                        id="universityId"
                        label="University ID"
                        variant="outlined"
                        margin="normal"
                        defaultValue={selectedHostel?.universityId}
                    />}


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
                        onClick={selectedHostelId ? handleUpdateHostel : handleAddNewHostel} variant="contained" size="small" autoFocus>
                        {selectedHostelId ? "Update" : "Add"}
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
                handleSave={handleDeleteHostel}
            />
            <CustomModal
                fullWidth
                handleClose={() => setStudentModalOpen(false)}
                isActive={studentModalOpen}
                title="Student"
                closeText="Close"
                fullScreen
            // saveText="Delete"
            >
                <AssignedStudents hostelId={selectedHostelId} />
            </CustomModal>
        </>
    );
};


const ListHostel = () => {

    const [hostels, setHostels] = useState([]);

    useEffect(() => {
        fetchAllHostels()
    }, []);

    const fetchAllHostels = async () => {
        return await axiosServices
            .get(`/adminx/getAllHostels`)
            .then((r) => {
                setHostels(r.data)
            })
            .catch((err) => {
                console.log(err);
            });

    }

    return <HostelDataGrid key={"243"} hostels={hostels} fetchAllHostels={fetchAllHostels} />


};

export default ListHostel;