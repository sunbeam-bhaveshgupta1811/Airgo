import axios from 'axios'
import { config } from '../../../config'

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${sessionStorage.getItem('jwt')}`,
    'Content-Type': 'application/json'
  }
})

// Dashboard
export const getManagerDashboardStats = async () => {
  try {
    const response = await axios.get(`${config.serverURL}/manager/dashboard/stats`, getAuthHeaders())
    return response.data?.data || {}
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch dashboard stats')
  }
}

// My Airport
export const getMyAirport = async () => {
  try {
    const response = await axios.get(`${config.serverURL}/manager/my-airport`, getAuthHeaders())
    return response.data?.data || null
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch airport')
  }
}

// Terminals
export const getMyTerminals = async () => {
  try {
    const response = await axios.get(`${config.serverURL}/manager/terminals`, getAuthHeaders())
    return response.data?.data || []
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch terminals')
  }
}

export const addTerminal = async (terminalData) => {
  try {
    const response = await axios.post(`${config.serverURL}/api/terminals`, terminalData, getAuthHeaders())
    return response.data?.data || null
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to add terminal')
  }
}

export const updateTerminal = async (id, terminalData) => {
  try {
    const response = await axios.put(`${config.serverURL}/api/terminals/${id}`, terminalData, getAuthHeaders())
    return response.data?.data || null
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update terminal')
  }
}

export const deactivateTerminal = async (id) => {
  try {
    const response = await axios.patch(`${config.serverURL}/api/terminals/${id}/deactivate`, {}, getAuthHeaders())
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to deactivate terminal')
  }
}

export const reactivateTerminal = async (id) => {
  try {
    const response = await axios.patch(`${config.serverURL}/api/terminals/${id}/reactivate`, {}, getAuthHeaders())
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to reactivate terminal')
  }
}

// Gates
export const getMyGates = async () => {
  try {
    const response = await axios.get(`${config.serverURL}/manager/gates`, getAuthHeaders())
    return response.data?.data || []
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch gates')
  }
}

export const getGatesByTerminal = async (terminalId) => {
  try {
    const response = await axios.get(`${config.serverURL}/api/gates/terminal/${terminalId}`, getAuthHeaders())
    return response.data?.data || []
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch gates')
  }
}

export const addGate = async (gateData) => {
  try {
    const response = await axios.post(`${config.serverURL}/api/gates`, gateData, getAuthHeaders())
    return response.data?.data || null
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to add gate')
  }
}

export const updateGate = async (id, gateData) => {
  try {
    const response = await axios.put(`${config.serverURL}/api/gates/${id}`, gateData, getAuthHeaders())
    return response.data?.data || null
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update gate')
  }
}

export const deactivateGate = async (id) => {
  try {
    const response = await axios.patch(`${config.serverURL}/api/gates/${id}/deactivate`, {}, getAuthHeaders())
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to deactivate gate')
  }
}

export const reactivateGate = async (id) => {
  try {
    const response = await axios.patch(`${config.serverURL}/api/gates/${id}/reactivate`, {}, getAuthHeaders())
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to reactivate gate')
  }
}

// Manager Bookings
export const getManagerBookings = async () => {
  try {
    const response = await axios.get(`${config.serverURL}/manager/bookings`, getAuthHeaders())
    return response.data?.data || []
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch bookings')
  }
}
