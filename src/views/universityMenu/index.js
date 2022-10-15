// material-ui
import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { Typography, Card, CardMedia, CardContent, Grid, CardActions } from '@mui/material';
import SubCard from 'ui-component/cards/SubCard';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import useAuth from 'hooks/useAuth';
import Card3 from '../../assets/images/cards/card-3.jpg';
import axiosServices from 'utils/axios';
import FoodList from 'views/foodList';

// ==============================|| SAMPLE PAGE ||============================== //

const UniversityMenu = () => {
    const { isLoggedIn, user } = useAuth();
    const theme = useTheme();
    const [menuItems, setMenuItems] = useState([]);
    const cardStyle = {
        background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.grey[50],
        border: '0px solid',
        borderColor: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.grey[100]
    };

    useEffect(() => {
        axiosServices
            .get(`/university-menu/`)
            .then((r) => {
                setMenuItems(r.data.universityInfo.UniversityMenu);
            })
            .catch((err) => {
                console.log(err);
            });
        return () => {
            console.log('this iwas ');
        };
    }, []);

    return (
        <>
            <Grid item xs={12} lg={4}>
                {menuItems.length > 0 ? (
                    <>
                        {menuItems.map((item, index) => {
                            const x = null;
                            return (
                                <Card key={index} sx={(cardStyle, { margin: 1 })}>
                                    <RouterLink to={`/foodlist/${item.id}`}>
                                        <CardMedia
                                            image="https://post.healthline.com/wp-content/uploads/2021/10/fruit-salad-best-breakfast-foods-1296x728-body.jpg"
                                            title={item.name}
                                        >
                                            <CardContent
                                                sx={{ maxHeight: 100, color: theme.palette.common.white, backdropFilter: 'blur(3px)' }}
                                            >
                                                <Grid container spacing={1}>
                                                    <Grid item>
                                                        <Typography variant="h3" color="inherit">
                                                            {item.name}
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            </CardContent>
                                            <CardActions sx={{ backdropFilter: 'blur(3px)' }}>
                                                <Grid container>
                                                    <Grid item />
                                                </Grid>
                                            </CardActions>
                                        </CardMedia>
                                    </RouterLink>
                                </Card>
                            );
                        })}
                    </>
                ) : (
                    <> No Menu Items found</>
                )}
            </Grid>
        </>
        // <MainCard content={false}>
        //     <Typography variant="paragraph">{JSON.stringify(user)}</Typography>
        // </MainCard>
    );
};

export default UniversityMenu;
