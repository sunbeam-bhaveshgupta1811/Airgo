import axios from "axios";
import { config } from "../../../config";

export const submitCustomerFeedBack = async (userId, bookingId, rating, comment) => {
  try {
    const payload = {
      user_id: userId,
      booking_id: bookingId,
      rating,
      comments: comment,
    };
    const url = `${config.serverURL}/customer/feedback`
    const response = await axios.post(url, payload);
    return response.data;
  } catch (error) {
    console.error("Submit feedback error:", error);
    return null;
  }
};
