/* eslint-disable */
// material-ui
import { useTheme } from '@mui/material/styles';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { openSnackbar } from 'store/slices/snackbar';
import { useDispatch } from 'react-redux';
import { useModal } from '../../../hooks/useModal';

// project imports
import { gridSpacing } from 'store/constant';
import useAuth from 'hooks/useAuth';
import MainCard from 'ui-component/cards/MainCard';
import CustomModal from 'ui-component/custom/Modal';
import moment from 'moment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import {
    Chip,
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
    Typography,
    Autocomplete
} from '@mui/material';

import SubCard from 'ui-component/cards/SubCard';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';
import axiosServices from 'utils/axios';
import AddNewFood from '../food/AddNewFood';

const EditMenuItem = ({ menuEditItem, toggleEditModal, fetchMenus }) => {
    const dispatch = useDispatch();
    const [itemModalOpen, setItemModalOpen, toggleModal] = useModal();

    const theme = useTheme();
    const [isLoading, setIsLoading] = useState(true);
    const [menuImage, setMenuImage] = useState(menuEditItem.image);
    const [menuData, setMenuData] = useState({});
    const [foodList, setFoodList] = useState([]);
    const [existingData, setExistingData] = useState([]);
    const [isDateSet, setIsDateSet] = useState(false);
    const [dateValue, setDateValue] = useState(dayjs('2022-10-12T21:11:54').toISOString());
    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;

    const handleModal = (e) => {
        toggleModal();
    };

    const fetchFoodList = async () => {
        const data = await axiosServices
            .get('/adminx/getfoodlist')
            .then((r) => {
                setFoodList([...r.data.data]);
            })
            .catch((err) => console.log(err));
    };

    const fetchidk = async () => {
        await axiosServices
            .get(`/adminx/foodlistofthemenu/${menuEditItem.id}/${dateValue}`)
            .then((r) => {
                const Final = r.data.map((item) => item.FoodDetail);
                setExistingData([...Final]);
                fetchFoodList();
            })
            .catch((err) => console.log('getFoodListOfMenu', err));
    };

    useEffect(() => {
        setIsLoading(true);
        fetchFoodList();
        fetchidk();
        setIsLoading(false);
    }, []);
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

    const handleOnChange = async (event, value, reason, details) => {
        // console.log(details, value);
        // setExistingData([...existingData, details.option]);
        if (reason === 'selectOption') {
            await axiosServices
                .post('/foodlist', {
                    date: moment(dateValue).toISOString(true),
                    menu_id: menuEditItem.id,
                    food_id: details.option.id
                })
                .then((r) => {
                    dispatch(
                        openSnackbar({
                            open: true,
                            message: 'Food Added',
                            variant: 'alert',
                            alert: {
                                color: 'success'
                            },
                            close: true
                        })
                    );
                    toggleEditModal();
                })
                .catch((err) => {
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
                });
        }
        if (reason === 'removeOption') {
            // let localData = existingData;
            // let objIndex = localData.findIndex((obj) => obj.id === details.option.id);
            // objIndex !== -1 && localData.splice(objIndex, 1);
            // setExistingData(localData);
            await axiosServices
                .post('/foodlist/delete', { foodlist_id: details.option.id, menu_id: menuEditItem.id })
                .then((r) => {
                    dispatch(
                        openSnackbar({
                            open: true,
                            message: 'Food Removed',
                            variant: 'alert',
                            alert: {
                                color: 'success'
                            },
                            close: true
                        })
                    );
                    toggleEditModal();
                })
                .catch((err) => {
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
                });
        }
    };

    const handleFoodChange = (newValue) => {
        setDateValue(dayjs(newValue).toISOString());
    };

    const lazyDateButton = () => {
        fetchidk();
    };
    // const returnTheImage = () => menuImage;

    return (
        <>
            <Grid container spacing={3} justifyContent="center" alignItems="center">
                <Grid item xs={12}>
                    <Formik
                        enableReinitialize
                        initialValues={{
                            name: menuEditItem.name,
                            description: menuEditItem.description,
                            menu_id: menuEditItem.id,
                            image: menuImage
                        }}
                        validationSchema={Yup.object().shape({
                            name: Yup.string().max(255).required('Name field is required'),
                            description: Yup.string().max(255).required('description is required'),
                            image: Yup.mixed().required()
                        })}
                        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                            console.log({ ...values, image: menuImage });
                            await axiosServices
                                .post('/university-menu/update', { ...values, image: menuImage })
                                .then((r) => {
                                    console.log(r);
                                    dispatch(
                                        openSnackbar({
                                            open: true,
                                            message: 'Menu Updated',
                                            variant: 'alert',
                                            alert: {
                                                color: 'success'
                                            },
                                            close: true
                                        })
                                    );
                                    toggleEditModal();
                                    fetchMenus();
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

                                <Grid item>
                                    <Button fullWidth sx={{ mt: 2 }} variant="contained" type="submit">
                                        Update Menu
                                    </Button>
                                </Grid>
                            </form>
                        )}
                    </Formik>
                </Grid>

                <Grid item xs={12}>
                    <SubCard title="Add Food" secondary={<Button onClick={handleModal}>Add New Food</Button>}>
                        <Grid container justifyContent="center" alignItems="center">
                            <Grid item xs={12}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DesktopDatePicker
                                        label="Date desktop"
                                        inputFormat="MM/DD/YYYY"
                                        value={dateValue}
                                        onChange={handleFoodChange}
                                        renderInput={(params) => <TextField fullWidth {...params} />}
                                    />
                                </LocalizationProvider>
                                <Button onClick={lazyDateButton} sx={{ m: 2 }} fullwidth variant="contained">
                                    Find
                                </Button>
                                {/* <TextField
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                    sx={{ mb: 2 }}
                                    fullWidth
                                    onChange={handleFoodChange}
                                    name="date"
                                    label="Date"
                                    type="date"
                                /> */}

                                {!isLoading ? (
                                    <>
                                        {/* <Autocomplete
                                            disabled={Boolean(!dateValue)}
                                            multiple={true}
                                            value={existingData}
                                            getOptionSelected={(option, value) => value.name === option.name}
                                            id="checkboxes-tags-demo"
                                            options={foodList}
                                            getOptionLabel={(option) => option.name}
                                            name="foodlist"
                                            onChange={handleOnChange}
                                            disableCloseOnSelect={true}
                                            renderTags={(value, getTagProps) =>
                                                value.map((option, index) => (
                                                    <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                                                ))
                                            }
                                            renderInput={(params) => <TextField {...params} label="Search Food" placeholder="Favorites" />}
                                        />{' '} */}
                                        {/* <Autocomplete
                                            id="combo-box-demo"
                                            multiple
                                            disableCloseOnSelect
                                            value={existingData}
                                            options={foodList}
                                            getOptionSelected={(option, value) => value.name === option.name}
                                            getOptionLabel={(option) => option.name}
                                            style={{ width: 500 }}
                                            renderInput={(params) => (
                                                <TextField {...params} label="Combo box" variant="outlined" fullWidth />
                                            )}
                                            renderOption={(option, { selected }) => (
                                                <>
                                                    <Checkbox
                                                        icon={icon}
                                                        checkedIcon={checkedIcon}
                                                        style={{ marginRight: 8 }}
                                                        checked={selected}
                                                    />
                                                    {option.text}
                                                </>
                                            )}
                                        /> */}

                                        <Autocomplete
                                            disabled={Boolean(!dateValue)}
                                            id="combo-box-demo"
                                            multiple
                                            freeSolo
                                            disableCloseOnSelect
                                            value={existingData}
                                            limitTags={2}
                                            options={foodList}
                                            onChange={handleOnChange}
                                            getOptionLabel={(item) => (item.name ? item.name : '')}
                                            getOptionSelected={(option, value) =>
                                                value === undefined || value === '' || option.name === value.name
                                            }
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    multiline={false}
                                                    fullWidth
                                                    label="Food listed for the above date"
                                                    margin="normal"
                                                    variant="outlined"
                                                />
                                            )}
                                            renderTags={(value, getTagProps) =>
                                                value.map((option, index) => {
                                                    return (
                                                        <Chip
                                                            sx={{ fontWeight: '700' }}
                                                            variant="contained"
                                                            size="small"
                                                            label={option.name}
                                                            clickable={true}
                                                            {...getTagProps({ index })}
                                                        />
                                                    );
                                                })
                                            }
                                        />
                                    </>
                                ) : (
                                    <></>
                                )}

                                <Grid item>
                                    <Typography variant="caption">Couldn't find the food? Just Add one from the right button.</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </SubCard>
                </Grid>
            </Grid>

            <CustomModal
                fullWidth
                handleClose={() => setItemModalOpen(false)}
                isActive={itemModalOpen}
                title="Add New Food"
                closeText="Cancel"
            >
                <AddNewFood handleModal={handleModal} fetchFoodList={fetchFoodList} />
            </CustomModal>
        </>
    );
};

export default EditMenuItem;
