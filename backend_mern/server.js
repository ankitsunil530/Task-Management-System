import express from "express";
import dotenv from "dotenv";
dotenv.config();

import db from "./db/db.js";
import connectDB from "./db/db.js";

const app = express();


app.get('/',(req,res)=>{
     res.send("Welcome to the backend server")
})
app.get('/test',(req,res)=>{
     res.send("Welcome to the backend server tester")
     
})
const port = process.env.PORT || 5000;
connectDB();

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
    });