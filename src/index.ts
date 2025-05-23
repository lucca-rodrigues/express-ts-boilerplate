import cors from "cors";
import { AppDataSource } from "data-source";
import dotenv from "dotenv";
import express, { Express } from "express";
import userRouter from "modules/users/user.controller";

dotenv.config();

const app: Express = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.use("/api", userRouter);

app.use("/", (req, res) => {
  res.json({ message: "Api Status Ok" });
});

AppDataSource.initialize()
  .then(async () => {
    console.log("Data source has been initialized!");
    const PORT = process.env.PORT || 3333;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => console.log(error));

export default app;
