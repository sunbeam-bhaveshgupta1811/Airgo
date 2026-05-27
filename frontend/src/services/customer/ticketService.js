import axios from 'axios'
import { config } from '../../../config'

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${sessionStorage.getItem('jwt')}`,
    'Content-Type': 'application/json'
  }
})

export const getBookingById = async (bookingId) => {
  try {
    const response = await axios.get(
      `${config.serverURL}/bookings/${bookingId}`,
      getAuthHeaders()
    )
    return response.data?.data || null

  } catch (error) {
    console.error('Error fetching booking:', error)
    if (error.response) {
      const msg = error.response.data?.message || `Server error: ${error.response.status}`
      throw new Error(msg)
    } else if (error.request) {
      throw new Error('Network error. Please check your connection.')
    } else {
      throw new Error(error.message || 'Failed to fetch booking')
    }
  }
}
export const generateTicketPDF = async (bookingId) => {
  try {
    const response = await axios.get(
      `${config.serverURL}/bookings/${bookingId}/pdf`,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('jwt')}`
        },
        responseType: 'blob'
      }
    )

    if (response.status === 200) {
      const blob = new Blob([response.data], { type: 'application/pdf' })
      if (blob.size === 0) throw new Error('Empty PDF file received')
      return blob
    } else {
      throw new Error('Failed to generate PDF')
    }

  } catch (error) {
    console.error('Error generating PDF:', error)
    if (error.response?.status === 404) throw new Error('Booking not found')
    if (error.response?.status === 401) throw new Error('Not authorized')
    throw new Error(error.message || 'PDF generation failed')
  }
}

export const sendBookingConfirmationEmail = async (bookingId) => {
  try {
    const response = await axios.post(
      `${config.serverURL}/bookings/${bookingId}/email`,
      {},
      getAuthHeaders()
    )
    return response.data
  } catch (error) {
    console.error('Error sending booking confirmation email:', error)
    if (error.response?.status === 404) throw new Error('Booking not found')
    if (error.response?.status === 401) throw new Error('Not authorized')
    throw new Error(error.response?.data?.message || 'Failed to send email')
  }
}

export const getPaymentByBookingId = async (bookingId) => {
  try {
    const response = await axios.get(
      `${config.serverURL}/payments/booking/${bookingId}`,
      getAuthHeaders()
    )
    return response.data?.data || null

  } catch (error) {
    console.error('Error fetching payment:', error)
    return null
  }
}
