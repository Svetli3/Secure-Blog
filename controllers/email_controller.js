// NodeMailer Guide Source: https://www.w3schools.com/nodejs/nodejs_email.asp

const nodemailer = require('nodemailer');
const { setDefaultHighWaterMark } = require('nodemailer/lib/xoauth2');

async function sendEmail(recipient, header, body)
{
  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'camelspprt@gmail.com',
        pass: 'fzei bzdn roxq wcnx'
      }
    });

    const mailOptions = {
      from: 'camelspprt@gmail.com',
      to: recipient,
      subject: header,
      text: body
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    setVerificationCode(body.split(":")[1])
    return true
  } catch (error) {
    console.error('Error occurred:', error);
    return false
  }
}

var verficationCode;
async function getVerificationCode(){
  return verficationCode
} 

async function setVerificationCode(code){
  verficationCode = code
} 

module.exports.sendEmail = sendEmail;
module.exports.setVerificationCode = setVerificationCode;
module.exports.getVerificationCode = getVerificationCode;