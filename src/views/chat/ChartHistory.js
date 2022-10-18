import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useRef } from 'react';
import moment from 'moment/moment';
// material-ui
import { Card, CardContent, Grid, Typography } from '@mui/material';
import useAuth from 'hooks/useAuth';

// project imports
import { gridSpacing } from 'store/constant';

// ==============================|| CHAT MESSAGE HISTORY ||============================== //

const ChartHistory = ({ data, theme }) => {
    const user = JSON.parse(window.localStorage.getItem('user'));
    // scroll to bottom when new message is sent or received
    const wrapper = useRef(document.createElement('div'));
    const el = wrapper.current;
    const scrollToBottom = useCallback(() => {
        el.scrollIntoView(false);
    }, [el]);

    useEffect(() => {
        scrollToBottom();
    }, [data.length, scrollToBottom]);

    return (
        <Grid item xs={12}>
            <Grid container spacing={gridSpacing} ref={wrapper}>
                {data.map((history, index) => (
                    <React.Fragment key={index}>
                        <Grid item xs={12}>
                            <Grid container spacing={gridSpacing}>
                                <Grid item xs={12} sm={4}>
                                    <Card
                                        sx={{
                                            display: 'inline-block',
                                            float: 'left',
                                            background:
                                                theme.palette.mode === 'dark' ? theme.palette.dark[900] : theme.palette.secondary.light
                                        }}
                                    >
                                        <CardContent sx={{ p: 1, pb: '16px !important' }}>
                                            <Grid container>
                                                <Grid item xs={12}>
                                                    {user.id && history.UserInfo.id && user.id === history.UserInfo.id ? (
                                                        <>
                                                            {' '}
                                                            <Typography color="red" variant="button">
                                                                @{history.UserInfo.first_name}
                                                            </Typography>{' '}
                                                        </>
                                                    ) : (
                                                        <>
                                                            {' '}
                                                            <Typography variant="button">
                                                                @{history && history.UserInfo?.first_name}
                                                            </Typography>
                                                        </>
                                                    )}
                                                    {' : '}
                                                    <Typography variant="body3">{history?.text}</Typography>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Typography align="left" variant="subtitle2">
                                                        {moment(history?.created_at).format('LLL')}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Grid>
                    </React.Fragment>
                ))}
            </Grid>
        </Grid>
    );
};

ChartHistory.propTypes = {
    theme: PropTypes.object,
    data: PropTypes.array
};

export default ChartHistory;
