import express from "express";
import { PORT, mongoDBURL } from "../backend/config.js";
import { Author } from "./models/authorModel.js";
import { Book } from "./models/bookModel.js";
import { User } from "./models/userModel.js"
import { Review } from "./models/reviewModel.js";
import booksRoute from './routes/booksRoute.js';
import authorsRoute from "./routes/authorsRoute.js"
import usersRoute from "./routes/usersRoute.js"
import reviewsRoute from "./routes/reviewsRoute.js"
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (request, response) => {
    console.log(request);
    return response.status(234).send("hi");
});

app.use("/books", booksRoute);
app.use("/authors", authorsRoute);
app.use("/users", usersRoute);
app.use("/reviews", reviewsRoute);

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