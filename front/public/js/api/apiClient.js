export { postResource, getResource, putResource, deleteResource }

import { APIError, APINotFoundError } from "./error.js"

const API_URL = `http://localhost:3000/api`

// Função auxiliar para obter headers com token
function getHeaders(additionalHeaders = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...additionalHeaders
  }

  const token = localStorage.getItem('token')
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  return headers
}

async function postResource(param, data) {
  const resource = `${API_URL}/${param}`
  const options = {
    headers: getHeaders(),
    method: 'post',
    body: JSON.stringify(data)
  }

  const response = await fetch(resource, options)

  // Se receber 401, token expirou, redireciona para login
  if (response.status === 401) {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login.html'
    return
  }

  if (!response.ok) {
    throw new APIError(`POST to ${param} failed with status ${response.status}`, response.status, param)
  }

  const created_data = await response.json()
  return created_data
}

async function getResource(param, id = '') {
  try {
    const resource = `${API_URL}/${param}/${id}`
    const options = {
      headers: getHeaders(),
      method: 'get'
    }

    const response = await fetch(resource, options)

    // Se receber 401, token expirou, redireciona para login
    if (response.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login.html'
      return
    }

    if (!response.ok) {
      if (response.status === 403) {
        throw new APIError(`Permission denied for ${param}/${id}.`, 403, param)

      } else if (response.status === 404) {
        throw new APINotFoundError(param, id)

      } else if (response.status >= 500) {
        throw new APIError(`Server encountered an internal error.`, response.status, param)

      } else {
        if (!id) {
          throw new APIError(`GET to '${param}/${id}' failed with status ${response.status}`, response.status, `${param}/${id}`)
        } else {
          throw new APIError(`GET to '${param}/${id}' failed with status ${response.status}`, response.status, `${param}/`)
        }
      }
    }
    return response.json()

  } catch (e) {
    if (e instanceof APIError) {
      throw e
    }
  }
}

async function putResource(param, id, data) {
  const resource = `${API_URL}/${param}/${id}`
  const options = {
    headers: getHeaders(),
    method: 'put',
    body: JSON.stringify(data)
  }

  const response = await fetch(resource, options)

  // Se receber 401, token expirou, redireciona para login
  if (response.status === 401) {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login.html'
    return
  }

  if (!response.ok) {
    throw new APIError(`PUT to ${param}/${id} failed with status ${response.status}`, response.status, `${param}/${id}`)
  }

  const updated_data = await response.json()
  return updated_data
}

async function deleteResource(param, id) {
  const resource = `${API_URL}/${id}`
  const options = {
    headers: getHeaders(),
    method: 'delete'
  }

  const response = await fetch(resource, options)

  // Se receber 401, token expirou, redireciona para login
  if (response.status === 401) {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login.html'
    return
  }

  if (!response.ok) {
    throw new APIError(`DELETE to ${param}/${id} failed with status ${response.status}`, response.status, `${param}/${id}`)
  }

  return response.ok
}
