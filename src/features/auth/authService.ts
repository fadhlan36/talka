import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = `http://localhost:3000/api/v1/auth`;

// 1. LOGIN MANUAL (EMAIL & PASSWORD)
export const loginAPI = async (userData: any) => {
    const response = await axios.post(`${API_URL}/login`, userData);
    return response.data;
};

// 2. REGISTER MANUAL
export const registerAPI = async (userData: any) => {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
};

// 3. GOOGLE LOGIN (MENUKAR TOKEN GOOGLE DENGAN JWT TALKA)
export const googleLoginAPI = async (googleToken: string) => {
    const response = await axios.post(`${API_URL}/google-login`, {
        token: googleToken
    });
    return response.data;
};

// 4. EDIT PROFILE (UPDATE DATA USER — PAKAI FORMDATA KARENA ADA FOTO)
export const editProfileAPI = async (formData: FormData) => {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_URL}/edit-profile`, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data', // wajib karena ada file foto
        }
    });
    toast.success("Edit profile berhasil!")
    return response.data;
};