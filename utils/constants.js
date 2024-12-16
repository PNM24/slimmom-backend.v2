/**
 * Coduri de status HTTP utilizate în răspunsurile API.
 */
const STATUS_CODES = {
  success: 200,
  created: 201,
  badRequest: 400,
  unauthorized: 401,
  forbidden: 403,
  notFound: 404,
  conflict: 409,
  error: 500,
};

module.exports = { STATUS_CODES };
