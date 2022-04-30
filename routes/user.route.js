
const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userSchema = require("../model/user.model");
const { userJoiSchema } = require('../validation/user.joischema');


router.post('/signupPage', async (req, res) => {
    try {
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const userName = req.body.userName;
        const password = req.body.password;
        const email = req.body.email;
        const mobileNumber = req.body.mobileNumber;

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
            } else {
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

router.post("/loginpage", async (req, res) => {
    try {
        const userName = req.body.userName;
        const password = req.body.password;
        let details = await userSchema.findOne({ userName: userName }).select("-userName -_id ").exec();
        if (userName && password) {
            userdetails = await userSchema.findOne({ userName: userName }).exec();
            if (!userdetails) {
                return res
                    .status(400).json({
                        status: "failure",
                        message: "Don't have an account?please Register",
                    });
            } else if (userdetails) {
                console.log("userdetails password", userdetails.password);
                let match = await bcrypt.compare(password, userdetails.password);
                console.log("matchpass", match);
                let payload = { uuid: userdetails.uuid, role: userdetails.role,userName:userdetails.userName }
                if (match) {
                    let userdetails1 = details.toObject();
                    let jwttoken = jwt.sign(payload, process.env.secretKey);
                    userdetails1.jwttoken = jwttoken;
                    await userSchema.findOneAndUpdate({ uuid: userdetails1.uuid }).exec();
                    return res.status(200).json({
                        status: "success",
                        message: "Login successfully",
                        data: { userdetails1, jwttoken },
                    });
                } else {
                    return res
                        .status(200)
                        .json({ status: "failure", message: "Login failed" });
                }
            }
        }


    } catch (error) {
        return res.status(200).json({ status: "failure", message: error.message })
    }

})

router.post("/logoutpage",async(req,res)=>{
    try {
        await userSchema
          .findOneAndUpdate(
            { uuid: req.params.uuid })
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