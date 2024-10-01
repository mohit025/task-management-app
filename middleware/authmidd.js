const jwt=require('jsonwebtoken');
const jwtsec= "somesecretkey";

const authorizationMw=(req,res,next)=>{
const authHeader= req.headers['authorization'];

const gentoken= authHeader && authHeader.split(' ')[1];
if(!gentoken){
    return res.status(400).send('NO ACCESS. Token not provided');


}

jwt.verify(gentoken, jwtsec, (err,user)=>{
    if(err){
        return res.status(400).send('TOKEN not valid');
    }
    req.user=user;
    next();
})

}

module.exports=authorizationMw;