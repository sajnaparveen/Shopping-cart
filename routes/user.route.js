const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userSchema = require("../model/user.model");
const { userJoiSchema } = require('../validation/user.joischema');
const port = process.env.port || 8000;

const { mailsending } = require("../middleware/mailer");

router.post('/signupPage', async (req, res) => {
    try {
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const userName = req.body.userName;
        const password = req.body.password;
        const email = req.body.email;
        const mobileNumber = req.body.mobileNumber;
        const path="../files/snow.jpeg"
        const mailData = {
          to: email,
          subject: "Verify Email",
          text: "",
          fileName: "emailverification.ejs",
          details: {
            name: userName,
            date: new Date(),
             link: `http://localhost:${port}/api/v1/user/email-verify?email=${email}`
          }
        };
        if (firstName && lastName && userName && password && email && mobileNumber) {

            let userdetails = await userSchema.findOne({ userName: userName }).exec();
            let emailid = await userSchema.findOne({ email: email }).exec();
            let phoneno = await userSchema.findOne({ mobileNumber: mobileNumber }).exec();
            console.log("username", userdetails);
            console.log("email", emailid);
            console.log("mobileno", phoneno);
            const userjoi = await userJoiSchema.validateAsync(req.body);

            if (userdetails) {
                return res.json({
                    status: "failure",
                    message: "username already exist",
                });
            } else if (emailid) {
                return res.json({ status: "failure", message: "email already exist" });
            } else if (phoneno) {
                return res.json({
                    status: "failure",
                    message: "mobileno already exist",
                });
            }else{
              let mailRes = mailsending(mailData);
              if (!mailRes) {
                console.log("mail not sending");
              } 
             else {
                let user = new userSchema(req.body);
                let salt = await bcrypt.genSalt(10);
                user.password = bcrypt.hashSync(password, salt);
                console.log(user.password);
                let result = await user.save();
                console.log("result", result);
                return res.status(200).json({
                    status: "success",
                    message: "user details added  successfully",
                    data: result
                });
            }
          }
        } else {
            return res
                .status(400)
                .json({ status: "failure", message: "must include all details" });
        }
    } catch (error) {
        return res.status(500).json({
            status: "failure",
            message: error.message
        })
    }
})

//email verify
router.get("/email-verify", async (req, res) => {
  try {
    const data = await userSchema.findOne({ email:req.query.email }).exec();
    console.log("data",data)
    if (data) {
          if(data.verifyed){
            console.log("true")
            res.render('verify.ejs',{ title: "Your Account Already Verified!"})
          }else{
            console.log("false")
            userSchema.updateOne({ email: req.query.email }, { verifyed: true }).exec();
            res.render('verify.ejs',{title: "Your Account Verified Successfully!"})
          }
        } else {
          res.render('verify.ejs',{title: "Account Verification Failed!"})
        }
  } catch (error) {
    console.log("email-verify", error);
  }
});
router.post("/loginpage", async (req, res) => {
    try {
        const userName = req.body.userName;
        const password = req.body.password;
        let userdetails;
        let details = await userSchema
          .findOne({ userName: userName })
          .select("-userName -_id ")
          .exec();
          if(!details.verifyed){
            return res.status(400).json({
              status: "failure",
              message: "Your accout is not verified, Please verify your account",
            });
          }else{
        if (userName) {
          userdetails = await userSchema.findOne({ userName: userName }).exec();
          if (!userdetails) {
            return res.status(400).json({
              status: "failure",
              message: "Don't have an account?please Register",
            });
          } else if (userdetails) {
            console.log(userdetails.password);
            let match = await bcrypt.compare(password, userdetails.password);
            console.log("match", match);
            console.log("password", password);
            if (userdetails.firstLoginStatus !== true) {
              await userSchema
                .findOneAndUpdate(
                  { uuid: userdetails.uuid },
                  { firstLoginStatus: true },
                  { new: true }
                )
                .exec();
            }
            let payload = { uuid: userdetails.uuid, role: userdetails.role };
            // let payload = {uuid: userdetails.uuid,role:Admin}
            if (match) {
              let userdetails = details.toObject(); //to append jwt token
              let jwttoken = jwt.sign(payload, process.env.secretKey);
              userdetails.jwttoken = jwttoken;
              await userSchema
                .findOneAndUpdate(
                  { uuid: userdetails.uuid },
                  { loginStatus: true },
                  { new: true }
                )
                .exec();
              return res.status(200).json({
                status: "success",
                message: "Login successfully",
                data: { userdetails, jwttoken },
              });
            } else {
              return res
                .status(200)
                .json({ status: "failure", message: "Login failed" });
            }
          }
        }
      }
      } catch (error) {
        console.log(error.message);
        return res.status(500).json({ status: "failure", message: error.message });
      }
    });

router.post("/logoutpage",async(req,res)=>{
    try {
        await userSchema
          .findOneAndUpdate(
            { uuid: req.params.uuid }, { lastedVisited: date, loginStatus: false },
            { new: true })
          .exec();
        return res
          .status(200)
          .json({ status: "success", message: "Logout successfully" });
      } catch (error) {
        console.log(error.message);
        return res.status(500).json({ status: "failure", message: error.message });
      }
})

module.exports = router