import express from "express";
import cors from "cors";
import router from "./router/UsersRouter.js";
import { ErrorHandling, notFound } from "./middelware/ErrorHandling.js";

const app = express();
const port = 3000;

//middelware functions
app.use(express.json());
app.use(cors());

//routes
app.use(router);
app.use(ErrorHandling);
app.use(notFound);
//listen
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
