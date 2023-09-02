const express = require("express")
const app = express()
app.use(express.json());

const cors = require("cors")
app.use(cors())


const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const nodemailer = require("nodemailer")

const PORT = 5000
require('dotenv').config();

const mongoose = require('mongoose')
mongoose.connect(MONGO_URI)
.then(()=>{
    app.listen((PORT), () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error)=>{
    console.log(error)
})


const UsersModel = require("./models/UsersModel")
const jwt = require("jsonwebtoken")

app.post('/register', async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await UsersModel.findOne({ email });

        if (existingUser) {
            return res.send('User already exists');
        }

        bcrypt.hash(password, 10, async (err, hash) => {
            if (err) {
                return res.status(500).json({ Status: 'Error', Error: err });
            }

            const newUser = await UsersModel.create({
                email,
                password: hash,
            });

            const verificationToken = jwt.sign({ email }, 'tokenOfId', { expiresIn: '1d' });

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.AUTH_USER,
                    pass: process.env.AUTH_PASS,
                },
            });

            const mailOptions = {
                from: process.env.AUTH_USER,
                to: email,
                subject: 'Email Verification',
                html: `Click the following link to verify your email: <p><a href="http://localhost:3000/verify/${email}/${verificationToken}">Click here to proceed</a></p>`,
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ Status: 'Error', Error: 'Failed to send verification email' });
                } else {
                    return res.json({ Status: 'Success', Message: 'Verification email sent' });
                }
            });
        });
    } catch (error) {
        return res.status(500).json({ Status: 'Error', Error: error.message });
    }
});

app.get('/verify/:email/:verificationToken', async (req, res) => {
    const { email, verificationToken } = req.params;

    try {
        const decoded = jwt.verify(verificationToken, 'tokenOfId');
        if (decoded.email === email) {
            await UsersModel.updateOne({ email }, { isVerified: true });
            return res.send('Email verified successfully');
        } else {
            return res.send('Invalid token');
        }
    } catch (error) {
        try {
            await UsersModel.deleteOne({ email });
            return res.send('Error occurred, and user account deleted');
        } catch (deleteError) {
            return res.send('Error occurred, and failed to delete user account');
        }
    }
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const checkEmail = await UsersModel.findOne({ email });
    if (!checkEmail) {
        return res.send("User not found. Please check your email.");
    }
    if (!checkEmail.isVerified) {
        return res.send("Account not verified. Please verify your email first.");
    }
    if (checkEmail) {
        const passwordTrue = await bcrypt.compare(password, checkEmail.password);
        if (passwordTrue) {
            const token = jwt.sign({ id: checkEmail._id }, "tokenOfId");
            res.json({ token, id: checkEmail._id });
        } else {
            res.send("email or password is not correct");
        }
    } else {
        res.send("someting went wrong");
    }
});

app.post("/forgot-password", async(req,res)=>{
    const {email} = req.body;
    const checkEmail = await UsersModel.findOne({email})
    if(!checkEmail){
        res.send("email not valid")
    }else{
        const token = jwt.sign({id:checkEmail._id}, "tokenOfId", {expiresIn: "1d"})
        const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: (process.env.AUTH_USER),
                    pass: (process.env.AUTH_PASS)
                }
            });
          
          const mailOptions = {
            from: (process.env.AUTH_USER),
            to: checkEmail.email,
            subject: 'Reset Password Link',
            text: `http://localhost:3000/reset_password/${checkEmail._id}/${token}`
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              return res.send({Status: "Success"})
            }
        });
    }
})

app.post("/reset-password/:id/:token", (req, res) => {
    const { id, token } = req.params;
    const { password } = req.body;

    jwt.verify(token, "tokenOfId", (err, decoded) => {
        if (err) {
            return res.json({ Status: "Error with token" });
        } else {
            bcrypt.hash(password, 10, (err, hash) => {
                if (err) {
                    return res.send({ Status: "Error", Error: err });
                }
                UsersModel.findByIdAndUpdate({ _id: id }, { password: hash })
                    .then(u => res.json({ Status: "Success" }))
                    .catch(err => res.status(500).json({ Status: "Error", Error: err.message }));
            });
        }
    });
})