const sql="show databases;";

const data=(sql,(err,res)=>{
          if(err){
            throw err;

          }
          console.log('result:',res);
});
module.exports=data;