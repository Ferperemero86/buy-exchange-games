const validate = require("validate.js");

const constraints = {
  password: {
    presence: true,
    format: {
      pattern: /^.{8,72}$/,
      message: () => {
        return validate.format("^Please enter a valid password");
      },
    },
  },
  email: {
    presence: true,
    format: {
      pattern: /^[^@]+@[^@]+\.[^.@]+$/,
      message: () => {
        return validate.format("^Please enter a valid email");
      },
    },
  },
};

module.exports = { constraints, validate };
