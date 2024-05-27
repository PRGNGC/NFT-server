export const authValidationSchema = {
  login: {
    isString: {
      errorMessage: "Login must be a string",
    },
    notEmpty: {
      errorMessage: "Login must not be empty",
    },
  },
  password: {
    isLength: {
      options: {
        min: 6,
        max: 20,
      },
    },
    notEmpty: {
      errorMessage: "Password must not be empty",
    },
    isString: {
      errorMessage: "Password must be a string",
    },
  },
};
