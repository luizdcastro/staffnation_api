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
const authUserRouter = require("./routes/authUserRoutes");
const authBusinessRouter = require("./routes/authBusinessRoutes");
const userRouter = require('./routes/userRoutes')
const fileRouter = require('./routes/fileRoutes')
const businessRouter = require('./routes/businessRoutes')
const jobRouter = require('./routes/jobRoutes')
const storeRouter = require('./routes/storeRoutes')

//Connect to DB
dotenv.config({ path: "./config.env" });

mongoose
	.connect(process.env.DB_CONNECT, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
	})
	.then(() => console.log("DB connection successful!"));

//Route Middlewares
app.use("/v1/authUser", authUserRouter);
app.use("/v1/authBusiness", authBusinessRouter)
app.use("/v1/user", userRouter);
app.use("/v1/file", fileRouter);
app.use("/v1/business", businessRouter);
app.use("/v1/store", storeRouter);
app.use("/v1/job", jobRouter);

const port = 8000;
app.listen(process.env.PORT || port, () =>
	console.log(`Running on port ${port}`)
);
