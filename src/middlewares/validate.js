import { fromError } from 'zod-validation-error';

export const validate = (schemas) => {
  return (req, res, next) => {
    const result = schemas.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      return res.status(400).json({
        status: 'fail',
        message: fromError(result.error).message,
      });
    }
    req.validatedData = result.data;

    next();
  };
};
