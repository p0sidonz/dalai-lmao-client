// material-ui
import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

import dayjs from 'dayjs';

import { Typography, Card, CardMedia, CardContent, Grid, CardActions, CardMe } from '@mui/material';
import SubCard from 'ui-component/cards/SubCard';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import useAuth from 'hooks/useAuth';
import Card3 from '../../assets/images/cards/card-3.jpg';
import axiosServices from 'utils/axios';
import ShowLoader from 'ui-component/custom/Loader';

const Today = dayjs(Date.now()).toISOString();

const FoodList = () => {
    const { id } = useParams();
    console.log(id);
    const [dateValue, setDateValue] = useState(Today);
    const [isLoading, setIsLoading] = useState(Boolean(false));

    const { isLoggedIn, user, userId } = useAuth();
    const theme = useTheme();
    const [foodItems, setFoodItems] = useState([]);
    const cardStyle = {
        background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.grey[50],
        border: '0px solid',
        borderColor: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.grey[100],
        margin: 0.5
    };

    const handleFoodChange = (newValue) => {
        setDateValue(dayjs(newValue).toISOString());
    };

    useEffect(() => {
        setIsLoading(true);

        axiosServices
            .get(`/foodlist/${id}/${dateValue}`)
            .then((r) => {
                setFoodItems(r.data);
                setIsLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setIsLoading(false);
            });
        return () => {
            console.log('this iwas ');
            setIsLoading(false);
        };
    }, []);

    return (
        <>
            <ShowLoader isLoading={isLoading} />

            <Grid container direction="row" justifyContent="space-between" alignItems="center" sx={{ paddingBottom: 6 }}>
                {foodItems.length > 0 ? (
                    <>
                        {foodItems.map((item, index) => {
                            const x = null;
                            return (
                                <Grid item lg={12} xs={6}>
                                    <MainCard
                                        content={false}
                                        boxShadow
                                        sx={{
                                            '&:hover': {
                                                transform: 'scale3d(1.02, 1.02, 1)',
                                                transition: 'all .4s ease-in-out'
                                            },
                                            margin: 1
                                        }}
                                    >
                                        <CardMedia
                                            sx={{ height: 220 }}
                                            image="https://berrydashboard.io/static/media/prod-7.4fef88dc.jpg"
                                            title="Contemplative Reptile"
                                            component={Link}
                                            to={`/foodlist/detail/${item.id}`}
                                        />
                                        <CardContent sx={{ p: 2 }}>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12}>
                                                    <Typography
                                                        component={Link}
                                                        to={`/foodlist/detail/${item.id}`}
                                                        variant="subtitle1"
                                                        sx={{ textDecoration: 'none' }}
                                                    >
                                                        {item.FoodDetail.name}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </MainCard>
                                </Grid>
                            );
                        })}
                    </>
                ) : (
                    <>{`Your Food Instutions hasn't added any items yet`}</>
                )}
            </Grid>
        </>
    );
};

export default FoodList;
