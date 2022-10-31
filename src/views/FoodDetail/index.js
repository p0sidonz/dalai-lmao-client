/* eslint-disable */
// material-ui
import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { openSnackbar } from 'store/slices/snackbar';

import { Typography, Card, CardMedia, CardContent, Grid, CardActions, Stack, Rating, Button } from '@mui/material';
import SubCard from 'ui-component/cards/SubCard';
import ShowLoader from 'ui-component/custom/Loader';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import useAuth from 'hooks/useAuth';
import Card3 from '../../assets/images/cards/card-3.jpg';
import axiosServices from 'utils/axios';
import FoodList from 'views/foodList';
// assets
import StarTwoToneIcon from '@mui/icons-material/StarTwoTone';
import StarBorderTwoToneIcon from '@mui/icons-material/StarBorderTwoTone';
import RateReviewTwoToneIcon from '@mui/icons-material/RateReviewTwoTone';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// ==============================|| SAMPLE PAGE ||============================== //

const FoodDetail = () => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(Boolean(false));

    const { id } = useParams();
    const { isLoggedIn } = useAuth();
    const user = JSON.parse(window.localStorage.getItem('user'));
    const theme = useTheme();
    const [fooddetail, setFooddetail] = useState([]);
    const [localReviewValue, setLocalReviewValue] = useState(0);
    const [reviews, setReviews] = useState([]);
    const [isDone, setIsDone] = useState(false);
    const [isDoneGreyed, setIsDoneGreyed] = useState({});

    const cardStyle = {
        background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.grey[50],
        border: '0px solid',
        borderColor: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.grey[100]
    };

    // const checkifAleradyDone = async () => {
    //     if (reviews.length >= 0) {
    //         Promise.all(
    //             reviews.map((item, index) => {
    //                 console.log(item.user_id === user.id);
    //                 if (item.user_id === user.id) {
    //                     console.log('inspide', item);
    //                     setIsDoneGreyed({ isDone: true, point: item.point });
    //                 }
    //                 if (item.user_id !== user.id) {
    //                     console.log('outside');
    //                     setIsDoneGreyed({ isDone: false, point: 0 });
    //                 }
    //             })
    //         );
    //     }
    // };

    // function reviewCheckIfNotDone() {
    //     if (reviews.isReview) {
    //         calculateRating();
    //     } else {
    //         return null;
    //     }
    // }

    function calculateRating() {
        if (reviews.length !== '0') {
            const data = reviews.reduce((n, { point }) => n + point, 0);

            return data / reviews.length;
        }
        return 0;
    }

    async function fetchTheData() {
        setIsLoading(true);
        await axiosServices
            .get(`/foodlist/detail/${parseInt(id)}`)
            .then(async (r) => {
                setFooddetail([{ ...r.data.data }]);
                setReviews(r.data.data.Reviews);
                setIsDoneGreyed(r.data.reviewData);
                setIsLoading(false);
            })
            .catch((err) => {
                setIsLoading(false);
            });
    }

    function giveRating(event) {
        const ratingValue = event.target.value;

        if (!isDone) {
            axiosServices
                .post('/review/add', {
                    point: parseInt(ratingValue),
                    foodlist_id: parseInt(id)
                })
                .then((r) => {
                    dispatch(
                        openSnackbar({
                            open: true,
                            message: 'Voted',
                            variant: 'alert',
                            alert: {
                                color: 'success'
                            },
                            close: true
                        })
                    );

                    fetchTheData();
                })
                .catch((error) => {
                    dispatch(
                        openSnackbar({
                            open: true,
                            message: 'You have already voted',
                            variant: 'alert',
                            alert: {
                                color: 'error'
                            },
                            close: true
                        })
                    );
                });
        } else {
            console.log('you have already done');
        }
    }

    useEffect(() => {
        fetchTheData();

        return () => {
            console.log('this iwas ');
        };
    }, []);

    return (
        <>
            <ShowLoader isLoading={isLoading} />

            <Grid item xs={12} lg={4}>
                {fooddetail.length > 0 ? (
                    <>
                        {fooddetail.map((item, index) => {
                            const x = null;
                            return (
                                <Card sx={cardStyle} key={index}>
                                    <CardMedia component="img" image={item.FoodDetail.image} title="Card 1" />
                                    <CardContent>
                                        <Grid container spacing={1}>
                                            <Grid item>
                                                <Typography variant="subtitle1">{item.FoodDetail.name}</Typography>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            );
                        })}

                        <MainCard content={false} sx={{ height: '100%', padding: 1, marginTop: 1, marginBotton: 2 }}>
                            <CardContent sx={{ height: '100%' }}>
                                <Stack alignItems="center" justifyContent="center" spacing={2} sx={{ height: '100%' }}>
                                    <Typography variant="subtitle1">Average Rating</Typography>
                                    <Typography variant="h1" color="primary">
                                        {!calculateRating() ? <>0</> : calculateRating()}
                                        /5
                                    </Typography>
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        <Rating
                                            style={{ pointerEvents: 'fill' }}
                                            name="simple-controlled"
                                            value={isDoneGreyed?.point ? isDoneGreyed.point : 0}
                                            disabled={Boolean(isDoneGreyed?.point)}
                                            icon={<StarTwoToneIcon fontSize="inherit" />}
                                            emptyIcon={<StarBorderTwoToneIcon fontSize="inherit" />}
                                            onChange={(event, newValue) => {
                                                giveRating(event, newValue);
                                            }}
                                            precision={1}
                                        />
                                        <Typography variant="caption">{reviews.length}</Typography>
                                    </Stack>

                                    {isDone ? (
                                        <Typography sx={{ fontSize: 8 }} variant="caption">
                                            <CheckCircleIcon sx={{ fontSize: 8 }} /> You have already casted your vote
                                        </Typography>
                                    ) : (
                                        <> </>
                                    )}
                                </Stack>
                            </CardContent>
                        </MainCard>
                    </>
                ) : (
                    <> Something is fishy!</>
                )}
            </Grid>
        </>
    );
};

export default FoodDetail;
