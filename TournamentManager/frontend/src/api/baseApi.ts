import axios, { AxiosRequestConfig } from 'axios'
import { jwtDecode } from 'jwt-decode'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
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
    if (config.url === '/auth/refreshToken') {
      config.headers.Authorization = `Bearer ${refreshToken}`
    } else {
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    //check if the accessToken is expired
    const decodedToken = jwtDecode(accessToken)

    if (decodedToken.exp && decodedToken.exp * 1000 < Date.now()) {
      //token is expired
      //redirect to login
      // window.location.href = "/login"
    }
  }

  return config
})

async function getAll<T>(path: string, config?: AxiosRequestConfig) {
  const resp = await axiosInstance.get<Array<T>>(path, config)
  return resp.data
}

async function getAllPaginated<T>(path: string, config?: AxiosRequestConfig) {
  const resp = await axiosInstance.get<T>(path, config)
  return resp.data
}

async function getDetail<T>(path: string) {
  const resp = await axiosInstance.get<T>(path)
  return resp.data
}

async function create<T>(path: string, data: unknown) {
  const resp = await axiosInstance.post<T>(path, data)
  return resp.data
}

async function update<T>(path: string, data: unknown) {
  const resp = await axiosInstance.put<T>(path, data)
  return resp.data
}

async function deleteResource<T>(path: string) {
  const resp = await axiosInstance.delete<T>(path)
  return resp.data
}

async function create_send_status<T>(path: string, data: unknown) {
  const resp = await axiosInstance.post<T>(path, data)
  return resp.status
}

export default {
  getAll,
  getDetail,
  getAllPaginated,
  create,
  update,
  deleteResource,
  create_send_status,
}
