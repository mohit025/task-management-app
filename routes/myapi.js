const express=require('express');
const router=express.Router();
const User=require('../models/user');
const bcrypt=require('bcryptjs');
const jwt= require('jsonwebtoken');
const Joi = require('joi');
const jwtsec= "somesecretkey";

// I will firstly define joi schema which is server side validation

// validationforRegistration takes name,email and password which are used to register a user

const validationforRegistration= Joi.object({
    name: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(5).required()
});


// validationLogin takes email and password which are the necessary fiels for login.

const validationLogin= Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(5).required()
});

router.post('/register', async (req,res)=>{

    const {error}= validationforRegistration.validate(req.body);



     // details[0].message come when JOI validation fails.details is an array when joi valiation returns an error.
    if(error) 
        return res.status(404).json({message: error.details[0].message});  

    const {email,name,password} =req.body;

    try{
        let user= await User.findOne({email});
        if(user){

            return res.status(401).json({message:'A user with this email is already registered'});
        }


        const mysalt= await bcrypt.genSalt(10);
        const securedPassword= await bcrypt.hash(password, mysalt);

        user= new User({

            name,
            email,
            password:securedPassword
        });
        await user.save();


        const payload= {userId:user._id};

        const token=jwt.sign(payload, jwtsec, {expiresIn:'2h'});
        

        res.json({token});

    }
    catch(err){
        res.status(404).send('Something is wrong');
    }


})
  
router.post('/login', async (Req,res)=>{

    const {error}=validationLogin.validate(req.body);
    if (error)
        return res.status(401).json({message:error.details[0].message});


    const {email,password}= req.body;

    try{
        let user=await User.findOne({email});
        if(!user){
            return res.status(400).json({message:'invalid email/password'});
        }

        const ifsame= await bcrypt.compare(req.body.password, user.password);
        if(!ifsame){
            return res.status(400).json({message:'invalid details'})

        }

        const payload= {userId:user._id};
        const token= jwt.sign(payload, jwtsec, {expiresIn:'1h'})
        res.json({token});
    }
    catch(err){
        res.status(404).send('Something is wrong')

    }
})

module.exports= router;
