import express from "express";


const app = express();


app.get('/',(req,res)=>{
     res.send("Welcome to the backend server")
})

const port = process.env.PORT || 5000;


app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
    });