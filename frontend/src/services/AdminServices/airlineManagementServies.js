import axios from 'axios'
import { config } from '../../../config';
import { toast } from 'react-toastify';

export const fetchAirline = async () => {
  try {
    const response = await axios.get(`${config.serverURL}/admin/airlineManagement`);
    return response.data;
  } catch (error) {
    console.error('Error fetching airline count:', error);
    return 0;
  }
};

export const addAirline = async (airlineName, airlineNoOfFlights) => {

  const airlineData = {
    name: airlineName,
    noOfFlights: airlineNoOfFlights,
    admin_id: 1
  };

  try {
    const response = await axios.post(`${config.serverURL}/admin/addairline`, airlineData);
    return response.data;
  } catch (error) {
    console.error('Error adding airline:', error);
    throw error;
  }
}

export const deleteAirline = async (airlineId) => {
  try {
    const response = await axios.delete(`${config.serverURL}/admin/deleteairline/${airlineId}`);
    toast.success("Airline deleted successfully");
    return response.data;
  } catch (error) {
    toast.error("Failed to delete airline");
    console.error(error);
  }
};

