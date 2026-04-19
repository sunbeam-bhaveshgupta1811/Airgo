import axios from 'axios';
import { toast } from 'react-toastify';
import { config } from './../../../config';


export const getProfileData = async () => {
    try {
        const response = await axios.get(`${config.serverURL}/profile`, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching profile data:', error);
        toast.error('Failed to fetch profile data');
        return null;
    }
}