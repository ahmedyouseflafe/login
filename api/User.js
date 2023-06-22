const express = require("express");

const router = express.Router();

// mongodb user model

const User = require("./../models/User");

//password handler

const bcrypt = require("bcrypt");

//signup

router.post("/signup", (req, res) => {
  let { name, email, password } = req.body;
  name = name.trim();
  email = email.trim();
  password = password.trim();

  if (name == "" || email == "" || password == "") {
    // res.status(400).json({message:"Please enter all the details"});
    res.json({
      status: "FAILED",
      message: " Empty input filed!",
    });
  } else if (!/^[a-zA-Z ]*$/.test(name)) {
    res.json({
      status: "FAILED",
      message: " Invalid name! ",
    });
  } else if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$/.test(email)) {
    res.json({
      status: "FAILED",
      message: " Invalid email! ",
    });
  } else if (password.length < 8) {
    res.json({
      status: "FAILED",
      message: " password is to short! ",
    });
  } else {
    // checking if user already exists
    User.find({ email })
      .then((result) => {
        if (result.length) {
          res.json({
            status: "FAILED",
            message: " Email already exists! ",
          });
        } else {
          // create new user
          

          //password handling

          const saltRounds = 10;
          bcrypt
            .hash(password, saltRounds)
            .then((hashpassword) => {
                const newUser = new User({
                    name,
                    email,
                    password: hashpassword,
                  });
                  newUser.save().then(result=>{
                    res.json({
                        status:"SUCCESS",
                        message:"sigup  successfully",
                        data: result,

                        
                    })

                  })
                  .catch(err => {
                    res.json({
                        status: "FAILED",
                        message:"An error occurred while saving user account"

                        
                    })
                     

                  })

             
            })
            .catch((err) => {
              console.log(err);
              res.json({
                status: "FAILED",
                message: " Error in Password Handling! ",
                
              })
            });
        }
      })
      .catch((err) => {
        console.log("err");
        res.json({
          status: "FAILED",
          message: " An error occurred while checking for exist ",
        });
      });
  }
});

router.post("/signin", (req, res) => {
    let { email, password } = req.body;
    email = email.trim();
    password = password.trim();

    if(email == ""|| password == ""){
        res.json({
            status:"FAILED",
            message:"Please Enter Email And Password",
        
        })
            
    }
    else{
        User.find({ email }).then(data=>{
            if(data.length){
                const hashpassword = data[0].password;
                bcrypt.compare(password, hashpassword).then(result=>{
                    if(result){
                        res.json({
                            status:"SUCCESS",
                            message:"Login Successful",
                            data:data
                        })
                    }
                    else{
                        res.json({
                            status:"FAILED",
                            message:"Password Doesn't Match"
                        })
                    }
                        
                }).catch(err=>{

                    res.json({
                        status:"FAILED",
                        message:"An Error Occured while comparing password"
                    })
                   
                })
                
            }
            else{
                res.json({
                    status:"FAILED",
                    message:"User Doesn't Exist",
                })
            }
        })
        .catch(err=>{
            res.json({
                status:"FAILED",
                message:"An Error Occured while checking for exising user",

            })
        })
            
    }
});

module.exports = router;
