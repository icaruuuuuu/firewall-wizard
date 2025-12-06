export { APIError, APINotFoundError }

class APIError extends Error {
  constructor(msg, status, endpoint) {
    super(msg)
    this.name = 'APIError'
    this.statusCode = status
    this.endpoint = endpoint
    this.timestamp = new Date().toISOString()
  }
}

class APINotFoundError extends APIError {
  constructor(endpoint, resource_id) {
    super(`Resource not found at '${endpoint}/${resource_id}'`, 404, endpoint)
    this.name = 'APINotFoundError'
  }
}
