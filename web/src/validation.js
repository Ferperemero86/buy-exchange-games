const validate = require("validate.js");

const register = {
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
  nickName: {
    presence: true,
    format: {
      pattern: /^.{3,20}$/,
      message: () => {
        return validate.format("^Enter a nickname of 3-20 characters");
      }
    }
  },
  country: {
    presence: true,
    format: {
      pattern: /^.{1,100}$/,
      message: () => {
        return validate.format("^Please select a country");
      }
    }
  }
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

const gameForSale = {
  price: {
    presence: true,
    format: {
      pattern: /^[0-9]{1,5}$/,
      message: () => {
        return validate.format("^Please enter a valid number");
      }
    }
  }
};

module.exports = { register, 
                   createList, 
                   gameForSale,
                   validate };
