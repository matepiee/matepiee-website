const errorHandler = (err, req, res, next) => {
  console.log = ("SERVER ERROR:", err.stack);

  const statusCode = err.status || 500;
  const errorMessage = err.message || "Something went wrong on server!";

  res.status(statusCode).json({
    success: false,
    message: errorMessage,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

export default errorHandler;
