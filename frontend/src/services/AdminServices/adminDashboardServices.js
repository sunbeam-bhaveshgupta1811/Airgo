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


export const getAirlineCount = async () => {
  try {
    const response = await axios.get(
      `${config.serverURL}/admin/airlines/count`,
      getAuthHeaders()
    );
    if (response.data && typeof response.data === 'number') {
      return response.data;
    }
  } catch (error) {
    console.error('Error fetching airline count:', error);
    return 0;
  }
};

export const getFlightCount = async () => {
  try {
    const response = await axios.get(
      `${config.serverURL}/admin/airlines/flightcount`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching flight count:', error);
    return 0;
  }
};

export const getBookingCount = async () => {
  try {
    const response = await axios.get(
      `${config.serverURL}/admin/airlines/bookingcount`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching booking count:', error);
    return 0;
  }
};

export const getTotalAmountBooking = async () => {
  try {
    const response = await axios.get(
      `${config.serverURL}/admin/airlines/totalAmountBooking`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching total amount booking:', error);
    return 0;
  }
};
