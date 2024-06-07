const dotenv = require("dotenv");
dotenv.config();
const express = require("express"); //creating server
const app = express();
const cors = require("cors");
const cookieParser=require('cookie-parser');
const dbConnection = require("../database/dbConnection");
const {errorMiddleware} =require('../middleware/errorMiddleware');
const port = process.env.PORT || 3000;
app.use(express.json()); // for parsing application/json
app.use(cookieParser())
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(
  cors({
    // origin: ["*"],
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.listen(port,()=>{
  console.log("server listening on port " + port);
})
const roleRoutes = require("../routes/roleRoutes");
const statusRoutes = require("../routes/statusRoutes");
const userRoutes = require("../routes/userRoutes");
//usage
app.use("/roles", roleRoutes);
app.use("/status", statusRoutes);
app.use("/api", userRoutes);

app.use(errorMiddleware);

dbConnection();
