// material-ui
import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { Typography, Card, CardMedia, CardContent, Grid, CardActions, Link } from '@mui/material';
import SubCard from 'ui-component/cards/SubCard';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import useAuth from 'hooks/useAuth';
import Card3 from '../../assets/images/cards/card-3.jpg';
import axiosServices from 'utils/axios';
import FoodList from 'views/foodList';
import ShowLoader from 'ui-component/custom/Loader';

// ==============================|| SAMPLE PAGE ||============================== //

const UniversityMenu = () => {
    const { isLoggedIn, user } = useAuth();
    const [isLoading, setIsLoading] = useState(Boolean(false));

    const theme = useTheme();
    const [menuItems, setMenuItems] = useState([]);
    const cardStyle = {
        background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.grey[50],
        border: '0px solid',
        borderColor: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.grey[100]
    };

    useEffect(() => {
        setIsLoading(true);
        axiosServices
            .get(`/university-menu/`)
            .then((r) => {
                setMenuItems(r.data.universityInfo.UniversityMenu);
                setIsLoading(false);
            })
            .catch((err) => {
                setIsLoading(false);
            });
        return () => {
            setIsLoading(false);
        };
    }, []);

    return (
        <>
            <ShowLoader isLoading={isLoading} />

            <Grid item xs={12} lg={4} sx={{ paddingBottom: 5 }}>
                {/* <Card sx={cardStyle}>
                    <CardMedia
                        image="https://post.healthline.com/wp-content/uploads/2021/10/fruit-salad-best-breakfast-foods-1296x728-body.jpg"
                        title="Card 3"
                    >
                        <CardContent sx={{ maxHeight: 150, color: theme.palette.common.white, backdropFilter: 'blur(3px)' }}>
                            <Grid container spacing={1}>
                                <Grid item>
                                    <Typography variant="h4" color="inherit">
                                        Special title
                                    </Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </CardMedia>
                </Card> */}

                {menuItems.length > 0 ? (
                    <>
                        {menuItems.map((item, index) => {
                            const x = null;
                            return (
                                <Card key={index} sx={(cardStyle, { margin: 1 })}>
                                    <Link color="inherit" href={`/foodlist/${item.id}`} underline="none">
                                        <CardMedia
                                            image={
                                                item.image
                                                    ? item.image
                                                    : 'https://post.healthline.com/wp-content/uploads/2021/10/fruit-salad-best-breakfast-foods-1296x728-body.jpg'
                                            }
                                            title={item.name}
                                        >
                                            <CardContent
                                                sx={{ maxHeight: 150, color: theme.palette.common.white, backdropFilter: 'blur(3px)' }}
                                            >
                                                <Grid container spacing={1}>
                                                    <Grid item>
                                                        <Typography
                                                            variant="h3"
                                                            color="inherit"
                                                            align="center"
                                                            sx={{ textShadow: '0 0 3px #000000, 0 0 5px #000000' }}
                                                        >
                                                            {item.name.toUpperCase()}
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
                                    </Link>
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
