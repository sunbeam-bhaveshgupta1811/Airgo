import axios from 'axios'
import { config } from '../../../config'

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${sessionStorage.getItem('jwt')}`,
    'Content-Type': 'application/json'
  }
})

export const createBooking = async (scheduleId, numberOfPassengers) => {
  try {
    const response = await axios.post(
      `${config.serverURL}/bookings/create`,
      {
        scheduleId,          
        numberOfPassengers   
      },
      getAuthHeaders()
    )
    return response.data?.data || null

  } catch (error) {
    console.error('Error creating booking:', error)
    const msg = error.response?.data?.message || 'Failed to create booking'
    throw new Error(msg)
  }
}

export const addPassengers = async (bookingId, passengers) => {
  try {
    const payload = passengers.map(p => ({
      firstName: p.firstName,
      lastName: p.lastName,
      gender: (p.gender || 'MALE').toUpperCase(),
      dateOfBirth: p.dateOfBirth,    // format: YYYY-MM-DD
      idType: (p.idType || 'PASSPORT').toUpperCase(),
      idNumber: p.idNumber
    }))

    const response = await axios.post(
      `${config.serverURL}/bookings/${bookingId}/passengers`,
      payload,
      getAuthHeaders()
    )
    return response.data?.data || null

  } catch (error) {
    console.error('Error adding passengers:', error)
    const msg = error.response?.data?.message || 'Failed to add passengers'
    throw new Error(msg)
  }
}

export const makePayment = async (bookingId, paymentMethod = 'CREDIT_CARD') => {
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
    console.error('Error processing payment:', error)
    const msg = error.response?.data?.message || 'Payment failed'
    throw new Error(msg)
  }
}

export const processFullBooking = async ({ scheduleId, numberOfPassengers, passengers, paymentMethod }) => {
  const booking = await createBooking(scheduleId, numberOfPassengers)
  if (!booking) throw new Error('Failed to create booking')

  const bookingId = booking.id

  await addPassengers(bookingId, passengers)

  const payment = await makePayment(bookingId, paymentMethod)

  return {
    booking,
    payment,
    bookingReference: booking.bookingReference,
    transactionId: payment?.transactionId,
    success: payment?.status === 'SUCCESS'
  }
}

export const getMyBookings = async () => {
  try {
    const response = await axios.get(
      `${config.serverURL}/bookings/my`,
      getAuthHeaders()
    )
    return response.data?.data || []
  } catch (error) {
    console.error('Error fetching bookings:', error)
    const msg = error.response?.data?.message || 'Failed to fetch bookings'
    throw new Error(msg)
  }
}

export const getBookingById = async (bookingId) => {
  try {
    const response = await axios.get(
      `${config.serverURL}/bookings/${bookingId}`,
      getAuthHeaders()
    )
    return response.data?.data || null
  } catch (error) {
    console.error('Error fetching booking:', error)
    const msg = error.response?.data?.message || 'Failed to fetch booking'
    throw new Error(msg)
  }
}

export const getBookingByReference = async (reference) => {
  try {
    const response = await axios.get(
      `${config.serverURL}/bookings/reference/${reference}`,
      getAuthHeaders()
    )
    return response.data?.data || null
  } catch (error) {
    console.error('Error fetching booking:', error)
    const msg = error.response?.data?.message || 'Failed to fetch booking'
    throw new Error(msg)
  }
}

export const cancelBooking = async (bookingId) => {
  try {
    const response = await axios.patch(
      `${config.serverURL}/bookings/${bookingId}/cancel`,
      {},
      getAuthHeaders()
    )
    return response.data
  } catch (error) {
    console.error('Error cancelling booking:', error)
    const msg = error.response?.data?.message || 'Failed to cancel booking'
    throw new Error(msg)
  }
}
