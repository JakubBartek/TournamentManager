import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

axiosInstance.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('accessToken')
  const refreshToken = localStorage.getItem('refreshToken')

  if (accessToken && refreshToken) {
    if (!config.headers) {
      config.headers = {}
    }
    if (config.url === '/auth/refreshToken') {
      config.headers.Authorization = `Bearer ${refreshToken}`
    } else {
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    // Check token expiration
    const decodedToken = jwtDecode(accessToken)
    if (decodedToken.exp && decodedToken.exp * 1000 < Date.now()) {
      // Token expiration handling (currently commented)
      // window.location.href = "/login"
    }
  }

  return config
})

// Define a local type for configuration
type RequestConfig = {
  headers?: Record<string, string>
  params?: Record<string, unknown>
  [key: string]: unknown
}

async function getAll<T>(path: string, config?: RequestConfig) {
  const resp = await axiosInstance.get<T[]>(path, config)
  return resp.data
}

async function getAllPaginated<T>(path: string, config?: RequestConfig) {
  const resp = await axiosInstance.get<T>(path, config)
  return resp.data
}

async function getDetail<T>(path: string, config?: RequestConfig) {
  const resp = await axiosInstance.get<T>(path, config)
  return resp.data
}

async function create<T>(path: string, data: unknown, config?: RequestConfig) {
  const resp = await axiosInstance.post<T>(path, data, config)
  return resp.data
}

async function update<T>(path: string, data: unknown, config?: RequestConfig) {
  const resp = await axiosInstance.put<T>(path, data, config)
  return resp.data
}

async function deleteResource<T>(path: string, config?: RequestConfig) {
  const resp = await axiosInstance.delete<T>(path, config)
  return resp.data
}

export default {
  getAll,
  getDetail,
  getAllPaginated,
  create,
  update,
  deleteResource,
}
