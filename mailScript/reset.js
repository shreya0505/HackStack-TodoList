const nodemailer = require("nodemailer");
const config = require("config");
const email = config.get("email");
const pass = config.get("pass");

module.exports.mailreset = (to, hash, name) => {
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
    subject: "HackStack TodoList Password Reset",
    text: `Dear ${name},\n Here is the temporary password for your account. Please change your password on login. 
        \nE-mail : \t\t ${to}
        \nTemporary Password : \t\t ${hash}
        \n\n If this request was not made by you, contact: ${email}`,
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
