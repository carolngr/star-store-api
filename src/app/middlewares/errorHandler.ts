import { Request, Response, NextFunction } from "express";

const errorHandler = (
  error: any,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  console.error(error);
  response.sendStatus(500);
};

export default errorHandler;
