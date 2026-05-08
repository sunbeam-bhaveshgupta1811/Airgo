import axios from 'axios'
import { config } from '../../../config'

const getAuthHeaders = () => {
  const token = sessionStorage.getItem('jwt')
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
}
export const fetchAllAirlines = async () => {
  try {
    const response = await axios.get(
      `${config.serverURL}/admin/airlines`,
      getAuthHeaders()
    )
    return response.data?.data || []
  } catch (error) {
    console.error('Error fetching airlines:', error)
    return []
  }
}
export const fetchActiveAirlines = async () => {
  try {
    const response = await axios.get(`${config.serverURL}/api/airlines`)
    return response.data?.data || []
  } catch (error) {
    console.error('Error fetching active airlines:', error)
    return []
  }
}
export const addAirline = async (airlineData) => {
  const payload = {
    name: airlineData.name,
    code: airlineData.code,
    country: airlineData.country,
    contactEmail: airlineData.contactEmail || '',
    contactPhone: airlineData.contactPhone || '',
    logoUrl: airlineData.logoUrl || ''
  }

  try {
    const response = await axios.post(
      `${config.serverURL}/admin/airlines`,
      payload,
      getAuthHeaders()
    )
    return response.data
  } catch (error) {
    console.error('Error adding airline:', error)
    throw error
  }
}
export const updateAirline = async (id, airlineData) => {
  const payload = {
    name: airlineData.name,
    code: airlineData.code,
    country: airlineData.country,
    contactEmail: airlineData.contactEmail || '',
    contactPhone: airlineData.contactPhone || '',
    logoUrl: airlineData.logoUrl || ''
  }

  try {
    const response = await axios.put(
      `${config.serverURL}/admin/airlines/${id}`,
      payload,
      getAuthHeaders()
    )
    return response.data
  } catch (error) {
    console.error('Error updating airline:', error)
    throw error
  }
}

export const deactivateAirline = async (id) => {
  try {
    const response = await axios.patch(
      `${config.serverURL}/admin/airlines/${id}/deactivate`,
      {},
      getAuthHeaders()
    )
    return response.data
  } catch (error) {
    console.error('Error deactivating airline:', error)
    throw error
  }
}

export const reactivateAirline = async (id) => {
  try {
    const response = await axios.patch(
      `${config.serverURL}/admin/airlines/${id}/reactivate`,
      {},
      getAuthHeaders()
    )
    return response.data
  } catch (error) {
    console.error('Error reactivating airline:', error)
    throw error
  }
}
