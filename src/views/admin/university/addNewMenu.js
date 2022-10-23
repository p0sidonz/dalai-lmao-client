/* eslint-disable */
// material-ui
import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { openSnackbar } from 'store/slices/snackbar';
import { useDispatch } from 'react-redux';
// project imports
import ShowLoader from 'ui-component/custom/Loader';

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
import axiosServices from 'utils/axios';

const AddNewMenu = ({ universityId, refetch, setItemModalOpen }) => {
    const [isLoading, setIsLoading] = useState(Boolean(false));

    const dispatch = useDispatch();
    const theme = useTheme();
    const [menuImage, setMenuImage] = useState('');
    const fileSelectedHandler = async (event) => {
        event.preventDefault();
        let input = event.target;
        let file = input.files[0];
        let reader = new FileReader();
        reader.addEventListener('load', async function () {
            const RawBase64 = reader.result;
            const base64 = reader.result.replace(/.*.base64,/, '');
            const fieldID = input.id;
            setMenuImage(RawBase64);
            return RawBase64;
        });
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const returnTheImage = () => menuImage;

    return (
        <>
            <ShowLoader isLoading={isLoading} />

            <Grid container spacing={3} justifyContent="center" alignItems="center">
                <Grid item xs={12}>
                    <Formik
                        enableReinitialize
                        initialValues={{
                            name: '',
                            description: '',
                            university_id: universityId
                        }}
                        validationSchema={Yup.object().shape({
                            name: Yup.string().max(255).required('Name field is required'),
                            description: Yup.string().max(255).required('description is required'),
                            image: Yup.mixed().required('Image is required')
                        })}
                        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                            setIsLoading(true);
                            delete values.image;
                            await axiosServices
                                .post('/university-menu/', { ...values, image: menuImage })
                                .then((r) => {
                                    console.log(r);
                                    refetch();
                                    dispatch(
                                        openSnackbar({
                                            open: true,
                                            message: 'Menu Added',
                                            variant: 'alert',
                                            alert: {
                                                color: 'success'
                                            },
                                            close: true
                                        })
                                    );
                                    setItemModalOpen();
                                    setIsLoading(false);
                                })
                                .catch((err) => {
                                    console.log(err);
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
                        }}
                    >
                        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => (
                            <form noValidate onSubmit={handleSubmit}>
                                <FormControl
                                    sx={{ ...theme.typography.customInput }}
                                    fullWidth
                                    error={Boolean(touched.name && errors.name)}
                                >
                                    <InputLabel htmlFor="outlined-adornment-name-login">Name</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-name-login"
                                        type="text"
                                        value={values.name}
                                        name="name"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                    />
                                    {touched.name && errors.name && (
                                        <FormHelperText error id="standard-weight-helper-text-name-login">
                                            {errors.name}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                                <FormControl
                                    sx={{ ...theme.typography.customInput }}
                                    fullWidth
                                    error={Boolean(touched.description && errors.description)}
                                >
                                    <InputLabel htmlFor="outlined-adornment-description-login">Description</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-description-login"
                                        type="text"
                                        value={values.description}
                                        name="description"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                    />
                                    {touched.description && errors.description && (
                                        <FormHelperText error id="standard-weight-helper-text-description-login">
                                            {errors.description}
                                        </FormHelperText>
                                    )}
                                </FormControl>

                                <FormControl
                                    sx={{ ...theme.typography.customInput }}
                                    fullWidth
                                    error={Boolean(touched.photo && errors.photo)}
                                >
                                    <InputLabel htmlFor="outlined-adornment-photo-login">Photo</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-photo-login"
                                        type="file"
                                        value={values.photo}
                                        name="image"
                                        onBlur={handleBlur}
                                        onChange={(event) => {
                                            fileSelectedHandler(event);
                                            setFieldValue('image', 'image');
                                        }}
                                    />
                                    {touched.image && errors.image && (
                                        <FormHelperText error id="standard-weight-helper-text-photo-login">
                                            {errors.image}
                                        </FormHelperText>
                                    )}
                                </FormControl>

                                {menuImage ? (
                                    <>
                                        {' '}
                                        <img sx={{ border: 1 }} src={menuImage} className="img-thumbnail mt-2" height={200} width={200} />
                                    </>
                                ) : (
                                    <></>
                                )}
                                <Button type="submit">Submit</Button>
                            </form>
                        )}
                    </Formik>
                </Grid>
            </Grid>
        </>
    );
};

export default AddNewMenu;
