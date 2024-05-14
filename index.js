const express = require("express")
const app = express();
const jwt = require("jsonwebtoken")

app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.set('view engine', 'ejs')

let user = {
    id: "1b1kjh34hb2jbhb2b3j",
    email: "johndoe@gmail.com",
    password: "ahsjsusbasjsushsbjhxhs; issxyusoakajss"
}
const jwt_secret = 'some super secret'

require("dotenv").config()
const PORT = process.env.PORT
const HOSTNAME = process.env.HOSTNAME


app.get('/', (req,res) => {
    res.send("Hello Server")
})

app.get("/forgot-password", (req,res,next) =>{
   res.render('forgot-password')
})

app.post('/forgot-password', (req,res,next) => {
    const {email} = req.body;
    //making sure user exists in database
    if(email !== user.email){
        res.send("User not registerd")
        return
    }
    //user exists and now create a one time link valid for 15min
    const secret = jwt_secret + user.password
    const payload = {
        email: user.email,
        id: user.id
    }
    const token = jwt.sign(payload, secret, {expiresIn: '15m'})
    const link = `http://localhost:5000/reset-password/${user.id}/${token}`
    console.log(link);
    res.send('Password reset has been sent to your email...')
})

app.get("/reset-password/:id/:token", (req,res,next) => {
   const {id,token} = req.params;
   //check if id exits in database
   if(id !== user.id){
    res.send("Invalid Id...")
        return;
   }
   const secret = jwt_secret + user.password;
   try{
    const payload = jwt.verify(token, secret)
    res.render('reset-password', {email: user.email})
   } catch (error){
    console.log(error.message)
    res.send(error.message)
   }
})

app.post("/reset-password/:id/:token", (req,res,next) => {
      const {id, token} = req.params
      const {password, confirm} = req.body;
      if(id !== user.id){
        res.send("Invalid Id...")
            return;
       }

       const secret = jwt_secret + user.password;
       try{
        const payload = jwt.verify(token, secret)
        user.password = password;
        res.send(user)
       } catch (error){
        console.log(error.message)
        res.send(error.message)
       }
})

app.listen(PORT, HOSTNAME, () => {
    console.log(`Server started at http://${HOSTNAME}:${PORT}`);
  });