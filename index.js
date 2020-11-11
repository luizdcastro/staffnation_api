const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");

//Middleware
app.use(express.json());
app.use(helmet());
app.use(cors());

//Import Routes
const authRouter = require("./routes/authRoutes");
const userRouter = require('./routes/userRoutes')

//Connect to DB
dotenv.config({ path: "./config.env" });

mongoose
	.connect("mongodb+srv://luizdcastro:lM8CJyBPhn6t8NnA@cluster0.zltnc.mongodb.net/staffnation?retryWrites=true&w=majority", {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
	})
	.then(() => console.log("DB connection successful!"));

//Route Middlewares
app.use("/v1/auth", authRouter);
app.use("/v1/user", userRouter);

const port = 8000;
app.listen(process.env.PORT || port, () =>
	console.log(`Running on port ${port}`)
);
