import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from 'cors'
import { UserController, PostController } from "./controllers/index.js";
import {
  registerValidator,
  loginValidator,
  postCreateValidator,
} from "./auth.js";
import { checkAuth, handleValidationErrors } from "./utils/imports.js";


//============ connect to MongoDB
const pass = "vEytIO3tJewtR3nx";
mongoose
  .connect(
    `mongodb+srv://bsatylganov25:${pass}@cluster1.1yfpc0s.mongodb.net/blog?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("DB Ok");
  })
  .catch((err) => {
    console.log("DB err", err);
  });



//============ creating server
const app = express();
const PORT = 4444;
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(cors())

// =========== multer
const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });



//============ Routing pages
app.post(
  "/auth/login",
  loginValidator,
  handleValidationErrors,
  UserController.login
);
app.post(
  "/auth/registration",
  registerValidator,
  handleValidationErrors,
  UserController.register
);
app.get("/auth/me", checkAuth, UserController.getMe);

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});



//============= Post routes
app.get("/posts", PostController.getAll);
app.get("/posts/:id", PostController.getOne);
app.post(
  "/posts",
  checkAuth,
  postCreateValidator,
  handleValidationErrors,
  PostController.create
);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch(
  "/posts/:id",
  checkAuth,
  handleValidationErrors,
  PostController.update
);

app.listen(PORT, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Server started");
});
