/* eslint-disable */
/**
 * axios setup to use mock service
 */

import axios from 'axios';
// const API_URL = process.env.REACT_APP_API_URL;
// console.log(`Your port is ${API_URL}`);

const axiosServices = axios.create({
    baseURL: 'https://env-0216910.cloudjiffy.net/'
    // baseURL: 'http://localhost:3000/'
});

// interceptor for http
axiosServices.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response.status === 401) {
            localStorage.removeItem('serviceToken');
            localStorage.removeItem('university');
            localStorage.removeItem('id');
            localStorage.removeItem('user');
            location.reload('/');
        } else {
            return Promise.reject(error.response || error.message);
        }
        return Promise.reject(error.response || error.message);
    }
    //     (error) => {
    //         if (error.response.status === 401) {
    //             localStorage.removeItem('serviceToken');
    //             localStorage.removeItem('university');
    //             localStorage.removeItem('id');
    //             localStorage.removeItem('user');
    //             location.reload('/');
    //         } else {
    //             Promise.reject(console.log(error.response && error.response.data) || 'Wrong Services');
    //         }
    //         Promise.reject(console.log(error.response && error.response.data) || 'Wrong Services');
    //     }
);

export default axiosServices;
