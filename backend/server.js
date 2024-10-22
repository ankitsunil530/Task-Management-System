const express=require('express');
const db=require('./db/db');
const app=express();


app.get('/',(req,res)=>{

  res.send("Server is running");
}
)



app.listen(5000,()=>{
  console.log("server is running on port 5000");
})
