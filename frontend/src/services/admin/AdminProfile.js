import axios from 'axios';
import { config } from './../../../config';

const getAuthHeaders = () => ({
    headers: {
        Authorization: `Bearer ${sessionStorage.getItem('jwt')}`,
        'Content-Type': 'application/json',
    }
});

export const getProfileData = async () => {
    try {
        const response = await axios.get(
            `${config.serverURL}/user/profile`,
            getAuthHeaders()
        );
        return response.data?.data || null;
    } catch (error) {
        console.error('Error fetching profile data:', error);
        const msg = error.response?.data?.message || 'Failed to fetch profile data';
        throw new Error(msg);
    }
}
