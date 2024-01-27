/* eslint-disable */

import PropTypes from 'prop-types';

// material-ui
import { Button, CardActions, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import moment from 'moment/moment';

// =========================|| DATA WIDGET - APPLICATION SALES CARD ||========================= //



const AssignedList = ({ title, studentData }) => {
    // table data for student

    function createData(first_name, last_name, contact, email, roomNo,created_at ) {
        return { first_name, last_name, contact, email, roomNo,created_at };
    }


    const rows = studentData?.map((item) => {
        const { User } = item;
        return createData(
            User.first_name,
            User.last_name,
            User.contact,
            User.email,
            User.roomNo,
            User.created_at,
        );
    });


    return (


        <MainCard>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ pl: 3 }}>Name</TableCell>
                            <TableCell align="right">Contact</TableCell>
                            <TableCell align="right">Email</TableCell>
                            <TableCell align="right">Room No.</TableCell>
                            <TableCell align="right" sx={{ pr: 3 }}>
                                Joined Date
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, index) => (
                            <TableRow hover key={index}>
                                <TableCell sx={{ pl: 3 }}>
                                    <Typography align="left" component="div" variant="subtitle1">
                                        {row.first_name}
                                    </Typography>
                                    <Typography align="left" component="div" variant="subtitle2">
                                        {row.last_name}
                                    </Typography>
                                </TableCell>
                                <TableCell align="right">{row.contact || "-"}</TableCell>
                                <TableCell align="right">{row.email}</TableCell>
                                <TableCell align="right">{row.roomNo}</TableCell>

                                <TableCell align="right">
                                    {moment(row.created_at).format('LLL')}
                                </TableCell>

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Divider />
            {/* <CardActions sx={{ justifyContent: 'flex-end' }}>
                <Button variant="text" size="small">
                    View all Projects
                </Button>
            </CardActions> */}
        </MainCard>
    );
}





export default AssignedList;
