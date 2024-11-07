import express from "express";
import { errorMiddleware } from "../middleware/error-middleware.js";
import { router } from "../routes/api.js";
import { publicRouter } from "../routes/public-api.js";

export const web = express();
web.use(express.json());
web.use("/api", publicRouter);
web.use("/api", router);
web.use(errorMiddleware);
