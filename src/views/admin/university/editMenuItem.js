/* eslint-disable */
// material-ui
import { useTheme } from '@mui/material/styles';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { openSnackbar } from 'store/slices/snackbar';
import { useDispatch } from 'react-redux';
import { useModal } from '../../../hooks/useModal';
import { Card, CardContent, List, ListItem, ListItemText, Divider } from '@mui/material';
import { Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';


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
    Rating,
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
import ShowLoader from 'ui-component/custom/Loader';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';
import axiosServices from 'utils/axios';
import AddNewFood from '../food/AddNewFood';

const EditMenuItem = ({ menuEditItem, toggleEditModal, fetchMenus }) => {
    const dispatch = useDispatch();
    const [itemModalOpen, setItemModalOpen, toggleModal] = useModal();
    const [isLoaderLoading, setIsLoaderLoading] = useState(false);
    const theme = useTheme();
    const [isLoading, setIsLoading] = useState(true);
    const [menuImage, setMenuImage] = useState(menuEditItem.image);
    const [menuData, setMenuData] = useState({});
    const [reviewsData, setReviewsData] = useState([]);
    const [foodList, setFoodList] = useState([]);
    const [existingData, setExistingData] = useState([]);
    const [isDateSet, setIsDateSet] = useState(false);
    const [dateValue, setDateValue] = useState(dayjs(Date.now()).toISOString());
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
                setReviewsData([...r.data]);
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

    const handleOnChange = async (event, newValue) => {
        setIsLoaderLoading(true);
        const addedItems = newValue.filter(item => !existingData.some(existing => existing.id === item.id));
        const removedItems = existingData.filter(item => !newValue.some(newItem => newItem.id === item.id));
    
        for (const item of addedItems) {
            await axiosServices
                .post('/foodlist', {
                    date: moment(dateValue).toISOString(true),
                    menu_id: menuEditItem.id,
                    food_id: item.id
                })
                .then(() => {
                    dispatch(
                        openSnackbar({
                            open: true,
                            message: `${item.name} Added`,
                            variant: 'alert',
                            alert: { color: 'success' },
                            close: true
                        })
                    );
                })
                .catch((err) => {
                    dispatch(
                        openSnackbar({
                            open: true,
                            message: err.data.message,
                            variant: 'alert',
                            alert: { color: 'error' },
                            close: true
                        })
                    );
                });
        }
    
        for (const item of removedItems) {
            await axiosServices
                .post('/foodlist/delete', { foodlist_id: item.id, menu_id: menuEditItem.id })
                .then(() => {
                    dispatch(
                        openSnackbar({
                            open: true,
                            message: `${item.name} Removed`,
                            variant: 'alert',
                            alert: { color: 'success' },
                            close: true
                        })
                    );
                })
                .catch((err) => {
                    dispatch(
                        openSnackbar({
                            open: true,
                            message: err.data.message,
                            variant: 'alert',
                            alert: { color: 'error' },
                            close: true
                        })
                    );
                });
        }
    
        setExistingData(newValue);
        setIsLoaderLoading(false);
    };
    const handleFoodChange = (newValue) => {
        setDateValue(dayjs(newValue).toISOString());
    };

    const lazyDateButton = () => {
        fetchidk();
    };
    // const returnTheImage = () => menuImage;

    const sortOptions = (options, value) => {
        return options.sort((a, b) => {
            const aSelected = value.some(item => item.id === a.id);
            const bSelected = value.some(item => item.id === b.id);
            if (aSelected && !bSelected) return -1;
            if (!aSelected && bSelected) return 1;
            return a.name.localeCompare(b.name);
        });
    };

    return (
        <>
            <ShowLoader isLoading={isLoaderLoading} />

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
                            setIsLoaderLoading(true);
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
                                    setIsLoaderLoading(false);
                                    toggleEditModal();
                                    fetchMenus();
                                })
                                .catch((err) => {
                                    setIsLoaderLoading(false);
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
                                        defaultValue={"2024-10-12"}
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
<Autocomplete
        multiple
        id="checkboxes-tags-demo"
        options={sortOptions(foodList, existingData)}
        disableCloseOnSelect
        value={existingData}
        onChange={handleOnChange}
        getOptionLabel={(option) => option.name}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        renderOption={(props, option, { selected }) => (
            <li {...props}>
                <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    style={{ marginRight: 8 }}
                    checked={selected}
                />
                {option.name}
            </li>
        )}
        renderInput={(params) => (
            <TextField
                {...params}
                label="Food Items"
                placeholder="Select food items"
                InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                        <>
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                            {params.InputProps.startAdornment}
                        </>
                    ),
                }}
            />
        )}
        PaperComponent={({ children }) => (
            <Paper style={{ maxHeight: 400, overflowY: 'auto' }}>
                {children}
            </Paper>
        )}
        ListboxProps={{
            style: {
                maxHeight: 'calc(400px - 56px)', // Subtract the height of the search bar
                overflowY: 'auto',
            },
        }}
        sx={{ width: '100%', mt: 2 }}
    />


                                        <Grid item>
                                            <Typography variant="caption">Couldn't find the food? Just Add one from the right button.</Typography>
                                        </Grid>
                                        <div>
                                            <h1>Reviews</h1>


                                            <FoodReviews
                                                food={foodList}
                                                reviews={reviewsData}
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <></>
                                )}


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

const FoodReviews = ({ reviews }) => {
    const [selectedFoodId, setSelectedFoodId] = useState(null);
    const [foodReviews, setFoodReviews] = useState([]);

    useEffect(() => {
        // Function to filter reviews based on food ID
        const getReviewsForFood = (foodId) => {
            return reviews.find((foodReview) => foodReview.FoodDetail.id === foodId)?.Reviews || [];
        };

        // Get reviews for the selected food
        if (selectedFoodId !== null) {
            const reviewsForFood = getReviewsForFood(selectedFoodId);
            setFoodReviews(reviewsForFood);
        }
    }, [selectedFoodId, reviews]);

    // Extract unique reasons from all reviews
    const allReasons = Array.from(
        new Set(
            reviews
                .flatMap((foodReview) => foodReview.Reviews)
                .filter((review) => review.reason) // Filter out reviews with undefined or null reason
                .flatMap((review) => JSON.parse(review.reason))
        )
    );
    // Extract unique reasons from reviews
    const reasons = Array.from(
        new Set(
            foodReviews
                .filter((review) => review.reason) // Filter out reviews with undefined or null reason
                .flatMap((review) => JSON.parse(review.reason))
        )
    );
    // Calculate overall reason counts
    const overallReasonCounts = allReasons.reduce((counts, reason) => {
        counts[reason] = reviews.reduce((total, foodReview) => {
            const foodReviewReasonCounts = foodReview.Reviews.filter((review) =>
                JSON.parse(review.reason).includes(reason)
            ).length;
            return total + foodReviewReasonCounts;
        }, 0);
        return counts;
    }, {});

    // Calculate reason counts
    const reasonCounts = reasons.reduce((counts, reason) => {
        counts[reason] = foodReviews.filter((review) =>
            JSON.parse(review.reason).includes(reason)
        ).length;
        return counts;
    }, {});

    // Calculate total review count for the selected food
    const totalReviewCountForSelectedFood =
        selectedFoodId !== null
            ? reviews.find((foodReview) => foodReview.FoodDetail.id === selectedFoodId)?.Reviews.length || 0
            : 0;

    // Calculate average rating for the selected food
    const averageRatingForSelectedFood =
        selectedFoodId !== null
            ? foodReviews.reduce((sum, review) => sum + review.point, 0) / totalReviewCountForSelectedFood || 0
            : 0;

    return (
        <Grid container spacing={3}>
            <Grid item xs={6}>
                <label>
                    Select Food:
                    <select
                        value={selectedFoodId || ""}
                        onChange={(e) => setSelectedFoodId(parseInt(e.target.value, 10) || null)}
                    >
                        <option value="">-- Select --</option>
                        {reviews.map((foodReview) => (
                            <option key={foodReview.FoodDetail.id} value={foodReview.FoodDetail.id}>
                                {foodReview.FoodDetail.name}
                            </option>
                        ))}
                    </select>
                </label>

                {selectedFoodId !== null && (
                    <div>
                        <h2>Food Reviews for {reviews.find((foodReview) => foodReview.FoodDetail.id === selectedFoodId)?.FoodDetail.name}</h2>
                        <p>Total Reviews: {totalReviewCountForSelectedFood}</p>

                        {foodReviews.map((review) => (
                            <div key={review.id}>
                                <p>User: {review.UserInfo ? `${review.UserInfo.first_name} ${review.UserInfo.last_name}` : "N/A"}</p>
                                <Box component="fieldset" borderColor="transparent">
                                    <Rating name="read-only" value={review.point} readOnly />
                                </Box>
                                <p>Reasons: {review.reason ? JSON.parse(review.reason).join(", ") : "N/A"}</p>
                                <p>Description: {review.description || "N/A"}</p>
                                <hr />
                            </div>
                        ))}
                    </div>
                )}
            </Grid>

            <Grid item xs={6}>
                <p>Average Rating:
                    <Box component="fieldset" borderColor="transparent">
                        <Rating name="read-only" value={averageRatingForSelectedFood} readOnly />
                    </Box>
                </p>

                <h3>Reason Counts:</h3>

                <ul>
                    {reasons.map((reason) => (
                        <li key={reason}>
                            {reason}: {reasonCounts[reason]}
                        </li>
                    ))}
                </ul>
            </Grid>
        </Grid>
    );
};
export default EditMenuItem;




