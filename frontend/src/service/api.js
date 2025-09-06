import axios from "axios";

//axios instance
const API = axios.create({
    baseURL: 'http://localhost:4000/api', // Backend URL
    withCredentials: true, // Include cookies for session management
});

//auth api
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const logoutUser = () => API.post('/auth/logout');
export const getProfile = () => API.get('/profile');

export default API;

