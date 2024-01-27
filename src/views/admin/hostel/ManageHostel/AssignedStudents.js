/* eslint-disable */
import React, { useState, useEffect } from "react";
import { Button, Modal, Dialog, DialogTitle, DialogContent, DialogContentText, Typography, DialogActions, useTheme, TextField } from "@mui/material";
import axiosServices from 'utils/axios';
import { openSnackbar } from 'store/slices/snackbar';
import { useDispatch } from "react-redux";
import AssignedList from "./AssignedList";

const AssignedStudents = ({ hostelId }) => {
    const [studentData, setStudentData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch();


    const fetchAllAssignedStudents = async (_hostelId) => {
        setIsLoading(true);
        await
            axiosServices
                .get(`/adminx/getAllHostelAssignments/${_hostelId}`)
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

    useEffect(() => {
        fetchAllAssignedStudents(hostelId);
    }, [hostelId])


        function createData(first_name, last_name, contact, email, created_at, roomNo) {
        return { first_name, last_name, contact, email, created_at, roomNo };
    }


    const rows = studentData?.map((item) => {
        const { User } = item;
        return createData(
            User.first_name,
            User.last_name,
            User.contact,
            User.email,
            User.created_at,
            User.roomNo
        );
    });
    return (
        <>
            <AssignedList title="Assigned Students" studentData={studentData} />
        </>
    )
}

export default AssignedStudents;