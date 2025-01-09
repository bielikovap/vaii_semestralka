import express from "express";
import { PORT, mongoDBURL } from "../backend/config.js";
import booksRoute from './routes/booksRoute.js';
import authorsRoute from "./routes/authorsRoute.js";
import usersRoute from "./routes/usersRoute.js";
import reviewsRoute from "./routes/reviewsRoute.js";
import authRoute from "./routes/auth.js";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());


app.use((req, res, next) => { console.log(`Received ${req.method} request for ${req.url}`); next(); });


app.use("/books", booksRoute);
app.use("/authors", authorsRoute);
app.use("/users", usersRoute);
app.use("/reviews", reviewsRoute);

app.use("/login", authRoute);



mongoose
    .connect(mongoDBURL)
    .then(() => {
        console.log('App connected to database');
        app.listen(PORT, () => {
          console.log(`App is listening to port: ${PORT}`);
        });
      })
      .catch((error) => {
        console.log(error);
      });