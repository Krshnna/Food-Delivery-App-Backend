class ApiError extends Error {
  constructor(
    statusCode,
    error,
    err_stack,
    message = "Something went wrong!!"
  ) {
    super(message),
      (this.statusCode = statusCode),
      (this.error = error),
      (this.message = message),
      (this.success = false);

    if (err_stack) {
      this.err_stack = err_stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
