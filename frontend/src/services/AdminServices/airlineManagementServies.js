import axios from 'axios';
import { config } from '../../../config';

const getAuthHeaders = () => {
  const token = sessionStorage.getItem('jwt');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const fetchAirline = async () => {
  try {
    const response = await axios.get(
      `${config.serverURL}/admin/airlineManagement`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching airlines:', error);
    return [];
  }
};

export const deleteAirline = async (id) => {
  try {
    const response = await axios.get(
      `${config.serverURL}/admin/deleteairline/${id}`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting airline:', error);
    throw error;
  }
};

export const addAirline = async (airlineName, airlineNoOfFlights) => {
  const airlineData = {
    name: airlineName,
    noOfFlights: airlineNoOfFlights,
    admin_id: sessionStorage.getItem('adminId'),
  };

  try {
    const response = await axios.post(
      `${config.serverURL}/admin/addairline`,
      airlineData,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Error adding airline:', error);
    throw error;
  }
};
