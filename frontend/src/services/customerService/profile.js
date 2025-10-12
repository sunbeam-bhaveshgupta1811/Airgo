import axios from 'axios';
import { config } from '../../../config';

export async function getProfileData() {
  try {
    const response = await axios.get(`${config.serverURL}/profile`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('jwt')}`,
      },
    });

    if (response.status === 200) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error('Error fetching profile data:', error);
    return null;
  }
}
export async function updateProfileData(profileData) {
  try {
    const response = await axios.put(
      `${config.serverURL}/profile`,
      profileData,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('jwt')}`,
        },
      }
    );
    return response.status === 200;
  } catch (error) {
    console.error('Error updating profile data:', error);
    return false;
  }
}