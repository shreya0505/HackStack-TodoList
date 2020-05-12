const nodemailer = require("nodemailer");
const config = require("config");
const email = config.get("email");
const pass = config.get("pass");

module.exports.mailverify = async (to, otp, name) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: email,
      pass: pass,
    },
  });
  var mail = {
    from: "noreplymailfortest@ethereal.email",
    to: to,
    subject: "HackStack TodoList Account Verification",
    text: `Dear ${name},\n Enter this otp to confirm your account. \nE-mail : ${to}\nOTP : ${otp}`,
  };
  transporter.sendMail(mail, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log("Message sent: %s", info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

      // Preview only available when sending through an Ethereal account
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }
  });
};
