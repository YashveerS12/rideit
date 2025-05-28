const express = require("express");
const app = express();
const mongoose = require("mongoose");
const User=require("../Models/user.js");
const Ride=require("../Models/ride.js");
const bcrypt = require("bcryptjs");
app.use(express.json());


module.exports.signup= async (req, res) => {
    const { name, number, email, age, gender, password,category } = req.body;
console.log(req.body);

    if (!name || !number || !email || !age || !gender || !password || !category) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const newUser = new User({
      name,
      number,
      email,
      age,
      gender,
      category,
      password,
      status:"Active"
    });
  
    try {
      const savedUser = await newUser.save();
      console.log("Successfully Saved");
      res.status(201).json({ message: 'User created successfully', user: savedUser });
    } catch (error) {
      console.error('Error creating user:', error.message);
      res.status(400).json({ message: 'Error creating user', error: error.message });
    }
};

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required'
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }
    
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        gender:user.gender

      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
};

exports.bookride=async(req,res)=>{
  try{
    console.log(req.body);
    const {from,to,number,age,gender,passengers,date,amount}=req.body;
    if(!from || !to || !number || !age || !gender){
      return res.status(400).json({message:"All fields are required"})
    }

    let preRide=await Ride.findOne({number:number,status  :"pending"});
    if(preRide){
      return res.status(400).json({message:"Ride already booked by your account"});
    }

    const newRide=new Ride({
      from,
      to,
      number,
      age,
      gender,
      passengers,
      date,
      amount,
      status:"pending"
    })
    const savedRide=await newRide.save();
    res.status(200).json({message:"Ride created successfully",ride:savedRide});
   
  }catch(error){
    res.status(500).json({
      message: 'Internal server error'
    });

  }
}


exports.getrides=async(req,res)=>{
  try{

   
    let {from,to,date,passengers}=req.body;
    const rides = await Ride.find(
      { from: from, to: to, date: date },
      { status: 0 } 
    );
    
    if(rides.length===0){
      return res.status(200).json({message:"No rides found for the given criteria",data:rides});
    }

    res.status(200).json({message:"Rides fetched successfully",data:rides});

  }catch(error){
    res.status(500).json({
      message: 'Internal server error'
    });

  }
}


exports.cancleride=async(req,res)=>{
  try{
    let number=req.body.number;
    const ride=await Ride.findOne({number:number});
    if(!ride){
      return res.status(400).json({message:"Ride not found"});
    }
    await Ride.deleteOne({number:number});
    res.status(200).json({message:"Ride canceled successfully"});

  }catch(error){
      res.status(500).json({
        message: 'Internal server error'
      });
  
  }
}



exports.acceptride = async (req, res) => {
  try {
    console.log(req.body);
    const { number, name, gender, passengerCount } = req.body;

    if (!number || !name || !gender || !passengerCount) {
      return res.status(400).json({
        message: "All fields (number, name, gender, passengerCount) are required."
      });
    }

    const ride = await Ride.findOne({ number });

    if (!ride) {
      return res.status(404).json({
        message: "Ride not found."
      });
    }

    if (ride.passengers < passengerCount) {
      return res.status(400).json({
        message: `Only ${ride.passengers} seat(s) available. Cannot book ${passengerCount} seat(s).`
      });
    }

    ride.bookings.push({
      name,
      gender,
    });

    
    ride.passengers -= passengerCount;

    
    if (ride.passengers === 0) {
      ride.status = "full";
    }

    await ride.save();

    return res.status(200).json({
      message: "Ride booked successfully.",
      ride
    });
  } catch (error) {
    console.error("Error booking ride:", error);
    res.status(500).json({
      message: "Internal server error"
    });
  }
};


exports.getallrides=async(req,res)=>{
  try{

    console.log("Hello");
    const rides = await Ride.find(
      {status:"pending"},
      { status: 0 }
    );
    if(rides.length===0){
      return res.status(200).json({message:"No rides found for the given criteria",data:rides});
    }

    res.status(200).json({message:"Rides fetched successfully",data:rides});

  }catch(error){
    res.status(500).json({
      message: "Internal server error"
    });

  }
}



const nodemailer = require("nodemailer");

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "harshitsingh00010@gmail.com",       // Your Gmail address
    pass: "jujw zbwl inwv zutn"       // Your Gmail App Password
  }
});

exports.sendotp = async (req, res) => {
  try {
    const { email } = req.body;
    console.log(req.body);
    if (!email) {
      return res.status(400).json({ message: "Phone number or email is required" });
    }

    const otp = generateOTP();

    let smsResult, emailResult;

  
    if (email) {
      try {
        const mailOptions = {
          from:  "harshitsingh00010@gmail.com",
          to: email,
          subject: "RIDE-IT OTP Verification",
          text: `Your RIDE-IT OTP is ${otp}`,
        };

        emailResult = await transporter.sendMail(mailOptions);
        console.log("Email OTP sent:", otp);
      } catch (emailErr) {
        console.error("Email Error:", emailErr.message);
      }
    }

    // Response
    return res.status(200).json({
      message: "OTP sent successfully",
      otp:  otp
    });

  } catch (error) {
    console.error("OTP error:", error);
    return res.status(500).json({
      message: "Failed to send OTP",
    });
  }
};




exports.verifyotp=async(req,res)=>{
  try{

    let {userOtp,sentOtp}=req.body;
    if(userOtp!==sentOtp){
      return res.status(200).json({message:"Incorrect OTP"});
    }
    res.status(200).json({message:"OTP verified successfully"});

  }catch(error){
    res.status(500).json({
      message: "Internal server error"
    });

  }
}