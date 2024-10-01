const express=require('express');
const app=express();
const mongoose =require('mongoose');
const databaseconnect=require('./dbconn/connect');
const port= 3000;

const finalroutes=require('./routes/myapi');

app.use(express.urlencoded({extended:true}));
app.use(express.json());


databaseconnect();


app.use('/test', finalroutes);


app.listen(port, ()=>{
    console.log(`server start on port ${port}`);
    
});