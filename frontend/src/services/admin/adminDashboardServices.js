import axios from 'axios'
import { config } from '../../../config'

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${sessionStorage.getItem('jwt')}`
  }
})

export const getDashboardStats = async () => {
  try {
    const response = await axios.get(
      `${config.serverURL}/admin/dashboard/stats`,
      getAuthHeaders()
    )
    const stats = response.data?.data || {}
    return {
      airlineCount: stats.airlineCount || 0,
      flightCount: stats.flightCount || 0,
      bookingCount: stats.bookingCount || 0,
      totalRevenue: stats.totalRevenue || 0
    }
  } catch (error) {
    const msg = error.response?.data?.message || 'Failed to fetch dashboard stats'
    throw new Error(msg)
  }
}
