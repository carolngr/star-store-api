import { Request, Response, NextFunction } from "express";

const corsMiddleware = (_: Request, response: Response, next: NextFunction) => {
  response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  response.setHeader("Access-Control-Allow-Methods", "*");
  response.setHeader("Access-Control-Allow-Headers", "*");
  response.setHeader("Access-Control-Max-Age", "10");
  next();
};

export default corsMiddleware;

