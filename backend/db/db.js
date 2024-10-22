const mysql = require('mysql2');
const data=require('../results/res');
const db=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'tsk_management'
});
db.connect((err)=>{
    if(err){
       throw err;
    } 
    console.log('connected to database ');
    db.query(data);
    
})
module.exports=db;