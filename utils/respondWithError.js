const { STATUS_CODES } = require("./constants");

function respondWithError(res, error) {
  console.error(error);
  res.status(STATUS_CODES.error).json({ message: `${error}` });
}

module.exports = { respondWithError };
