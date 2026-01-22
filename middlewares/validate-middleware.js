export const validate = (schema) => async (req, res, next) => {
  try {
    const parsed = await schema.parseAsync(req.body);
    req.body = parsed;
    next();
  } catch (err) {
    res.status(422).json({
      message: 'Validation Error',
      errors: err.errors,
    });
  }
};