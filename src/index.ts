import express from "express";
import "express-async-errors";

import routes from "./routes";
import cors from "./app/middlewares/cors";
import errorHandler from "./app/middlewares/errorHandler";

const app = express();

app.use(express.json());
app.use(cors);
app.use(routes);
app.use(errorHandler);

app.listen(process.env.PORT || 3000, () =>
  console.log("🔥 Server is running http://localhost:3001")
);

