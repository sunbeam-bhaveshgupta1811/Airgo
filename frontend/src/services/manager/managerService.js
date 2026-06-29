import axios from 'axios'
import { config } from '../../../config'

const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${sessionStorage.getItem('jwt')}`, 'Content-Type': 'application/json' }
})

export const getManagerDashboardStats = async () => {
  const response = await axios.get(`${config.serverURL}/manager/dashboard/stats`, getAuthHeaders())
  return response.data?.data || {}
}

export const getMyAirport = async () => {
  const response = await axios.get(`${config.serverURL}/manager/my-airport`, getAuthHeaders())
  return response.data?.data || null
}

export const getMyTerminals = async () => {
  const response = await axios.get(`${config.serverURL}/manager/terminals`, getAuthHeaders())
  return response.data?.data || []
}

export const addTerminal = async (data) => {
  const response = await axios.post(`${config.serverURL}/api/terminals`, data, getAuthHeaders())
  return response.data?.data || null
}

export const updateTerminal = async (id, data) => {
  const response = await axios.put(`${config.serverURL}/api/terminals/${id}`, data, getAuthHeaders())
  return response.data?.data || null
}

export const deactivateTerminal = async (id) => {
  const response = await axios.patch(`${config.serverURL}/api/terminals/${id}/deactivate`, {}, getAuthHeaders())
  return response.data
}

export const reactivateTerminal = async (id) => {
  const response = await axios.patch(`${config.serverURL}/api/terminals/${id}/reactivate`, {}, getAuthHeaders())
  return response.data
}

export const getMyGates = async () => {
  const response = await axios.get(`${config.serverURL}/manager/gates`, getAuthHeaders())
  return response.data?.data || []
}

export const addGate = async (data) => {
  const response = await axios.post(`${config.serverURL}/api/gates`, data, getAuthHeaders())
  return response.data?.data || null
}

export const updateGate = async (id, data) => {
  const response = await axios.put(`${config.serverURL}/api/gates/${id}`, data, getAuthHeaders())
  return response.data?.data || null
}

export const deactivateGate = async (id) => {
  const response = await axios.patch(`${config.serverURL}/api/gates/${id}/deactivate`, {}, getAuthHeaders())
  return response.data
}

export const reactivateGate = async (id) => {
  const response = await axios.patch(`${config.serverURL}/api/gates/${id}/reactivate`, {}, getAuthHeaders())
  return response.data
}

export const getManagerBookings = async () => {
  const response = await axios.get(`${config.serverURL}/manager/bookings`, getAuthHeaders())
  return response.data?.data || []
}

// ===== AIRLINE MANAGEMENT =====

export const getManagerAirlines = async () => {
  const response = await axios.get(`${config.serverURL}/manager/airlines`, getAuthHeaders())
  return response.data?.data || []
}

// ===== FLIGHT MANAGEMENT =====

export const getManagerFlights = async () => {
  const response = await axios.get(`${config.serverURL}/manager/flights`, getAuthHeaders())
  return response.data?.data || []
}

export const addManagerFlight = async (data) => {
  const response = await axios.post(`${config.serverURL}/manager/flights`, data, getAuthHeaders())
  return response.data?.data || null
}

export const updateManagerFlight = async (id, data) => {
  const response = await axios.put(`${config.serverURL}/manager/flights/${id}`, data, getAuthHeaders())
  return response.data?.data || null
}

export const deactivateManagerFlight = async (id) => {
  const response = await axios.patch(`${config.serverURL}/manager/flights/${id}/deactivate`, {}, getAuthHeaders())
  return response.data
}

export const reactivateManagerFlight = async (id) => {
  const response = await axios.patch(`${config.serverURL}/manager/flights/${id}/reactivate`, {}, getAuthHeaders())
  return response.data
}
