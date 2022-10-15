import PropTypes from 'prop-types';
import { createContext, useEffect, useReducer } from 'react';

// third-party
import { Chance } from 'chance';
import jwtDecode from 'jwt-decode';

import { openSnackbar } from 'store/slices/snackbar';
import { useDispatch } from 'react-redux';

// reducer - state management
import { LOGIN, LOGOUT } from 'store/actions';
import accountReducer from 'store/accountReducer';

// project imports
import Loader from 'ui-component/Loader';
import axios from 'utils/axios';

const chance = new Chance();

// constant
const initialState = {
    isLoggedIn: false,
    isInitialized: false,
    user: null
};

const verifyToken = (serviceToken) => {
    if (!serviceToken) {
        return false;
    }
    const decoded = jwtDecode(serviceToken);
    /**
     * Property 'exp' does not exist on type '<T = unknown>(token, options?: JwtDecodeOptions | undefined) => T'.
     */
    return decoded.exp > Date.now() / 1000;
};

const setSession = (serviceToken) => {
    if (serviceToken) {
        localStorage.setItem('serviceToken', serviceToken);
        axios.defaults.headers.common.Authorization = `Bearer ${serviceToken}`;
    } else {
        localStorage.removeItem('serviceToken');
        localStorage.removeItem('university');
        localStorage.removeItem('id');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common.Authorization;
    }
};

// ==============================|| JWT CONTEXT & PROVIDER ||============================== //
const JWTContext = createContext(null);

export const JWTProvider = ({ children }) => {
    const [state, dispatch] = useReducer(accountReducer, initialState);
    const doDispatch = useDispatch();

    useEffect(() => {
        const init = async () => {
            try {
                const serviceToken = window.localStorage.getItem('serviceToken');
                if (serviceToken && verifyToken(serviceToken)) {
                    setSession(serviceToken);
                    const response = await axios.get('/users/me');
                    const { user } = response.data;
                    dispatch({
                        type: LOGIN,
                        payload: {
                            isLoggedIn: true,
                            user
                        }
                    });
                } else {
                    dispatch({
                        type: LOGOUT
                    });
                }
            } catch (err) {
                console.error(err);
                dispatch({
                    type: LOGOUT
                });
            }
        };

        init();
    }, []);

    const login = async (email, password) => {
        const response = await axios
            .post('/auth/signin', { email, password })
            .then((response) => {
                const { serviceToken, user } = response.data;
                window.localStorage.setItem('university', JSON.stringify(response.data.university[0]));
                window.localStorage.setItem('id', JSON.stringify(response.data.id));
                window.localStorage.setItem('user', JSON.stringify(response.data.user));
                console.log(response);
                setSession(serviceToken);
                doDispatch(
                    openSnackbar({
                        open: true,
                        message: 'Welcome Back!',
                        variant: 'alert',
                        alert: {
                            color: 'success'
                        },
                        close: true
                    })
                );
                dispatch({
                    type: LOGIN,
                    payload: {
                        isLoggedIn: true,
                        user
                    }
                });
            })
            .catch((error) => {
                console.log(error.data.message);
                doDispatch(
                    openSnackbar({
                        open: true,
                        message: error.data.message,
                        variant: 'alert',
                        alert: {
                            color: 'error'
                        },
                        close: true
                    })
                );
            });
    };

    const register = async ({ email, password, firstName, lastName, university }) => {
        // todo: this flow need to be recode as it not verified
        // const id = chance.bb_pin();
        const response = await axios.post('/auth/signup', {
            email,
            password,
            firstName,
            lastName,
            university
        });
        let users = response.data;

        if (window.localStorage.getItem('users') !== undefined && window.localStorage.getItem('users') !== null) {
            const localUsers = window.localStorage.getItem('users');
            users = [
                ...JSON.parse(localUsers),
                {
                    email,
                    password,
                    name: `${firstName} ${lastName}`
                }
            ];
        }

        window.localStorage.setItem('users', JSON.stringify(users));
    };

    const logout = () => {
        setSession(null);
        dispatch({ type: LOGOUT });
    };

    const resetPassword = (email) => console.log(email);

    const updateProfile = () => {};

    if (state.isInitialized !== undefined && !state.isInitialized) {
        return <Loader />;
    }

    return (
        <JWTContext.Provider value={{ ...state, login, logout, register, resetPassword, updateProfile }}>{children}</JWTContext.Provider>
    );
};

JWTProvider.propTypes = {
    children: PropTypes.node
};

export default JWTContext;
