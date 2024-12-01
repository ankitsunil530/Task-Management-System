import 'dotenv/config';

import mysql from 'mysql2';

export const db=mysql.createConnection(
   {
         host:process.env.MYSQL_HOST,
         user:process.env.MYSQL_USER,
         password:process.env.MYSQL_PASSWORD,
         database:process.env.MYSQL_DATABASE
   }
);


db.connect(
    (err)=>{
        if(err) throw err;
        console.log("Connected to MySQL Server");
    }
)


