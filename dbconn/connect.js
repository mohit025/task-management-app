const mongoose=require('mongoose');

const databaseconnect = async()=>{

    try{
        await mongoose.connect('mongodb://127.0.0.1:27017/myinternapp');
        console.log("Mongodb connected");
        
    }
    catch(err){
  console.log(err.message);
  return;

    }
}

module.exports=databaseconnect;