import axios from 'axios'
import { config } from '../../../config'

const getAuthHeaders = () => {
  const token = sessionStorage.getItem('jwt')
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json' 
    }
  }
}

export const fetchAllFlights = async () => {
  try {
    const response = await axios.get(
      `${config.serverURL}/admin/flights`,
      getAuthHeaders()
    )
    return response.data?.data || []
  } catch (error) {
    console.error('Error fetching flights:', error.response?.data || error.message)
    throw error
  }
}

export const fetchAirlinesForDropdown = async () => {
  try {
    const response = await axios.get(`${config.serverURL}/api/airlines`)
    return response.data?.data || []
  } catch (error) {
    console.error('Error fetching airlines for dropdown:', error.response?.data || error.message)
    throw error
  }
}

export const fetchAirportsForDropdown = async () => {
  try {
    const response = await axios.get(`${config.serverURL}/api/airports`)
    return response.data?.data || []
  } catch (error) {
    console.error('Error fetching airports:', error.response?.data || error.message)
    throw error
  }
}

export const createFlight = async (flightData) => {
  const payload = {
    flightNumber: flightData.flightNumber,
    airlineId: flightData.airlineId,
    originAirportId: flightData.originAirportId,
    destinationAirportId: flightData.destinationAirportId,
    durationMinutes: flightData.durationMinutes
  }

  try {
    const response = await axios.post(
      `${config.serverURL}/admin/flights`,
      payload,
      getAuthHeaders()
    )
    return response.data
  } catch (error) {
    console.error('Error adding flight:', error.response?.data || error.message)
    throw error
  }
}

export const updateFlight = async (id, flightData) => {
  try {
    const response = await axios.put(
      `${config.serverURL}/admin/flights/${id}`,
      flightData,
      getAuthHeaders()
    )
    return response.data
  } catch (error) {
    console.error('Error updating flight:', error.response?.data || error.message)
    throw error
  }
}

export const deactivateFlight = async (id) => {
  try {
    const response = await axios.patch(
      `${config.serverURL}/admin/flights/${id}/deactivate`,
      {},
      getAuthHeaders()
    )
    return response.data
  } catch (error) {
    console.error('Error deactivating flight:', error.response?.data || error.message)
    throw error
  }
}
