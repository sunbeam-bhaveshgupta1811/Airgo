import axios from 'axios'
import { config } from '../../../config'

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${sessionStorage.getItem('jwt')}`,
    'Content-Type': 'application/json'
  }
})

export const processPayment = async (bookingId, paymentMethod = 'CREDIT_CARD') => {
  try {
    const response = await axios.post(
      `${config.serverURL}/payments/pay`,
      {
        bookingId,
        paymentMethod: paymentMethod.toUpperCase()
      },
      getAuthHeaders()
    )
    return response.data?.data || null

  } catch (error) {
    console.error('Payment failed:', error)
    const msg = error.response?.data?.message || 'Payment failed. Please try again.'
    throw new Error(msg)
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
    const msg = error.response?.data?.message || 'Failed to fetch payment details'
    throw new Error(msg)
  }
}

export const getPaymentByTransactionId = async (transactionId) => {
  try {
    const response = await axios.get(
      `${config.serverURL}/payments/transaction/${transactionId}`,
      getAuthHeaders()
    )
    return response.data?.data || null

  } catch (error) {
    console.error('Error fetching payment by txn:', error)
    const msg = error.response?.data?.message || 'Failed to fetch payment'
    throw new Error(msg)
  }
}
