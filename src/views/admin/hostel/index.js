/* eslint-disable */
import React, { useEffect, useState } from 'react'
import { Grid, Divider } from "@mui/material"
import RevenueCard from "ui-component/cards/RevenueCard"
import { gridSpacing } from 'store/constant';
import ApartmentIcon from '@mui/icons-material/Apartment';
import PersonIcon from '@mui/icons-material/Person';
import { useTheme } from '@mui/material/styles';
import BallotIcon from '@mui/icons-material/Ballot';
import PeopleIcon from '@mui/icons-material/People';
import { useParams, Link } from 'react-router-dom';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import axiosServices from 'utils/axios';
import LocalDrinkIcon from '@mui/icons-material/LocalDrink';
import useWater from './useWater';

const HostelMain = () => {

    const { averages, isLoading } = useWater()
    const [count, setCounts] = React.useState();
    const theme = useTheme();

    const fetchCounts = async () => {
        await axiosServices.get('/adminx/getStatusCountofAll').then((res) => {
            console.log(res.data)
            setCounts(res.data)
        }).catch((err) => {
            console.log(err)
        })
    }
    useEffect(() => { fetchCounts() }, [])

    return (
        <Grid container spacing={gridSpacing} sx={{ mb: 6 }}>
            <Grid item xs={12} lg={12} md={6}>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12} lg={6}>
                        <Link to="/hostel/list" style={{ textDecoration: 'none' }}>
                            <RevenueCard
                                primary="Hostels"
                                secondary={count?.hostelCount || 0}
                                content="View and manage all the hostel releated task"
                                iconPrimary={ApartmentIcon}
                                color={theme.palette.secondary.main}
                            />
                        </Link>
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <Link to="/worker/list" style={{ textDecoration: 'none' }}>
                            <RevenueCard
                                primary="Workers"
                                secondary={count?.workerCount || 0}
                                content="View and manage all the Workers releated task"
                                iconPrimary={PersonIcon}
                                color={theme.palette.primary.main}
                            />
                        </Link>
                    </Grid>

                    <Grid item xs={12} lg={6}>
                        <Link to="/polling/list" style={{ textDecoration: 'none' }}>
                            <RevenueCard
                                primary="Polling"
                                secondary={count?.pollingCount || 0}
                                content="View and manage all the Polling releated task"
                                iconPrimary={BallotIcon}
                                color={theme.palette.primary[800]
                                }
                            />
                        </Link>
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <Link to="/student/list" style={{ textDecoration: 'none' }}>
                            <RevenueCard
                                primary="Students"
                                secondary={count?.studentCount || 0}
                                content="View and manage all the Students"
                                iconPrimary={PeopleIcon}
                                color={theme.palette.info.main}
                            />
                        </Link>
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <Link to="/service/list" style={{ textDecoration: 'none' }}>
                            <RevenueCard
                                primary="Services"
                                secondary={count?.serviceCount || 0}
                                content="create and manage all the Services"
                                iconPrimary={PeopleIcon}
                                color={theme.palette.error.main}
                            />
                        </Link>
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <Link to="/service-requested/list" style={{ textDecoration: 'none' }}>
                            <RevenueCard
                                primary="Compaint"
                                secondary={count?.complaintCount || 0}
                                content="Manage all the complaints"
                                iconPrimary={AppRegistrationIcon}
                                color={theme.palette.secondary.main}
                            />
                        </Link>
                    </Grid>
                    {/* <Grid item xs={12} lg={6}>
                        <RevenueCard
                            primary="Water Quality"
                            secondary={`Today: ${averages.today} | Week: ${averages.week} | Month: ${averages.month}`}
                            content="(0 to 100 scale)"
                            iconPrimary={LocalDrinkIcon}
                            color={theme.palette.info.main}
                        />
                    </Grid> */}
                    
                    <Grid item xs={12} lg={6}>
                    <Link to="/water-coolers/list" style={{ textDecoration: 'none' }}>
                        <RevenueCard
                            primary="Water Coolers"
                            secondary={`Manage Water coolers`}
                            content="Manage Water coolers"
                            iconPrimary={LocalDrinkIcon}
                            color={theme.palette.info.main}
                        />
                         </Link>
                    </Grid>
                </Grid>
                <Divider />
                <Divider />

                <Divider />

            </Grid>
        </Grid>
    )
}

export default HostelMain