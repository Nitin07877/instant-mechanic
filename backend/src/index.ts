import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger";
import dashboardRouter from "./routes/dashboard";
import bookingsRouter from "./routes/bookings";
import mechanicsRouter from "./routes/mechanics";
import customersRouter from "./routes/customers";
import analyticsRouter from "./routes/analytics";
import authRouter from "./routes/auth";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/dashboard", dashboardRouter);
app.use("/api/bookings", bookingsRouter);
app.use("/api/mechanics", mechanicsRouter);
app.use("/api/customers", customersRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/auth", authRouter);

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
  console.log(`API docs available at http://localhost:${PORT}/api/docs`);
});