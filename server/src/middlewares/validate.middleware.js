const ApiError = require("../utils/ApiError");

const validate = (schema) => (req, res, next) => {
  try {
    // parse() also runs .transform() — assign result back so controller
    // gets the normalised values (e.g. phone stripped of dial code)
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    const errorMessage = error.errors ? error.errors[0].message : error.message;
    next(new ApiError(400, errorMessage));
  }
};

module.exports = validate;
