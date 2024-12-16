const { STATUS_CODES } = require("./constants");

/**
 * Returnează un răspuns de eroare structurat către client.
 *
 * @param {Object} res - Obiectul de răspuns Express
 * @param {Error|string} error - Obiectul de eroare sau mesajul erorii
 * @param {number} statusCode - Codul de status HTTP (default 500)
 */
function respondWithError(res, error, statusCode = STATUS_CODES.error) {
  console.error("❌ Eroare:", error.message || error);
  res.status(statusCode).json({
    status: "error",
    code: statusCode,
    message: error.message || "An unexpected error occurred",
  });
}

module.exports = { respondWithError };
