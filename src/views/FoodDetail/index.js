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
    const { isLoggedIn, user } = useAuth();
    const theme = useTheme();
    const [fooddetail, setFooddetail] = useState([]);
    const [localReviewValue, setLocalReviewValue] = useState(0);
    const [reviews, setReviews] = useState([]);
    const [isDone, setIsDone] = useState(false);
    const cardStyle = {
        background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.grey[50],
        border: '0px solid',
        borderColor: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.grey[100]
    };

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
            .then((r) => {
                setFooddetail([{ ...r.data }]);
                setReviews(r.data.Reviews);
                setIsLoading(false);
            })
            .catch((err) => {
                setIsLoading(false);
                console.log(err);
            });
    }

    function giveRating(event) {
        const ratingValue = event.target.value;

        console.log({ user_id: parseInt(user.id), point: parseInt(ratingValue), foodlist_id: parseInt(id) });
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

    const checkifAleradyDone = () => {
        if (reviews.length > 0) {
            reviews.map((item, index) => {
                if (item.user_id === user.id) {
                    setIsDone(true);
                } else {
                    setIsDone(false);
                }
            });
        }
    };
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
                                    <CardMedia
                                        component="img"
                                        image="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoGBxQUExYUFBQYGBYWGhwbGhoZGx0fHxwfGhkcHRwfGhwdICsiHBwoHxoZJDQjKCwuMTExGSI3PDcwOyswMS4BCwsLDw4PHRERHDApIik2MDA5MDEyMDAwMDAzMDAwMjAyMDAwMjAwMDIwMjAwMDAwMDAyMDAwMDAwMjAwMDAyMP/AABEIAOEA4QMBIgACEQEDEQH/xAAcAAABBQEBAQAAAAAAAAAAAAAEAgMFBgcAAQj/xAA+EAABAgMGAwUGBgIBAwUAAAABAhEAAyEEBRIxQVEiYXEGE4GRoTKxwdHh8AcUQlJi8SNykhVTghczQ6LC/8QAGgEAAgMBAQAAAAAAAAAAAAAAAwQBAgUABv/EADERAAICAQMCBAQGAQUAAAAAAAECABEDBBIhMVEFE0FhInGRoRQygbHB8NEjQlLh8f/aAAwDAQACEQMRAD8AucuUyc+nIbHxeAO0NgE+UUksULTMSR+koVnBciYzPlHqyHIJoaUhFTxGz1iLNPUE8UuoJDghi3UuILlrURUAUyz9YEVMUkJBQ5JAJBDO3MiHLPaCSxSRTX6ExagJEfI1j1xA0+ezc44zYjidPbRLBd+UCKlgQu0Tjo3pDSlEZkQNqhFudaZCWxAVaAjZQdD6QVPnlhUQKq08/Q/OIsSwuM2mxAgeX3SAV3enaDptpLBzmf2/WGJk86gjqlMFEizIe2XcKj5RCz7IAT9It5uu0zQSiUojchA8naIS1XPau8wdxMc5f46f8mb1ixxt2P0lRkX/AJD6yFTLr/UXH8NL/MmYZClcCi6X0URUeMR57GW9sXdA/wAcSH8niEtNnmyVtMCpawxGJOEuNQ/hURZQ2NrIkNsyqVBE3+Tawo5aluYhwLcvRsh15xmXZn8QZbJRaThUGHeD2T/s3s+6L/d1pSahTpVV3odjD4CsLU3M34sbAMIq9JagMSfECPbHa8SXBYjQ+6CzPSRiFQM4anWUOFJGef3pASCDHVyKy0frHhaBlCsYhpcsE9IQqQN/WJ5iLMQTHVKS7OHhsgbiB0oSotUNvl5wXKkBOoi/I6yFYmNmQI5FnYuKQVhgS8LRgAapBFGz3itbuIQnaLilSuTdMvpHol8xBEuYDrXUbQ5CraYXxLgwHuOcdB8dFfww7yblHs5AjrQplCB5CjR948tKuJt6/flFABUavmOlZID+/lCwNizbB/OBVzQANm36v8IdRaAz8t4ni50amrU9UuRrkOseomEn5PDE+1V+ohqXaWJ+kRxJ5hM9IZ6/ZhDpaD7pumZPNcSJeqt+SN+uUWey3DIls0sEjVXEfWJGItzKnKF4lVs1zqmAEjCnQkZjlBR7PpH6zFvWQBXIRVu0faaRJowJ3Hup74I2TT4QA/X6k/pBBdRlPwGOXbdkuXUJc7mpg6dJB9rwEVBfbOUUnAlT0IJJDfOIq1dsZhViEAyeKqKGJD+1RrB4VlYlsp+sv1qmplpBxcJdiRs3zgSzWkTKpcgVPLrGd3p2lnLDYikPp6wzdt/zpJdKzUNFk8VcCyslvBbPDVNRM7hKgCw+36c4GVOTMSfZUA7pNcs2ehaKEvtXOUClwEkEEimZrl4wTdvasoL92l9/PIZZnSJHi5o7ko/WUbwRxyrXL/ZrIlSSnAltUqSGIPJmMBWKQiWcMtJQn9mg6D9I5ZRB2PtspawFkBNSM88mLHLPOJ2zXtZyvHjctUEODlXwA9Yvj8Yw7jvBHaLZfDM6ihzJJCqGueYh2zzVlwCcIFfkICnzZS5f+N8VAlsy51HifKGkKVKbE6SefyjSxZMeddyEGIsj4mpxJqSE4aE+OYj1VnIdiwLVJJPlAtmvBJFQ598Kl3gFcJOHQPX+orscS5bGRxCJtncpc0Gex2pvDduQThSkEVqRk3xjyzpXjFSQ2Z+Dct4NmAkEZH72ipJBE4KGBiJFqCsgfEQ4tDhjkYAlSZkvIBT5lz7jB6S8QwAPEupvrEIs6QXAY++HnjwwmK8nrLAV0injoS0dHVOuZsmYQzAneo+JhqbaC4UoFPXPoWygP82xzEItFrc1UP7hEdI/XMkJ02mdPs/OB0zmo/rDEyfQcQb5x7d9nVPmplS2KlHwAGZPJo4qCZINCJtFprn657NF87I9nRLQJs5LzVVZVcA0A/luebQTcnZSRIZTd5MH611Y/wARkn384mpkwDOChAnxNF3fdwJ68Rl737Lkiqg8Vrtb22EtRly2JGvOM8vG9lzCVLUaxnZ9a72mLgd/8R/TeH3T5OB2lu7TdtJikgS6JU4elTyipW62Y0VSxZya1fr5eERCLUUrCgtmdjnUB8sw+TjfPOHpdvJBHd6+1Wg924rvABp6AJNnuZpJsx/CooQuzTJhTSoOjAksXFDUhx6R6bIQlKndJ4niMl2t5gdg7ijgPuWz1Dc4mbNbGQtJRixGjGicqh/GkS6EAcy6uTI60JOI7OcsjpTQiFgkDiGccElmLgPl7oTMlrKQpiU5Pty5axHXiEuKQonhdn1Po1M4Ktdj7uXLmFblZIAFGw7akVzprAKZujP05Z/Dzh22A8KVOCQCH2qB8Ynae0FvG6gee09QGID6jR+bttBsxcxCQoKPECKGpGrjSBTaWSpKk4lqbiOnT0hUy1E4QtTpSGDMKOTQtudYoVEICZLXJ2hmyiGJLU59PpFok9tEzUd2rhfUgFvOKFMngg4U5ZMOXvhviQAohgedfTLxiqb0bchIP99IHLp8WUEMJfbPeJBZTpqWJyNaEHKsTdhtWLmNScvOM8sF9zJdMSsO3SJaw30Flpk5eJ6EoDdAytH2j0Wj8T84jHkFHv3nm9Z4W+nG9TYl9/6h3ZDcSTl8W58omLPMCgFDWKTZFFacJKJqD+nX/ipi/SG7wsapDTZBKE5EEqBSee6Tzg+qBQbgLH3i+mpztJo/aX1UegRRZXaG1MR3iORKa+6FS+0FrB/9xCuqPk0Ifik947+Ff2l1VHJEVyzdop1MSEHpiHveH5t6TVZYU9KnzMX/ABKVxKfh3vmT7R0Vv85O/wC5HRX8SvaW/Dn2mZItgMeWm1ZaeMB1Bok/8YVMK1GgNP4gQC4yRCZ9r4BXTeL3+GNyrQFz5oIUsBKQcwnNzsSWpyEV/sDdXfTsawSmWAzgMVk0pyAJ6tGqSJYSGEM40FbjFsuTnYP1ipigA5yEZ9217YkBUuWWq2e8SvbvtGJUtUtB4jQl8uUYzedvxFRJcxm6jIdQ+xD8I6+57TR0WmCr5mQfKP2i2qUoFRKcWRINcxpm7EQNabcVUAHCKtTPeGkCZPCcZIlpASCdhon1g2WiUGTsQQkjMgMCrn84t5ap6RsuzdJ13y64sKSd1AkHSgp1zgmz2ErJFc+QA2Ya1hyySSUqbMAmmQYZRL3PKRgExQAKSxDl1agBhnn5QHK5Al0T1MbRdCJb4gVKAPDhoSSzE6N8YZstmBJSwo7nIf3E9bU8J4SAKq11qCdT4+UQ91jFNKQC225fru/SFFyFwYZO8Js1kStWEKOGhLts1Bqwga97qWkOksCXYbgEPyz9YsUmzBglKMJzcj4/DKJizXeTLUcwNWHSlGgJyMr/AA8ymTKqjmZlLARwTEqCv1OHFdaOaiDb8wps8ohQJBDauAFB6dddXiT7cSpiEImEJCU8ANApW4UM6MAG0fxodqtpbCAKklxmXGXT6xqpbgTPGlQZBlUnqeOvMKmWwEbmFyQosRSu9T0hVjsNQCw9lz4fZd9YnbvuxyMDlvMh38NIDlZcYmihvrIhSJktg1H8vCH561LGI5huTtTKL/ZezPeIGNIAI8X+/dFYvO5u6mMr2ah/fC4zX1FfzOTKjNtB5kFLHD6+sOy5hIPlXQnXrBF42fuwwTRVQovlqxyMBWdCqD7aCWCLhCNwoyw2W9k4gMgQAK1dnLcosl33qopKJgxoIYpVtyOYihzJQcB/EZjrExYLUtCQFVGQWBTx2Mb/AIdr0yKMGXr6E+s814j4e+Njlx9Pb0lwnXOgoC5ZJSGBBNU+Oo5w2m707Zc/pCezt4OcJyND4xKzHBIY05esU1ukXE9r0MrpNUzrTdRBJVkH3/UGGQIQmYwyV5fWHpcxxkR1hRVEaLGNflxuY9h7H90jyJ2iV3GZMgpIgiRZ+8mIlpcFagkV/cWc18YYkjX5xN9lbCZlpQRkgYjnq4HiSfQ7RfGoZgveRkfapbtNF7P3QiTKSlAy8ydzzgi/7wEmSpZzanWDZNExm/4kXySvuwaJpE6/OUTavU8D2gtBp/OyC/mZS+0l6mYokmKvPnEEEZggjI1BfI0MSloq8RtokkmkJ6ZQgAE3tT2EIlz1FWEK7wuQFB2IBzGIAsS5qBnEkJQIGNhMUXyoRWvQM2mcCXSgCSo1C3oWfLTpEhIUokd4MhRTUYgtUeMXyOLNQeNCQI5Z8QxDC2Jk5ZgmjczlE5cqXAwGqQCp8uItTwPrygOTZQeEFWYoc9S4P3nEpYV9ylZWHISw2xHLxGfhCOXJu4jNUOIWuzqWUJUSEkFsIGmfw5w9YLtKS+FKiTU69C+1ctYcsM7vEKGLiUNWABr44dImbps6s1DCWcNo2fV3JhMMy9IHJk2A3HLJZCVElOYfFq+x9fKJS7g1NGypnAK7TgI3OnJ9Y8F4BDk1wgqIFaAfI+kVRiXU+t8/rM/IruJn34rTh36ZSHIAxHkVfQesUyXZVoUlUwEO+FwNKU55dIlu1drXOnLnPV/Z2CaANkWiLm2qapDKKe7Cm0d2FQ9WrpzyjbwqdtCN1tAUyXs5BAqcTV55ZfQRY+zU5XeJZgNSR99Yp9htRYEDJg2uTP4tE7Z71ZRKRlVuQyd89IU1OMtYqMD8s1WRaAlLqUkDRy0VLtJ2oRMKpSZSSl2xHMkapbxrEHZL1nWpxiZAUkFLsA/MDVia6NCbdZky5mFJcvuDk2bNRj6RXkLtI4EWxaVVfc3XtJBKMSO7Wh5Z3FRRwXzeufhELNuObKOIEECofUfJjFisTFKfaBYuS7E6tzZvMxNz7AEyFLwAgB0v5KSddyNiAYAp2tV8esYfKErjr95nk+SSnvMmIBej/wCu7fEQTcF5d2sA+ydDlCb4klTTQkJC8kh9DVnz91YjZaiHbKkGoEcRgfEKaaSbqC0idZ2BzKN/9djyiQumd3qSkuFp86aGK/2CvJzhJp8YuX5MFYmJosf/AG6x6HR6r8RgKZOo4/7nlNZpTp81pI+bKJ/UfKEpsxIbEaF3h+1rKSQQBs8IkWkF3I8vrCZUA0YyGJFiJ/LK/wC4fIR0O/mEb+kdHbR3nW0yyS7fX6RpvYi70os6F0xL4yf9k8I8B8YzWSzZj1jVex8s/lkAhuBLf8aehhjTAWTAaonaB3MPve8BJkqmHQU5nT1jFL6vHvZiln9R+MaJ+J9qwWdKaBzk+fOMyRYnIC1MSHYuGJUwBcMC1XyY5xn6pvMzHsOJq+GIExbvU/xA1JcOPHr8soGtNnoOYiVVhBINWyUOXLWB5u3KAq5BjzC4m4FJ4pS2AVUHYxIyJyQky3FWKchvrtU+JiFm2ZTqYHgZyxo+T+RhqdaSzKS+gL0gjJvMCAQTLXdJKzilh+7qdmGZfq2W8SkuehSAFEpdT5Uap8Ro3KKjct7TJWIJBwrZ6OzbeZHiYmp94BSFKASliSVOzPph0I5BqQrkwc8Q9jqZJpvIY0IQXzy0arMHbpFnk3qnVmw0OpYjn05xlCb5SleIZsxADOd+Rg+xdoMA4kqUA+ByxBPR6ZUr6xB0hPT7weRUeXW9L/SUHCFBYIpnR6/3u0R/aS+CJUtKVoT3hKhhfEACQMWwFU+B2ioPPnrKyEoc1OQD6ADKPJ13T5aqpKn6t5xfHiVDyRdTtigDaILNWuYo4XLvz6t4n1gFU8oSpBeoY11Begag3zyeLBIspSSVgVObZHYjyiNvOylLKcHUKAZ984Zx5BdTsmMnmNXXMBIrWmnqfvWJhMr9SSQRn7orkkEEqB+zEjZpyyoKd9SDqY7KnqDLY+RLFccoqmcDpLuQMiQM2r1fSC73kjvmR7bh8JLPqX0rVucO2S3JAQQnCsA4stfjnTbxgIyJnf4kBTLNDqTy2MIlhuqFokyw2ebiPdEBwEupvCgrxNV/6izWeaFyDLNVJOEtq1XirTrsWO7LYSmpSoMXoxNKmnrFou2xKlMSakE1pUgAD+4gsG4HXp34P8xHUbaBv3HzErd6qkSwlC5ZKyDhQnZ2KuT8RDnJMUm2zQZiylOEFRZLuwegesTfbWeRawSXUlMvEOYDkHnnELPmY52LClAURQZD5ZesNEBRtoce3MYwggBu/MPue1mXMBTSsarc1qK5aVHM5xka5eGoIjQuxF5Y5eAmqfjFtDk2ZwL4Ir9Yt4lj3494HSWK+ZYKUlq1D/fSIyUA+UTakY0FOuh2OkQWIg1YHxjSzLTXMrCbWovuuZ+/CPY7vk7+n1joFcJRmaWABSkD9JUkE8ioA67GNgsCsIoGGoHvHLlGR3HIxTZaN5ifIKc+gjYLAAUNsGMNYBWMmKak/wCoomefinbAtYSzYAz7xRELchGX8i9ABV2ckUpFs7drPfKDuQxp5ggxVZE5aSoDIgAgkAHbPUEv66RiY2LMxPqTPSIgTEoXsIfe0oIQgd3hdyC9VJoQ4ORYiuukR65iGauT06e6HLQlSm71RGhJ0HxFdDBV2y/ZC00S7KcEEHPp0PwgiYwYDUanyALF37yPsy1JxJoy2J3oHHk58zHlplBnZ2Yw9YilBWCSCxCVUIIGQD5YqV08YXfU/FhPCOEAhL7AurR1OTnpEnkw4PtBVXysIwJSlmZ9RuaZxG2y8VrJKlEnPICrAZCj0AePZqw4On36wHNSVqCUJJUdAM2DnyAPlDGNLiz0vSSFy3KqepJxVUdP0gFiVjOrgjesWu03GmQklS3LcIOb5V5Q3Z7XJsyQoEqUBglggB0pASFKbJ8JO5JgFVsmKZc3EVLAUFE0AqKJbl9vAsxLE10HE7CGsc8fvDrPZVEgINAHNNcjXN69IsF13diAxgkqatXDMKP84iLknAKBJzNdvLXWNAsKULSGZwKAZjp5Rl5mYNUazZPLWVy33UhIUwdqYnNfDeIiZdEsJVjJGEOkhzV6VGVYv9qsPApQGI7NTZxz+sVydd5Wk0BBFAN3cHplTmYojOp+L5ymHOHXrKNartSoM3F+58/Bqj1ziOsaClYScni8CQXC+7wgUYu27Ynd9jTMRF9sLGiVOCh+quDCUkCmRYPUkUyAjQx7mUwodQwEVZ1BMxIVwhqE8uUWa57cApgh+Z308DFNNsnTUzJploQmSEIIYinCE5vxHFuHCTSkOSe0UxHsgP5+kKZ9K4IoSbGVJpt537JlJQSAqYSGTqGcjPIP74irVeiphK1LKAliVJYsC5OF3FEpOYOZ5RRbTfOJMtaSrvQsqWo5aMNXyd/SEXhe8yahCHolyWpiJpiVuW+wIZxKQQW+g7xYaVVFDr3MYvi1Y50xSVEgqLKUzlqPTLLwpAiEk1rvD922YTFsWoxwkkYw7FjuMyIctlh7tCzUNMCUg7BAJPNyRBipPMk6vGjjF68T2yICgSVeyKAnPpFm7Czj39CwOkVOQzUfaLD2PtJl2hJPTzpC/RwexH7w+UXiYDsZrliEVq02fE/MnXm+0WKwzdIiLSkJWpOx55Go0jc1AurnnMBomCfl+nn9I6HO+HPyPyjoV2iM2Zn132ju5steiVA/P0jXruAVLcfqGYjGUo6842a6JARKQASXSH6tDWE/AVMVzr8at85lf4guLQoHz3zEVO0JxKqwy+VGi7fieB39csPSsUG0rJPuHR4xsa0SOxM38bXiU+05aj50j0z2ThSSBqHLEUOWUNrtC5hKiXKQ6idgQAT6CF3fd82cSEg01owJS9R0+9IZCVzKMVPWez55o7uB5dIGC1TCwdROwPrE6JMmUAFS+8WP3NtqK7GmYg655nek8CQlObCgY5U2gRybRYEJ14uVdd3zAQVAYetfIQxKSqVPlFJYqIAfZRw1Dt4PltGiJtFlcy5svA4qUkljuUmvhEN2wuKVMlBdnc4Q+EjjLahOqWaofXKJw6o7wGFQeTGCDV/xKyklYS5fCABT9ob4bwRJU3tElJHTp6vEfd9pD8Qc4iToC/IZRMIWlTuC1D5b7wXLYNQmLkQiXNMkgmoL69DmdaxcLivBsKn1y8Wbf76E0ecDhSqpANU1pp4RMXQCE4wBm7cx/YhPLjVhZhiLFGagJyyBgUSDUu1Gajtu0NXpJSlkF8SgpjStMj/UR902khJNSGoNw+vOgpBdoKpgQ44g+QOZ3rnCJokhuvp2H/szfLKP7St3jLKEEqqHckh+QD9BFY7Qyh3yHmhRUP3pJdJAAcZaM5OUW/tLYViQtQITxI4Rm6lCpGgqT5xnN+3n+btBIbAkMVpHtMDk/MnrnTTU0ag4yx9oc5LYbfeSnau/VT5iZMvCUSnLSvZWo/qpmycIc1d4Bs1kWo+0AQ3h5awqSrA0uVLwumqhVRGtchTWJG6FgJGFRSFPiDZOQNM9M4tmyFuYXCoUVESrqVhwpUkvU5j3iBptkUg8aW1ofcYnBZHJrwg4X5voN293jElY7uJDHjSaFOwZ3fQ5wkXdbvmHLLUr3Z+ag45K1JCVO2YNdUqyd20BoDWF33IJnJRN9hPEo5OwASPElR6CGu0l1d0otVKnwn3g8xETKxNwqIZhvT6Q3jyhlBmVqNAxc5MZ6/zJmfZ5aXSmgCQvExDlQdsqDJs/CDOzKsU6SlmAWHc7kP4UiFlTFKICi+VdaBg8TfZ6SV2lIHFxu+9c/jAshtuI3hRseHa55ozXbDLGcQ1unErUQNT6UHug9E5SSkJD4iz6DeBJrFRIbMxt6gGhMPCw3GAY18vMx7BOH7b6x0KVGN0zNHjk59Y1DsdefeygNRRXIjeMpEwsSdjtt9YuH4YXmAu0IJ9rAR1dQJ9RDOBje2usBqF+HdfSOfizdpKUzQKZKjJ7WCI33tlZTMsk5I0S48Psxgl5K/S3s0f76wg+Py8xHfmaejy78FduJGpTjWlIUElRAxKLAYiA6joA7k8o0K65CLLYphSrEo1c0PEQEkh+E4WLPoIzpCeNO2Ie+L3OQZqVKSG0bdm08onUNVCSF3dTxIvvAqiVOqpJUKs1a/LQGDpSXs9OFyQzk4qIclmrVR1+MCpsqEe2mpFAM32OrdImrosOMUyengwfoz+cAZx0jS1VxcsSkJSlABIVVmq7vz5a58oMEpImpwugu9C5SAKOxI3pAl32NSE0yCgHAcBIVueW3pEnZEjFM0oAHrrrzHn5ws+0fOFupFdoOyaJ6e8lMi0J0CWTMG5AolfPXrFVkqIUQxBS4UF5ht/KNTusHCkPhoADr1O1XMV3tTcBWZk1D98hOIhi0xIfF/5AB+bR2LUNu2P+kCrBGPaVOXMaihwqo9Ym0pEqWhaVkuTiSaZEYX3Pyiv2S2CYEqyKDkcqn0iQ/PK7xBUwHDmTpBsiG6jIa+ZfOy1pUZTAO5fMDCHDqD9WbWJWzWwCaAniqxB10z3ihSbWoNxAuKsKAnkQ2YB6RYLqt6ZfGXKAoVbUAdCMn8YTbHRB9frFs2G9zd43+J94FNnmlBIVNUhCd/aIPgyPURX7m7NpFnBY42cczzhvtZfotVoQmWwkSWxEMAVKbLpUsOZgm33ilXdyAssXxkapAxEDXTT1eNBBtUKfc/rEwGobeP8AAkPYpKluAHDtyro43rSDJdmSyWKcZyCQaCozcvX384Gum2ISSlaVJWDvSuTVyqM94s8hYCUIKBQKJHQ4SSTXIH6xV/eP3VRNgsykpSMlbPlmHJzqx+xE/dNMSi9EgqfmwDdfLyiMuz/JNXLCSFJblq4HP2hrpEoqWQlqDiwnKrVr55wrm5BWoNzfB/ogXaaxCZZ1lKaoGLmAPa+ztFGsU7unLAmoDvqDWmxr4RpVqkYVTMS2TgJUF/t4nrkRQ+kZdISVFIpxHUsPEnKC4kKrfvCYWBUj5Qm7piUsSHWlQNagjYh2IdqROdj5qjaJkxYolK1KyYKJFG8VeYiIEpMkrQtlUIdJGeldnHlFi7IXYvuVKDf5Vh8RqQl/RyX/ANRDmkTfmAPeB1rbcBYfL6y7XfaCpCZj/oUG/aQat4EQxNmpH62+zygmRITKlqALhsI5k1URy0gebKB+x8o0dYbehMPSj4ST6mD/APUZf/dPr8o8jvy6f2nzEdClGN0JmsyUaijV1EFXHblyZgmJYt7XMHMQ3alginIfH5Q3Z1gJPnFwxU2JQqGFGbDItMueKj/GtNAXr5coyHt72f8Ay00pSDhIBS+x569eUXnsBfYVKSineSwzPpoR4NB3b64vzclCkghYDgDUZkeGfnB9Ym5A6+nP+ZTw7L5WQ439f6DMDtCCC+0W+wTVzJImJ9lIHs7g8T84g7ysrKUFAg18OsG9mbaZMtVXSqhSWocnB0GWm+1UHp0uarqytQEPt6e8WkAs6RU1rT6+Qh+yWxUvElQIKVKSQDnmCelDTnBKrImahJwhOECoPMtEPapE1KcQBwjPl8xCvDcQuJ1qjLVdN5oKgFhgQ76P0826mJRM0KmOkMCRmNcj7z5RV5CGkoJ4VlTk5gpFPe20SlitPtqc4U0CgMk5vh0bERihdkF3Cst8iWWSrCAEs5JBfk3o/uh63z2RxUd2+9Yh5doKwEILEgKKtGNfGvxghfFhq5TShBqphnoMzAXxliYv5Y3AmZzfl2Gz2hSkpPdKL1SaPpXn7oQVoWnEhIwgAHkxr4xcO0tnK5a1YUncEngzUTVgPZIJO53iizJRALAtmWjRU2ouMK3EkfzyEhJDjCMiaFi58K5QBfPaghCkIVxKDEj3uc8gIBnyyREchKUzUrWkrQFOUu2JtH2Jz5QfDhS7PMX1GVgtKJO2GxGVLlpL41ArUnYKAb3CJGzF5ipoZKkEYUpFBprnzpV4cuyemeozpxAVMHCBQDIJA5CJJVlShiCMRcEH6QDLkNm+s7CRQUyIN3qSrEAXcBhqW+zFxut5hQoKZQSElJoQQ1X2J8B5wzYLv9maWIdmp5UPQxYptiBKVJKXSDTxGub61hN9R6GFyMooff8AiB3lZe7wzUKIWUhJbR1aVzyyrDN4XkeBGFSiHUpTVKlAMKaYavD1qkzVYnBOIZAgFOH51qRzrEDd174AQv8AUcTn2vt4m1PFyuNLF9aiL/UspOJanXgBQS5VQsQeTe6IOQoooQxAcO9RsIs18h5RmUwlSCGIoXIZj+pi46HaK1eE0YRUqLCpLkM7gcv7g+2lENjaxUHQCpaUipJApzMandViARgH6AGBzZwlzpsYzzsrYSuYJqgrCj2CxYncHVvf0jUbikYJbqDVcl6qaoTyrnGzotPsTzTMXxHVkt5K9f5nttmEKCUpDIoKnx9fhDS1q2HmYVaJOJySSSXPjDU+zgiu24gLszMTBooVQBF4l/x8z8o6AP8Ap6d1f8/rHRSzCUJndocLwkkjIZBhudzzj1dEE+n3t8ILt0jifDX4+EMzwQAmnlE7p1RNktSpSkzEGoL+G2eRjV7st3eJRMTVw41zEZNMBcCnl7otnYftKmQTKtBAQfYUMkk6K2GdcoZ0+YLat0P7xbUYS1MvUftBfxQ7PMtM9EshKzxgAFlDfRjz5xQ0SuJgMx4P8o+hO6SuWQwWlQ6gvGZdtOyfcLxofAqoP3tCOqQ4juA+E/YzS0Wff/pueR0PcSrXNfRk8EwFQc51auxz1iVtM+ZOQ0sukOWDB/KIHuuJ1VO8NpnLQt0Eu+TsPGrQuRuPEbbCB8UsNjsRNGJoQUno31gyVLUgd2QQp3r0GY8HgPszfc/vQlJllSlYSSk1JJZjtz5xM3z2jBkyyuWjGolLhypITybc8xnAMmJ6MsMjbgNvB94mdb0Swmmbkk11rsxoTTeCbrn4gtRNFqUUlwCATnyo1PSkVm329K0Vd8g8DXXe6ysBJKcIYM78yNjziuJDVkQzKCKHWTHai1t3aR+tJW+TcbPl/BQHUxX7aqUKJUTkxyqdC/PWJLttY5qJwC1KUkISJayM01ID6kEq1eIGxISqZhmB0qDAMTn0y6w6MYsDtFMmbZjLDn14knYLmKgpMyWXKkkKBo2uTEe6oiDtliJVMMtKlISpQCmJDJOZPRvOLtZUCVLIDlNMI/YQXIB/btt0IAZtgw2fEWAAYAChcUCX0oQ9WaGaAExdPqsjZCOtkfKVu47UyMOqfOsTqbQCK5vkYrXdFKsQiUslqFHOjEGEM6AncJ6DEldZcpcp8KkUQkYikblhQ6xZe/lhKSK0bqDodvpFHuy8JdElRAFamgPxibPaKzy0llqUUigZ35A/E7RmMrE1VmRmxkgdZMptDKYEMp2SRU1DHE7AAYncZRm94W4CerAQqWFulwyVBJoSnb4E7w/eXaFcwqS6kylKGJIzb9pU1daZPpEThxKOEEJej1Ycz0h3DhCLZ6y2LEUv3klKty5U1MwgOgkhB9kEjCSBpkOdBnDd13f38zCClIzqWAGprpA86SVLwpZRoAz12AesWu6bq7tISo8ZIOADKmp1+vjD2lwNncKTx6wGq1K6dLH5vSS3Z+6mmBJVjlpBYAFiWyHic4sdrmBJSgGiQ2mevy8I8lIElASmilBydQDtzgWaU6j0jT1OVQPLToJh4EZ2OV+phC+vu0hAII09IbE0ECmm3WEiaCDT0hO4ztisI+ymOhrEn9vpHsdcnbKqqWDpEfbbNxM33/TRPWlktuSwoX38qQHOSSqgYbkbMGbbnFCJwMg1yePoBDdoTs/OgMS35cFR6+6BrTZ6+yDHXUt1k12K7QrlD8utZCf0EtR/08htF5tlnRaJOBeRzbMHcRk82QNW6RYuxvaUyZndTl/4lUSpR9k6OdobTKjJscf3tFMmJw3mIef7yJG9p+x0yRxhlyyaEA02xDQxU7VZ/AivPw8Y+hZkpK04VAKSRkagiKN2r/D4KBmWbPMoOv8Aqd+RhHNpWQ7k5Hb1E1NNrw6hMpo9/Q/OZ1c9oSmaVzADlVhoc2/Ud3zh687wEyZNKcQQonC/7cRUByqXbcw1PsSk0UkgihBDEdYHXJNGhbfd8zSKDrFpmFKSCE8SS2IORpRsj1pDV2IZSqFw9U5jc9IWkjZzzrDSpdXGZiQeKkBeZI3nMmrIQtfChPC6jxBJYM5qWNOT84ip5KVjASlvXqPKJG9bT3qkKCcOFKUULuQkAq8c4BmzUlaO8BIxJxMzkPUA7s9ecWQmxzBsoK0w/SGy70nsxwEEMXBoKPkc/nCrWpS5iJiyFBSw+zJA4Q2SW2gdTFgkEDVy4YsRRnpWFpSEAKJxOaEfLTqecQzsfWVx6bGhtRUevieJs4qShKUABKUpSwSAGAoPU5wAqXUaViYuS0IlLUuYl0K4ikh8WEFkPo5NT02iOnKxEqAauQ05DlEXxdwq8GqjSQf725Q7gdw/PxhckJq75Fm021yj3u6UgZaEEalSgXfwgm7bFMmLCEAkkgNn9tErcPZibPL4SlAzUcqbRfLou6zyJTyQ61DMh1P/AC2EMYNNkzdBx3ieq1uPBxdnt/mR9w3HZ5KgzKmAAEtir/HQZ5xMSbtRLWVqBKjViXJO526QuzSxJBUQ8xVWDUfWuXKEmadj5iNZmTTjy8X6mYAV9Q2/IeI5MViJUcz09Nmhmcga/COTN0b1EJmqLZeohSNDidRqfDKPEgVjwTC7N6iOE0v7JyfMR3EnmI7rp6R0Lf8Aj7o6IoTrMjp0k06nyY/FoCXI4iaxNqlnq0BFLks+cQw6SAZFhAxGmXwge0orlEnMQSVMxL6loDmFQNUKNS7EMABnm9YGZcGAz7PXLnDM+zOl2rEtNlOXNKZFqda59IanWfhMcZIMFuntBabM3dqJQP8A41uUty1T4RovZztFLtSHTwrHtSyQ6fmOfuyjOZkikMqlKQrGhSkqTkpJYjoRBceVl9xKPiV/YzUb2uGRPH+RFf3Ch89fGKbfX4cEOqUrEP2nP5GGLs7aWxDBZTNGoUMKj0UkBj1Bi6XT2kkThRYQvVCiAfDfMVES+LDmN9D36TkzajT8A2O3UTHrdc82WSFIIY7NAqpJ/uN9myELHElKhzAIiFt3Y6yzC+DCf409IWfRZR+Ug/aPY/FMZ/OpHy5mMrl0doFVL1jXrT+HUkjhUoHmPlENavw0mE8K0tuf6gXlZlNFT+8YGs07/wC6vnM/s5AUAp8GZAZz4tQecTEyxSxKxe08wJRhLqPCSeED/UdesWP/ANPQn2p6HGgc+6ApvY44gBMDbt8PrBV0ufIeEP7Qb67TKPzj7ytLVQCrB+E0Zzqx846XJzo4i7SOyEoNiClnUOznlqIlbm7OolnhQCRQPUDqT7UML4XmP5iAPncWfxjCo+AEn6Sg2S5Jq2woLM+I0DbknSLR2euKWj2kd6rdXsjonM+J8os86xUOJQclzUVAFPD5Q/ZUIljhDq3OkNY9Hp8Ns53Ht6RHN4jqNR8KjaP76xE2XMWySyUMxAoDlnHWp0pCJVN1NU9DoIUpbqBJ9Y5RB1HnHZNTuXaooe0EmABtzGzA0yVPn/cemWd4eUtO49IaURuPSEyAI1ZMQUF3xH0hS5ZbM+kJMxIBJIADk1GnhC1KDZjzEWAFTuY33ZccR9I4Sy44j9iFTJiWzT5iOJSDmM3zGTRIAnWZ2A7n0+cdC3G48xHRNCdZiTKoaVZuVYFTLryMSB+/vpAktJrrFT6SogYTnXWGSgvBiU084VKlVigEuYDOl1NYTNkcI5/WDu7c5R7aJeXKOIM4GRCrMPOBrdLABqfMxKrQ2h+zDFqk5cJz2itSymRQsoGZI0zMIRIS6s8656U+ES/csOmdIbk2QAZZl4qRL7oHYbSuSp5K1IPIljs4NCOoiYPbiekFxLNWBKVOabBUBzLMAXI92nhCF2MNlzOUWV3XgGQyoxsiSUjt9MNFITXVII9C8EDtJLWWmGY+zfItEPLsCRpkB+2CbNZg5LeogyanKo4I+kDk02JvQ/WSKr5lmiZam3Le76wlF7S0ue7USOgHvMNIlB/fWPJ0obZn93qHgg1eeqv7QX4XDf5fvC0XsoiiUhy1El+jvBEy0qKWyGzN51rA8hNNacx8IOlKB9+e8VOTIwotLeUimwoggTukEdIcxjRNGao90LXSm/Mwi0KyHxMUAl7gE20jGKDkGGkHWc8PsgeAgezWYbVPNRppCbzmTgpIlOaLdk0duFyQddKeOUVC1JZhUJUX09BDfh6CAJc+1UdBo7skap4GDh2Upj/pXN4XJVaGSriegKVAAH/IQSSEBQ4ADlrlE7ZQP7Qe9bYqiUyVLIJcAhJDbAjiGflBF32srSAUFJAycFtPaAqYRLVPaViCjiPGnCBqKksWoSdMs3oWUG0d5XFhx6JB4cSmqEFgwFPHFWnAHvJ80lQtfrzJAzP4vpkPlHhOuF+EU8em4gBK7QrClJUC4xFaUhuBROSS6QphoTv+qFWRU90PjIxKCgU5Aga4AwFTz/cWaJE7eO0P70/tPkPlHQth9mOialrEJGcITl9846OiDKiBy8vGHbPr0+EdHRUSxnhy/wDI++One0eg+EdHRM6Dqz8f/wAmBpuY8I9joqZYRNo9k/6n3Q9L08fhHR0QZM6dkPveEK18Y6OiJIjyM/OHpfx+Ijo6JkRUrM/egh05DoI6Oi6yhhEvIx0nTpHR0W9YOKme0PH3QLP9oeHuMdHRI6yY5Z9fvSFL0jo6IM6eD2fGFqjo6OnRCsoblx0dHSfSNyvaMOp+MdHRAnGNR0dHReWn/9k="
                                        title="Card 1"
                                    />
                                    <CardContent>
                                        <Grid container spacing={1}>
                                            <Grid item>
                                                <Typography variant="subtitle1">{item.FoodDetail.name}</Typography>
                                            </Grid>
                                            <Grid item>
                                                <Typography variant="subtitle2">{item.FoodDetail.description}</Typography>
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
                                            name="simple-controlled"
                                            value={calculateRating()}
                                            icon={<StarTwoToneIcon fontSize="inherit" />}
                                            emptyIcon={<StarBorderTwoToneIcon fontSize="inherit" />}
                                            onChange={(event, newValue) => {
                                                giveRating(event, newValue);
                                            }}
                                            disabled={isDone}
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
