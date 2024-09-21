/* eslint-disable */

import React, { useState, useEffect } from 'react';
import axiosServices from 'utils/axios';
import { DataGrid } from "@mui/x-data-grid";
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
const ListWaterCooler = () => {
    const [coolers, setCoolers] = useState([]);
    const [formData, setFormData] = useState({ name: '', location: '' });
    const [openDialog, setOpenDialog] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const universityId = JSON.parse(localStorage.getItem('university'))?.id;

    useEffect(() => {
        if (universityId) {
            fetchCoolers();
        }
    }, [universityId]);

    const fetchCoolers = async () => {
        try {
            const response = await axiosServices.get(`/water-rating/get-coolers/${universityId}`);
            setCoolers(response.data.data);
        } catch (error) {
            console.error('Error fetching coolers:', error);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        //get the current cooler id
        const coolerId = formData.id;
        try {
            if (isEditing) {
                await axiosServices.post(`/water-rating/update-cooler/${formData.id}`, formData);
            } else {
                await axiosServices.post(`/water-rating/add-cooler`, {
                    location: formData.location,
                    name: formData.name,
                    university_id: universityId
                });
            }
            fetchCoolers();
            setFormData({ name: '', location: '' });
            setOpenDialog(false);
            setIsEditing(false);
        } catch (error) {
            console.error('Error saving cooler:', error);
        }
    };

    const handleEdit = (cooler) => {
        setFormData({ id: cooler.id, name: cooler.name, location: cooler.location });
        setIsEditing(true);
        setOpenDialog(true);
    };

    const handleDelete = async (id) => {
        const confirm = window.confirm("Are you sure you want to delete this cooler?");
        if (confirm) {
            try {
                await axiosServices.post(`/water-rating/delete-cooler/${id}`);
                fetchCoolers();
            } catch (error) {
                console.error('Error deleting cooler:', error);
            }
        }
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name', headerName: 'Name', width: 200 },
        { field: 'location', headerName: 'Location', width: 200 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 200,
            renderCell: (params) => (
                <>
                    <Button onClick={() => handleEdit(params.row)}>Edit</Button>
                    <Button onClick={() => handleDelete(params.row.id)}>Delete</Button>
                </>
            ),
        },
    ];

    if (!universityId) {
        return <div>University ID not found. Please log in.</div>;
    }

    return (
        <div style={{ height: 400, width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Water Coolers</h3>
            <Button size='small' variant='contained' onClick={() => { setFormData({ name: '', location: '' }); setIsEditing(false); setOpenDialog(true); }}>
                Add New Cooler
            </Button>
            </div>
            <div style={{ height: 400, width: '100%', backgroundColor: 'white' }}>
                <DataGrid
                    rows={coolers}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    checkboxSelection
                    disableSelectionOnClick
                />
            </div>
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>{isEditing ? 'Edit Cooler' : 'Add New Cooler'}</DialogTitle>

                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="name"
                        label="Cooler Name"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={formData.name}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="location"
                        label="Location"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={formData.location}
                        onChange={handleInputChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleSubmit}>{isEditing ? 'Update' : 'Add'}</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ListWaterCooler;