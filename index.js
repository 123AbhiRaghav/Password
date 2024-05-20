const express = require("express");
const app = express();
require("./db/conn");
const router = require("./routes/router");
const cors = require("cors");
const cookiParser = require("cookie-parser")

require("dotenv").config();
const PORT = process.env.PORT
const HOSTNAME = process.env.HOSTNAME


app.use(express.json());
app.use(cookiParser());
app.use(cors());
app.use(router);


app.listen(PORT,()=>{
    console.log(`server start at port no : ${PORT}`);
})