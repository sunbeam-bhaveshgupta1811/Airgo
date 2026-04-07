import axios from 'axios'
import { config } from '../../../config';
import { toast } from 'react-toastify';

export async function registerUser(
  title,
  firstName,
  lastName,
  email,
  phone,
  password
) {
  try {
    const url = `${config.serverURL}/auth/register`
    const body = { title, firstName, lastName, email, phone, password }
    const response = await axios.post(url, body)
    if(response.status != 200 && response.status != 201) {
      return { success: false, message: "Error occurred", status: response.status }
    }
    return response.data
  } catch (error) {
    console.log("exception: ", error)
    if (error.response) {
      return {
        success: false,
        status: error.response.status,
        message: error.response.data?.message || "Error occurred"
      }
    }
    return { success: false, message: "Network error" }
  }
}


export async function login(email, password, loginType) {
  try {
    const url = `${config.serverURL}/auth/login`
    const body = {
      email,
      password,
      loginType: loginType.toUpperCase(),
    }

    const response = await axios.post(url, body)
    if (response.status === 200) {
      return response.data
    }
    return null

  } catch (ex) {
    if (ex.response && ex.response.data) {
      console.error("Backend error:", ex.response.data)
      return ex.response.data 
    }
    console.error("Network or unexpected error:", ex)
    return { success: false, message: "Something went wrong. Please try again later." }
  }
}



export async function forgotPasswordApi(email) {
  try {
    const response = await axios.post(`${config.serverURL}/auth/forgot-password`, { email });
    if(response.status !== 200 && response.status !== 201) {
      return {
        success: false,
        message: response.data?.message || "Error sending reset link",
      };
    }
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Error sending reset link",
    };
  }
}


export async function resetPasswordWithOtpApi(email, otp, newPassword) {
  try {
    console.log(newPassword);
    const response = await axios.post(`${config.serverURL}/auth/reset-password`, { email, otp, newPassword });
    console.log("Reset password response:", response);
    if(response.status !== 200 && response.status !== 201) {
      return {
        success: false, 
        message: response.data?.message || "Error resetting password",
      };
    }
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Error resetting password",
    };
  }
}

export async function verifyEmailApi(token) {
  try {
    const response = await axios.get(`${config.serverURL}/auth/verify-user`, { params: { token } });
    return response.data;
  } catch (error) {
    console.log("Verify email error:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Error verifying email",
    };
  }
}