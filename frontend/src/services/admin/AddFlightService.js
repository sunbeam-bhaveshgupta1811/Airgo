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
    const msg = error.response?.data?.message || 'Failed to fetch flights'
    throw new Error(msg)
  }
}

export const fetchAirlinesForDropdown = async () => {
  try {
    const response = await axios.get(`${config.serverURL}/api/airlines`)
    return response.data?.data || []
  } catch (error) {
    const msg = error.response?.data?.message || 'Failed to fetch airlines'
    throw new Error(msg)
  }
}

export const fetchAirportsForDropdown = async () => {
  try {
    const response = await axios.get(`${config.serverURL}/api/airports`)
    return response.data?.data || []
  } catch (error) {
    const msg = error.response?.data?.message || 'Failed to fetch airports'
    throw new Error(msg)
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
    const msg = error.response?.data?.message || 'Failed to add flight'
    throw new Error(msg)
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
    const msg = error.response?.data?.message || 'Failed to update flight'
    throw new Error(msg)
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
    const msg = error.response?.data?.message || 'Failed to deactivate flight'
    throw new Error(msg)
  }
}
