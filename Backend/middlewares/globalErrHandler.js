//Here we are not using next , means when this error occurs it will exiting the application
//It should not move on to the next middleware in the pipeline
export const globalErrhandler = (err, req, res, next) => {
  //stack : returns the particular code and the particular line where error occurred
  //message
  const stack = err?.stack;
  //If user already provide status code othewise we will use 500
  const statusCode = err?.statusCode ? err?.statusCode : 500;
  const message = err?.message;
  res.status(statusCode).json({
    stack,
    message,
  });
};


//Trying to acess some endpoint/route which does not exist
//404 handler
export const notFound = (req, res, next) => {
  //originalUrl is what the user is trying to access
  const err = new Error(`Route ${req.originalUrl} not found`);
  next(err);
};
