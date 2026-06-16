import axios from "axios";
import { config } from "../../../config";

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${sessionStorage.getItem("jwt")}`,
  },
});

export const submitCustomerFeedBack = async (bookingId, rating, comments) => {
  try {
    const response = await axios.post(
      `${config.serverURL}/user/feedback`,
      { bookingId, rating, comments },
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    const msg = error.response?.data?.message || "Failed to submit feedback";
    throw new Error(msg);
  }
};

export const getMyFeedbacks = async () => {
  try {
    const response = await axios.get(
      `${config.serverURL}/user/feedback/my`,
      getAuthHeaders()
    );
    return response.data || [];
  } catch (error) {
    const msg = error.response?.data?.message || "Failed to fetch feedbacks";
    throw new Error(msg);
  }
};

export const getAllFeedbacks = async () => {
  try {
    const response = await axios.get(
      `${config.serverURL}/admin/feedback`,
      getAuthHeaders()
    );
    return response.data || [];
  } catch (error) {
    const msg = error.response?.data?.message || "Failed to fetch feedbacks";
    throw new Error(msg);
  }
};
