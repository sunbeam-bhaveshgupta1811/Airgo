import axios from 'axios'
import { config } from '../../../config'

export const searchFlights = async (from, to, journeyDate, passengers = 1, filters = {}) => {
  try {
    const body = {
      originCode: from,
      destinationCode: to,
      journeyDate: journeyDate,
      passengers: passengers
    }

    // Add optional filters
    if (filters.travelClass) body.travelClass = filters.travelClass
    if (filters.minPrice) body.minPrice = parseFloat(filters.minPrice)
    if (filters.maxPrice) body.maxPrice = parseFloat(filters.maxPrice)
    if (filters.sortBy) body.sortBy = filters.sortBy
    if (filters.tripType) body.tripType = filters.tripType
    if (filters.returnDate) body.returnDate = filters.returnDate

    const response = await axios.post(
      `${config.serverURL}/api/flights/search`,
      body
    )
    return response.data?.data || []

  } catch (error) {
    const msg = error.response?.data?.message || 'Failed to search flights'
    throw new Error(msg)
  }
}

export const fetchAirports = async () => {
  try {
    const response = await axios.get(`${config.serverURL}/api/airports`)
    return response.data?.data || []
  } catch (error) {
    const msg = error.response?.data?.message || 'Failed to fetch airports'
    throw new Error(msg)
  }
}

export const searchRoundTripFlights = async (from, to, journeyDate, returnDate, passengers = 1, filters = {}) => {
  try {
    const body = {
      originCode: from,
      destinationCode: to,
      journeyDate: journeyDate,
      passengers: passengers,
      tripType: 'ROUND_TRIP',
      returnDate: returnDate
    }

    if (filters.travelClass) body.travelClass = filters.travelClass
    if (filters.minPrice) body.minPrice = parseFloat(filters.minPrice)
    if (filters.maxPrice) body.maxPrice = parseFloat(filters.maxPrice)
    if (filters.sortBy) body.sortBy = filters.sortBy

    const response = await axios.post(
      `${config.serverURL}/api/flights/search/roundtrip`,
      body
    )
    return response.data?.data || { outboundFlights: [], returnFlights: [] }

  } catch (error) {
    const msg = error.response?.data?.message || 'Failed to search round trip flights'
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
    const msg = error.response?.data?.message || 'Failed to fetch schedule'
    throw new Error(msg)
  }
}
