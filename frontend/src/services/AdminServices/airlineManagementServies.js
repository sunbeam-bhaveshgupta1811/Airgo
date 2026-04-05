import axios from 'axios'
import { config } from '../../../config';

export const fetchAirline = async () => {
  try {
    const response = await axios.get(`${config.serverURL}/admin/airlineManagement`);
    return response.data;
  } catch (error) {
    console.error('Error fetching airline count:', error);
    return 0;
  }
};


export const deleteAirline = async (id) => {
  try {
    const response = await axios.get(`${config.serverURL}/admin/deleteairline/${id}`);
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
    admin_id: localStorage.getItem("adminId")
  };

  try {
    const response = await axios.post(`${config.serverURL}/admin/addairline`, airlineData);
    return response.data;
  } catch (error) {
    console.error('Error adding airline:', error);
    throw error;
  }
}