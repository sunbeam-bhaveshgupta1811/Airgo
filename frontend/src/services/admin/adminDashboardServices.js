import axios from 'axios'
import { config } from '../../../config'

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${sessionStorage.getItem('jwt')}`
  }
})
export const getAirlineCount = async () => {
  try {
    const response = await axios.get(
      `${config.serverURL}/admin/airlines`,
      getAuthHeaders()
    )
    const airlines = response.data?.data || []
    return airlines.length

  } catch (error) {
    console.error('Error fetching airline count:', error)
    return 0
  }
}
export const getActiveAirlineCount = async () => {
  try {
    const response = await axios.get(`${config.serverURL}/api/airlines`)
    const airlines = response.data?.data || []
    return airlines.length

  } catch (error) {
    console.error('Error fetching active airline count:', error)
    return 0
  }
}

export const getFlightCount = async () => {
  try {
    const response = await axios.get(
      `${config.serverURL}/admin/flights`,
      getAuthHeaders()
    )
    const flights = response.data?.data || []
    return flights.length

  } catch (error) {
    console.error('Error fetching flight count:', error)
    return 0
  }
}

export const getBookingCount = async () => {
  try {
    const response = await axios.get(
      `${config.serverURL}/admin/bookings`,
      getAuthHeaders()
    )
    const bookings = response.data?.data || []
    return bookings.length

  } catch (error) {
    console.error('Error fetching booking count:', error)
    return 0
  }
}

export const getTotalRevenue = async () => {
  try {
    const response = await axios.get(
      `${config.serverURL}/admin/bookings`,
      getAuthHeaders()
    )
    const bookings = response.data?.data || []
    const total = bookings
      .filter(b => b.status === 'CONFIRMED')
      .reduce((sum, b) => sum + (b.totalAmount || 0), 0)

    return total.toFixed(2)

  } catch (error) {
    console.error('Error fetching total revenue:', error)
    return '0.00'
  }
}

export const getDashboardStats = async () => {
  try {
    const [airlineCount, flightCount, bookingCount, revenue] = await Promise.all([
      getAirlineCount(),
      getFlightCount(),
      getBookingCount(),
      getTotalRevenue()
    ])

    return {
      airlineCount,
      flightCount,
      bookingCount,
      totalRevenue: revenue
    }

  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return {
      airlineCount: 0,
      flightCount: 0,
      bookingCount: 0,
      totalRevenue: '0.00'
    }
  }
}
