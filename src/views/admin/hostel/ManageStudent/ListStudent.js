/* eslint-disable */

import PropTypes from 'prop-types';

// material-ui
import { Select, MenuItem, Button, CardActions, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import moment from 'moment/moment';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import axiosServices from 'utils/axios';
import { openSnackbar } from 'store/slices/snackbar';
import { DataGrid } from "@mui/x-data-grid";

// =========================|| DATA WIDGET - APPLICATION SALES CARD ||========================= //


const ListStudent = () => {
    const [studentData, setStudentData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hostelList, setHostelList] = useState([]);
    const dispatch = useDispatch();


    const fetchAllStudents = async () => {
        let { id } = JSON.parse(localStorage.getItem('university'));
        setIsLoading(true);
        await
            axiosServices
                .get(`/adminx/getAllStudents/${id}`)
                .then((r) => {
                    setStudentData(r.data);
                    setIsLoading(false);

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
                    setIsLoading(false);
                });
    }

    const fetchAllHostels = async () => {
        let { id } = JSON.parse(localStorage.getItem('university'));
        setIsLoading(true);
        await
            axiosServices
                .get(`/adminx/getAllHostels/`)
                .then((r) => {
                    setHostelList(r.data);
                    setIsLoading(false);

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
                    setIsLoading(false);
                });
    }
    useEffect(() => {
        fetchAllStudents();
        fetchAllHostels()
    }, [])

    const handleOnChangeHostel = (e, id) => {

        let hostelId = e.target.value;
        let userId = id.id;
        if (hostelId === 0) return
        let data = {
            userId,
            hostelId
        }
        axiosServices.post('/adminx/createHostelAssignment', data)
            .then((r) => {
                dispatch(
                    openSnackbar({
                        open: true,
                        message: "Hostedl assigned successfully",
                        variant: 'alert',
                        alert: {
                            color: 'success'
                        },
                        close: true
                    })
                );
                fetchAllStudents();
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
            })
    }


    return <ListStudentTable title={"List of all the Students"} studentData={studentData} hostelList={hostelList} loading={isLoading} handleOnChangeHostel={handleOnChangeHostel} />
}


const ListStudentTable = ({ title, studentData, hostelList, loading, handleOnChangeHostel }) => {

    // table data for student
    function createData(id, first_name, last_name, contact, email, created_at, hostel_name, hoste_id) {
        return { id, first_name, last_name, contact, email, created_at, hostel_name, hoste_id };
    }


    const rows = studentData?.map((item) => {
        const { userInfo } = item;
        const { HostelAssigned } = userInfo
        return createData(
            userInfo.id,
            userInfo.first_name,
            userInfo.last_name,
            userInfo.contact,
            userInfo.email,
            userInfo.created_at,
            HostelAssigned[0] || '',
            HostelAssigned[0]?.HostelInfo.id || '',

        );
    });

    const columns = [
        { field: "id", headerName: "ID", },
        {
            field: "first_name", headerName: "Name", width: 150, renderCell: (params) => {
                return (
                    <>
                        <Typography align="left" component="div">
                            {params.row.first_name} {" "} {params.row.last_name}
                        </Typography>

                    </>
                )
            }
        },
        { field: "contact", headerName: "Contact", width: 150, },
        { field: "email", headerName: "Email", width: 200, },
        {
            field: "hostel", headerName: "Hostel", width: 200, renderCell: (params) => {
                return (
                    <>
                        {/* {params.row.hostel_name?.HostelInfo?.name || "Not Assigned"} */}

                        {
                            //hostelData array make select option
                            <Select onChange={(e) => handleOnChangeHostel(e, params.row)} size='sm' defaultValue={0} value={params.row.hostel_name?.HostelInfo?.id}>
                                <MenuItem value={0}>Please Select</MenuItem>
                                {hostelList?.map((item) => {
                                    return <MenuItem value={item.id}>{item.name}</MenuItem>
                                })}
                            </Select>
                        }

                    </>
                )
            }
        },
        {
            field: "created_at", headerName: "Date joined", width: 200, renderCell: () => {
                return (
                    <>
                        <Typography align="left" component="div">
                            {moment().format('LL')}
                        </Typography>

                    </>
                )
            }
        },

    ];

    return (


        <MainCard title={title}>

            <div style={{ height: 500, width: '100%' }}>
                <DataGrid
                    loading={loading}
                    rows={rows}
                    columns={columns}
                />
            </div>


        </MainCard>
    );
}





export default ListStudent;
