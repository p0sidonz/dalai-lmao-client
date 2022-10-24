/* eslint-disable */
// material-ui
import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { openSnackbar } from 'store/slices/snackbar';
import { useDispatch } from 'react-redux';
// project imports
import { gridSpacing } from 'store/constant';
import useAuth from 'hooks/useAuth';

import MainCard from 'ui-component/cards/MainCard';
import {
    Box,
    Avatar,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    TextField,
    Typography
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';
import useScriptRef from 'hooks/useScriptRef';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axiosServices from 'utils/axios';
import ShowLoader from 'ui-component/custom/Loader';

// const useStyles = makeStyles((theme) => ({
//     input: {
//         display: 'none'
//     }
// }));

const ProfileSettings = () => {
    const { logout } = useAuth();
    const dispatch = useDispatch();
    const theme = useTheme();
    const [isLoading, setIsLoading] = useState(Boolean(false));

    const [avatarImage, setAvatarImage] = useState('');
    const [userData, setUserData] = useState({});
    const [passwords, setPasswords] = useState({
        oldPassword: '',
        password: '',
        rePassword: ''
    });

    const handleOnChange = (e) => {
        const local = passwords;
        local[e.target.name] = e.target.value;
        setPasswords({ ...local });
    };
    const fileSelectedHandler = async (event) => {
        setIsLoading(true);
        event.preventDefault();
        let input = event.target;
        let file = input.files[0];
        let reader = new FileReader();
        reader.addEventListener('load', async function () {
            const RawBase64 = reader.result;
            const base64 = reader.result.replace(/.*.base64,/, '');
            const fieldID = input.id;
            setAvatarImage(RawBase64);
            await axiosServices
                .post('users/update', { avatar: RawBase64 })
                .then((r) => {
                    dispatch(
                        openSnackbar({
                            open: true,
                            message: 'Avatar Updated',
                            variant: 'alert',
                            alert: {
                                color: 'success'
                            },
                            close: true
                        })
                    );
                    setIsLoading(false);
                })
                .catch((err) => {
                    setIsLoading(false);
                    dispatch(
                        openSnackbar({
                            open: true,
                            message: 'Please try again',
                            variant: 'alert',
                            alert: {
                                color: 'error'
                            },
                            close: true
                        })
                    );
                });
        });
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const fetchProfile = async () => {
        setIsLoading(true);

        await axiosServices
            .get(`/users/me`)
            .then((r) => {
                let local = r.data;
                if (!r.data.contact) {
                    local.contact = '';
                }
                if (!r.data.username) {
                    local.username = '';
                }
                setUserData({ ...local });
                setIsLoading(false);
            })
            .catch((err) => {
                setIsLoading(false);
            });
    };
    useEffect(() => {
        fetchProfile();
        return () => {
            console.log('this iwas ');
        };
    }, []);

    const handleChangePassword = async () => {
        if (!passwords.oldPassword) {
            return dispatch(
                openSnackbar({
                    open: true,
                    message: 'Old Password is Empty',
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    },
                    close: true
                })
            );
        }

        if (!passwords.password || !passwords.rePassword)
            return dispatch(
                openSnackbar({
                    open: true,
                    message: 'Password cannot be Empty',
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    },
                    close: true
                })
            );

        if (passwords.password !== passwords.rePassword) {
            return dispatch(
                openSnackbar({
                    open: true,
                    message: 'Password not matching',
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    },
                    close: true
                })
            );
        }
        setIsLoading(true);
        await axiosServices
            .post('/users/changePws', { ...passwords })
            .then((res) => {
                setIsLoading(false);
                dispatch(
                    openSnackbar({
                        open: true,
                        message: res.data.message,
                        variant: 'alert',
                        alert: {
                            color: 'success'
                        },
                        close: true
                    })
                );
                const local = { oldPassword: '', password: '', rePassword: '' };
                setPasswords(local);
            })
            .catch((err) => {
                setIsLoading(false);
                return dispatch(
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
            });
    };

    return (
        <>
            <ShowLoader isLoading={isLoading} />
            <MainCard title="Profile" sx={{ marginBottom: 3 }}>
                <Grid container spacing={3} justifyContent="center" alignItems="center">
                    <Grid item sx={{ marginBottom: 5 }}>
                        <input onChange={fileSelectedHandler} hidden accept="image/*" id="contained-button-file" type="file" />
                        <label htmlFor="contained-button-file">
                            <IconButton component="span">
                                <Avatar
                                    alt="User 3"
                                    src={userData.avatar ? userData.avatar : 'https://dummyimage.com/100x100/000/a3a5c2.png&text=NO+PIC'}
                                    sx={{ width: 100, height: 100 }}
                                />
                            </IconButton>
                        </label>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Formik
                        enableReinitialize
                        initialValues={{
                            ...userData
                        }}
                        validationSchema={Yup.object().shape({
                            email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                            first_name: Yup.string().max(255).required('First Name is required'),
                            last_name: Yup.string().max(255).required('Last Name is required'),
                            username: Yup.string().max(12).required('Username is required'),
                            contact: Yup.string().max(12).required('Contact is required')
                        })}
                        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                            setIsLoading(true);
                            delete values.avatar;
                            await axiosServices
                                .post('users/update', { ...values })
                                .then((r) => {
                                    dispatch(
                                        openSnackbar({
                                            open: true,
                                            message: 'Profile Updated',
                                            variant: 'alert',
                                            alert: {
                                                color: 'success'
                                            },
                                            close: true
                                        })
                                    );
                                    setIsLoading(false);
                                })
                                .catch((err) => {
                                    dispatch(
                                        openSnackbar({
                                            open: true,
                                            message: 'Please try again',
                                            variant: 'alert',
                                            alert: {
                                                color: 'error'
                                            },
                                            close: true
                                        })
                                    );
                                    setIsLoading(false);
                                });
                        }}
                    >
                        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                            <form noValidate onSubmit={handleSubmit}>
                                <FormControl
                                    sx={{ ...theme.typography.customInput }}
                                    fullWidth
                                    error={Boolean(touched.first_name && errors.first_name)}
                                >
                                    <InputLabel
                                        InputLabelProps={{
                                            shrink: true
                                        }}
                                        htmlFor="outlined-adornment-first_name-login"
                                    >
                                        First Name
                                    </InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-first_name-login"
                                        type="text"
                                        value={values.first_name}
                                        name="first_name"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                    />
                                    {touched.first_name && errors.first_name && (
                                        <FormHelperText error id="standard-weight-helper-text-first_name-login">
                                            {errors.first_name}
                                        </FormHelperText>
                                    )}
                                </FormControl>

                                <FormControl
                                    fullWidth
                                    error={Boolean(touched.last_name && errors.last_name)}
                                    sx={{ ...theme.typography.customInput }}
                                >
                                    <InputLabel htmlFor="outlined-adornment-last_name-login">Last Name</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-last_name-login"
                                        type="text"
                                        value={values.last_name}
                                        name="last_name"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        inputProps={{}}
                                    />
                                    {touched.last_name && errors.last_name && (
                                        <FormHelperText error id="standard-weight-helper-text-last_name-login">
                                            {errors.last_name}
                                        </FormHelperText>
                                    )}
                                </FormControl>

                                <FormControl
                                    fullWidth
                                    error={Boolean(touched.username && errors.username)}
                                    sx={{ ...theme.typography.customInput }}
                                >
                                    <InputLabel htmlFor="outlined-adornment-username-login">Username</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-username-login"
                                        type="text"
                                        value={values.username}
                                        name="username"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        inputProps={{}}
                                    />
                                    {touched.username && errors.username && (
                                        <FormHelperText error id="standard-weight-helper-text-username-login">
                                            {errors.username}
                                        </FormHelperText>
                                    )}
                                </FormControl>

                                <FormControl
                                    fullWidth
                                    error={Boolean(touched.email && errors.email)}
                                    sx={{ ...theme.typography.customInput }}
                                >
                                    <InputLabel htmlFor="outlined-adornment-email-login">Email Address</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-email-login"
                                        type="email"
                                        value={values.email}
                                        name="email"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        inputProps={{}}
                                    />
                                    {touched.email && errors.email && (
                                        <FormHelperText error id="standard-weight-helper-text-email-login">
                                            {errors.email}
                                        </FormHelperText>
                                    )}
                                </FormControl>

                                <FormControl
                                    fullWidth
                                    error={Boolean(touched.contact && errors.contact)}
                                    sx={{ ...theme.typography.customInput }}
                                >
                                    <InputLabel htmlFor="outlined-adornment-contact-login">Contact No.</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-contact-login"
                                        type="text"
                                        value={values.contact}
                                        name="contact"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        inputProps={{}}
                                    />
                                    {touched.contact && errors.contact && (
                                        <FormHelperText error id="standard-weight-helper-text-contact-login">
                                            {errors.contact}
                                        </FormHelperText>
                                    )}
                                </FormControl>

                                <Box sx={{ mt: 2 }}>
                                    <AnimateButton>
                                        <Button
                                            color="secondary"
                                            disabled={isSubmitting}
                                            fullWidth
                                            size="large"
                                            type="submit"
                                            variant="contained"
                                        >
                                            Update
                                        </Button>
                                    </AnimateButton>
                                </Box>
                            </form>
                        )}
                    </Formik>
                </Grid>
            </MainCard>
            <MainCard title="Password" sx={{ marginBottom: 5 }}>
                <form noValidate autoComplete="off">
                    <Grid container spacing={gridSpacing} sx={{ mb: 1.75 }}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                name="oldPassword"
                                onChange={handleOnChange}
                                type="password"
                                id="outlined-basic7"
                                fullWidth
                                label="Current Password"
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={gridSpacing} sx={{ mb: 1.75 }}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                name="password"
                                onChange={handleOnChange}
                                type="password"
                                id="outlined-basic8"
                                fullWidth
                                label="New Password"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                name="rePassword"
                                onChange={handleOnChange}
                                type="password"
                                id="outlined-basic9"
                                fullWidth
                                label="Confirm Password"
                            />
                        </Grid>
                    </Grid>
                </form>
                <Box sx={{ mt: 2 }}>
                    <AnimateButton>
                        <Button onClick={handleChangePassword} color="secondary" fullWidth size="large" type="submit" variant="contained">
                            Change Password
                        </Button>
                    </AnimateButton>
                </Box>

                <Box sx={{ mt: 2 }}>
                    <AnimateButton>
                        <Button onClick={logout} color="error" fullWidth size="large" type="submit" variant="contained">
                            Logout
                        </Button>
                    </AnimateButton>
                </Box>
            </MainCard>
        </>
    );
};

export default ProfileSettings;
