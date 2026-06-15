import axios from 'axios'
import { config } from '../../../config'

export const searchFlights = async (from, to, journeyDate, passengers = 1) => {
  try {
    const response = await axios.post(
      `${config.serverURL}/api/flights/search`,
      {
        originCode: from,               
        destinationCode: to,
        journeyDate: journeyDate,      
        passengers: passengers
      }
    )
    return response.data?.data || []

  } catch (error) {
    console.error('Error searching flights:', error)
    const msg = error.response?.data?.message || 'Failed to search flights'
    throw new Error(msg)
  }
}

export const fetchAirports = async () => {
  try {
    const response = await axios.get(`${config.serverURL}/api/airports`)
    return response.data?.data || []
  } catch (error) {
    console.error('Error fetching airports:', error)
    const msg = error.response?.data?.message || 'Failed to fetch airports'
    throw new Error(msg)
  }
}

export const getScheduleById = async (scheduleId) => {
  try {
    const response = await axios.get(
      `${config.serverURL}/api/flights/schedules/${scheduleId}`
    )
    return response.data?.data || null
  } catch (error) {
    console.error('Error fetching schedule:', error)
    const msg = error.response?.data?.message || 'Failed to fetch schedule'
    throw new Error(msg)
  }
}
