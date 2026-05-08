import axios from 'axios'
import { config } from '../../../config'
import { toast } from 'react-toastify'

export async function registerUser(firstName, lastName, email, phone, password) {
  try {
    const url = `${config.serverURL}/api/auth/signup`
    const body = { firstName, lastName, email, phone, password, confirmPassword: password }
    const response = await axios.post(url, body)

    if (response.status !== 200 && response.status !== 201) {
      return { success: false, message: 'Error occurred', status: response.status }
    }
    return response.data

  } catch (error) {
    console.error('registerUser error:', error)
    if (error.response) {
      return {
        success: false,
        status: error.response.status,
        message: error.response.data?.message || 'Error occurred'
      }
    }
    return { success: false, message: 'Network error' }
  }
}

export async function login(email, password) {
  try {
    const url = `${config.serverURL}/api/auth/login`
    const body = { email, password }

    const response = await axios.post(url, body)
    if (response.status === 200) {
      return response.data
    }
    return null

  } catch (ex) {
    if (ex.response && ex.response.data) {
      console.error('Backend error:', ex.response.data)
      return ex.response.data
    }
    console.error('Network or unexpected error:', ex)
    return { success: false, message: 'Something went wrong. Please try again later.' }
  }
}

export async function forgotPasswordApi(email) {
  try {
    const response = await axios.post(`${config.serverURL}/api/auth/forgot-password`, { email })
    if (response.status !== 200 && response.status !== 201) {
      return { success: false, message: response.data?.message || 'Error sending reset link' }
    }
    return response.data

  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Error sending reset link'
    }
  }
}

export async function resetPasswordApi(token, newPassword, confirmPassword) {
  try {
    const response = await axios.post(`${config.serverURL}/api/auth/reset-password`, {
      token,
      newPassword,
      confirmPassword
    })
    if (response.status !== 200 && response.status !== 201) {
      return { success: false, message: response.data?.message || 'Error resetting password' }
    }
    return response.data

  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Error resetting password'
    }
  }
}

export async function verifyEmailApi(token) {
  try {
    const response = await axios.get(`${config.serverURL}/api/auth/verify-email`, {
      params: { token }
    })
    return response.data

  } catch (error) {
    console.error('Verify email error:', error)
    return {
      success: false,
      message: error.response?.data?.message || 'Error verifying email'
    }
  }
}

export async function resendVerificationApi(email) {
  try {
    const response = await axios.post(
      `${config.serverURL}/api/auth/resend-verification`,
      null,
      { params: { email } }
    )
    return response.data

  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Error resending verification email'
    }
  }
}
