export { postResource, getResource, updateResource, deleteResource }

import { APIError, APINotFoundError } from "./error.js"

const API_URL = `http://localhost:3000/api`

async function postResource(param, data) {
  const resource = `${API_URL}/${param}`
  const options = {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'post',
    body: JSON.stringify(data)
  }

  const response = await fetch(resource, options)
  if (!response.ok) {
    throw new APIError(`POST to ${param} failed with status ${response.status}`, response.status, param)
  }

  const created_data = await response.json()
  return created_data
}

async function getResource(param, id = '') {
  try {
    const resource = `${API_URL}/${param}/${id}`
    const response = await fetch(resource)

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

async function updateResource(param, id, data) {
  const resource = `${API_URL}/${param}/${id}`
  const options = {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'put',
    body: JSON.stringify(data)
  }

  const response = await fetch(resource, options)
  if (!response.ok) {
    throw new APIError(`PUT to ${param}/${id} failed with status ${response.status}`, response.status, `${param}/${id}`)
  }

  const updated_data = await response.json()
  return updated_data
}

async function deleteResource(param, id) {
  const resource = `${API_URL}/${id}`
  const options = {
    method: 'delete'
  }

  const response = await fetch(resource, options)
  if (!response.ok) {
    throw new APIError(`DELETE to ${param}/${id} failed with status ${response.status}`, response.status, `${param}/${id}`)
  }

  return response.ok
}
