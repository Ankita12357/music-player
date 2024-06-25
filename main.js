const express = require('express');
const bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
const crypto = require('crypto');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const userdetails = require('./module/todo.js'); // Correctly import the userdetails model
const bcrypt=require('bcryptjs');
const jwt =require('jsonwebtoken');



const JWT_SECRET="Jbsfsasdfghjkl";
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

mongoose.connect("mongodb://localhost:27017/userdetails", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error("Error connecting to MongoDB", err);
});

// // Fallback to index.html for single-page applications
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', '2.html'));
});
app.use(express.static(path.join(__dirname, 'public')));

app.post("/register", async (req, res) => {
  
    const { fname, lname, email, password } = req.body;
    console.log(req.body); // Log the received data
    const encrypted=await bcrypt.hash(password,10);

    try {
        const existinguser = await userdetails.findOne({ email });
        if (existinguser) {
            return res.send({ status: "errorr", message: "user already exists" });
             console.log("user already exists");
            // return;
        }
        else{
        const newuser = new userdetails({
            fname,
            lname,
            email,
            password:encrypted,
        });

        await newuser.save();
        res.send({ status: "ok" });
       }
    } catch (error) {
        console.error("Error during registration", error); // Log the error
        res.send({ status: "error", message: "Registration failed", error });
    }
});
app.post("/login", async (req, res) => {
    const {  email, password } = req.body;
    const user=await userdetails.findOne({ email });
            if(!user) {
            return res.send({ status: "errorr", message: "user not exists" });
        }
        if(await bcrypt.compare(password,user.password)){
            // const token=jwt.sign({},JWT_SECRET);
            const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '360m' });

            if(res.status(201)){
                return res.json({status:"ok", data:token});
            }else{
                return res.json({error:"error"});
            }
        }
        res.send({ status: "error2", message: "Invalid Password" });
        

});

app.post("/Userdetails", async (req, res) => {
    const { token } = req.body;
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const userEmail = decoded.email;
        const Userdetails = await userdetails.findOne({ email: userEmail });

        if (Userdetails) {
            res.send({ status: "ok", data: Userdetails });
        } else {
            res.send({ status: "error", message: "userdetails not found" });
        }
    } catch (error) {
        res.send({ status: "error1", message: "Invalid Token", error });
    }
});
app.post("/forgot-password", async (req, res) => {
    const { email } = req.body;
    try {
        const olduser=await userdetails.findOne({email});
        if(!olduser)
             return res.send({ status: "error", message:"user doesnot exit" });

          const secret=JWT_SECRET+olduser.password;
         const token=jwt.sign({email:olduser.email,id:olduser.id},secret,{expiresIn:'5m'});
        const link=`http://localhost:3000/reset-password/${olduser._id}/${token}`;
        var transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: "ankitad67890@gmail.com",
              pass: "ieis qtmi hbwc cxza",
            },
          });
      
          var mailOptions = {
            from: "youremail@gmail.com",
            to: email,
            subject: "Password Reset",
            text: link,
          };
      
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
              return res.json({ status: "error1", message: "Failed to send email" });
            } else {
              console.log("Email sent: " + info.response);
              return res.json({ status: "success", message: "Reset link sent" });
              
            }
            
          });
        } catch (error) {
          return res.json({ status: "error1", message: "Failed to send email" });
        }
      });

app.get("/reset-password/:id/:token",async(req,res)=>{
    const{id,token}=req.params;
    console.log(req.params);
   // res.send("done");
    const olduser = await userdetails.findOne({ _id: id });
  if (!olduser) {
     return res.json({ status: "user Not Exists!!" });
  }
      const secret = JWT_SECRET + olduser.password;
  try {
    const verify = jwt.verify(token, secret);
    //res.sendFile(path.join(__dirname, 'public', 'reset_password.html'));
    //res.send({ status: "ok", message: " Verified" });
     res.render("reset_password", { email: verify.email, status: "Not Verified" });
  } catch (error) {
    console.log(error);
    res.send("Not Verified");
  }
});

app.post("/reset-password/:id/:token", async (req, res) => {
    const { id, token } = req.params;
    const { password } = req.body;
  
    const olduser = await userdetails.findOne({ _id: id });
    if (!olduser) {
      return res.json({ status: "users Not Exists!!" });
    }
    const secret = JWT_SECRET + olduser.password;
    try {
      const verify = jwt.verify(token, secret);
      const encryptedPassword = await bcrypt.hash(password, 10);
      await userdetails.updateOne(
        {
          _id: id,
        },
        {
          $set: {
            password: encryptedPassword,
          },
        }
      );
  
      res.render("reset_password", { email: verify.email, status: "verified" });
    } catch (error) {
      console.log(error);
      res.json({ status: "Something Went Wrong" });
    }
  });


app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
