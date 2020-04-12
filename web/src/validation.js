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

const createList = {
  listName: {
    presence: true,
    format: {
      pattern: /^.{3,20}$/,
      message: () => {
        return validate.format("^Please enter minimum 3 and maximum 20 characters");
      }
    }
  }
};

module.exports = { constraints, 
                   createList, 
                   validate };
