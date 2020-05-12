const nodemailer = require("nodemailer");
const config = require("config");
const email = config.get("email");
const pass = config.get("pass");

module.exports.mailinvite = async (to, manager , teamName, purpose, teamid, joinCode) => {
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
        text: `Hey there!,
        \n\t ${manager} has invited you to collaborate on:
        \n Project: ${teamName}
        \n Purpose: ${purpose}
        \n\n To accept the invite Sign up/ Login to your HackStack Todoist account 
        and join the project using given Team Id and Join Code. 
        \n Team Id:\t ${teamid}
        \n Join Code :  \t${joinCode}`,
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
