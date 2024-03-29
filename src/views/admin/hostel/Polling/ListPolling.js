/* eslint-disable */

import PropTypes from 'prop-types';

// material-ui
import { Grid, LinearProgress, Autocomplete, FormControl, InputLabel, Chip, useTheme, Select, MenuItem, Button, TextField, CardActions, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogContentText, Typography, DialogActions, } from '@mui/material';

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
import Chart from 'react-apexcharts';

// =========================|| DATA WIDGET - APPLICATION SALES CARD ||========================= //


const PollingList = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [workerList, setWorkerList] = useState([]);
    const [selectedWorkerId, setSelectedWorkerId] = useState(null);
    const [selectedWorker, setSelectedWorker] = useState(null);
    const [itemModalOpen, setItemModalOpen, toggleModal] = useModal();
    const [resultModalOpen, setResultModalOpen] = useState(false);
    const [workerModalOpen, setWorkerModalOpen] = useState(false)
    const [votesList, setVotesList] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const dispatch = useDispatch();



    const fetchWorker = async () => {
        setIsLoading(true);
        await
            axiosServices
                .get(`/adminx/getAllPollings`)
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




    const fetchOnePolling = async (id) => {
        return await axiosServices
            .get(`/adminx/getOnePolling/${id}`)
            .then((r) => {
                setVotesList(r.data)
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const handleDeleteWorker = (e) => {
        console.log(e)
    }

    const fetchWorkerData = async (workerId) => {
        return await axiosServices
            .get(`/adminx/getOnePolling/${workerId}`)
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
            field: "title", headerName: "Title", width: 300, renderCell: (params) => {
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
            field: "is_active", headerName: "Published", width: 150, renderCell: (params) => {
                return <Chip color={params.row.is_active ? "success" : "error"} label={params.row.is_active ? "Yes" : "No"} />

            }
        },
        {
            field: "options", headerName: "Options", width: 350, renderCell: (params) => {
                return params.row?.options?.map((item) => <Chip sx={{ m: 0.5 }} label={item} />)
                // return <Typography align="left" component="div">
                //     {JSON.stringify(params.row)}
                // </Typography>


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
                        color="success"
                        onClick={() => {
                            fetchOnePolling(params.row.id)
                            setResultModalOpen(true)
                        }
                        }
                    >
                        View result
                    </Button>
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
        if (!selectedWorker?.options?.length) {
            dispatch(
                openSnackbar({
                    open: true,
                    message: "Please add options",
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    },
                    close: true
                })
            );
            return
        }
        await axiosServices.post(`/adminx/updatePolling`, selectedWorker)
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
        await axiosServices.post(`/adminx/createPolling`, selectedWorker)
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

    const handleInputChange = (event, value) => {
        console.log("eventeventevent", event)
        setSelectedWorker({ ...selectedWorker, options: value });
    }


    return <ListWorkerTable
        title={"Polling"}
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
        handleInputChange={handleInputChange}
        resultModalOpen={resultModalOpen}
        setResultModalOpen={setResultModalOpen}
        votingData={votesList}

    />
}




const ListWorkerTable = ({ votingData, resultModalOpen, setResultModalOpen, handleInputChange, handleAddNew, handleUpdateWorker, handleAddNewWorker, columns, setShowModal, showModal, title, workerList, loading, handleOnChangeHostel, itemModalOpen, handleDeleteWorker, setWorkerModalOpen, setItemModalOpen, setSelectedWorkerId, selectedWorkerId, selectedWorker, setSelectedWorker }) => {
    const theme = useTheme();
    const [percentages, setPercentages] = useState([]);
    const handleCloseModal = () => {
        setShowModal(false);
    };




    // table data for student
    function createData(id, title, options, is_active, created_at) {
        return { id, title, options, is_active, created_at };
    }


    const rows = workerList?.map((item) => {
        return createData(
            item.id,
            item.title,
            item.options,
            item.is_active,
            item.created_at,

        );
    });


    return (


        <MainCard title={title} secondary={
            <>
                <Button onClick={handleAddNew} variant="contained">
                    {' '}
                    Create Poll
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
                <DialogTitle id="form-dialog-title">{selectedWorkerId ? "Edit" : "Add"} Poll</DialogTitle>
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
                        <Select label="Published" value={selectedWorker?.is_active} onChange={(e) => setSelectedWorker({ ...selectedWorker, is_active: e.target.value })}>
                            <MenuItem value={"true"}>Yes</MenuItem>
                            <MenuItem value={"false"}>No</MenuItem>
                        </Select>
                    </FormControl>
                    <Autocomplete
                        multiple
                        disableClearable
                        disablePortal
                        id="addable-select"
                        options={[]}
                        freeSolo
                        renderInput={(params) => (
                            <TextField {...params} label="Add Option" variant="outlined" />
                        )}
                        onChange={handleInputChange}
                        value={selectedWorker?.options}
                    />


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
            >
            </CustomModal>
            <CustomModal
                fullWidth={true}
                size="md"
                handleClose={() => setResultModalOpen(false)}
                isActive={resultModalOpen}
                title="Result"
                closeText="Close"
            >
                <RenderVotes votingData={votingData} />
            </CustomModal>





        </MainCard>
    );
}





const RenderVotes = ({ votingData }) => {

    const [percentages, setPercentages] = useState([]);

    // Calculate the percentage of votes for each option
    const calculatePercentages = () => {
        const optionCounts = votingData?.options?.reduce((counts, option) => {
            counts[option] = votingData.Vote?.filter((vote) => vote.option === option)?.length;
            return counts;
        }, {});

        const totalVotes = votingData.Vote?.length;

        const percentages = votingData.options?.map((option) => ({
            option,
            percentage: ((optionCounts[option] || 0) / totalVotes) * 100,
            votes: optionCounts[option] || 0, // New line to include the number of votes
        }));
        setPercentages(percentages)
        return percentages;
    };




    useEffect(() => {
        const percentages = calculatePercentages();
        if (percentages) {
            setPercentages(percentages);

        }
    }, [votingData.length]);



    console.log(percentages, "percentagespercentagespercentagespercentages")
    return (
        <div>
            {percentages?.map((data, index) => (
                <div key={index}>
                    <Grid item xs={12}>
                        <Grid container alignItems="center" spacing={1}>
                            <Grid item sm zeroMinWidth>
                                <Typography variant="body2">{data.option}</Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="body2" align="right">
                                    {`(${data.votes})`}       {`${data.percentage.toFixed(2)}%`}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <LinearProgress variant="determinate" value={data.percentage.toFixed(2)} color="primary" />
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
            ))}
        </div>
    );
};




export default PollingList;
