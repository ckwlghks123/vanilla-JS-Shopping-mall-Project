module.exports = asyncHandler => {
  return async (req, res, next) => {
    try {
      await asyncHandler(req, res);
      //   next();
    } catch (error) {
      next(error);
    }
  };
};
