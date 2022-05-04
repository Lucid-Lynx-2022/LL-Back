const express = require('express');
const config = require('./config');
const nodeMailer = require('nodemailer');
const {google} = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const configEmail = require('./config/configEmail.js');

const app = express();

const PublicsRouter = require('./api/publics');

app.use(express.json());
app.use('/publics', PublicsRouter);

app.listen(config.port, config.host, function () {
    console.log(`(if local) App listening on http://localhost:${config.port}`);
  });

const OAuth2Client = new OAuth2(configEmail.clientId, configEmail.clientSecret);
OAuth2Client.setCredentials({ refresh_token: configEmail.refreshToken });

function sendEmail(name, recipient){
  const accessToken = OAuth2Client.getAccessToken()
  const smtpTransport = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: configEmail.user,
      clientId: configEmail.clientId,
      clientSecret: configEmail.clientSecret,
      refreshToken: configEmail.refreshToken,
      accessToken: accessToken
    }
  });

  const mailOptions = {
    from: `LUCID LYNX <${configEmail.user}>`,
    to: recipient,
    subject: 'A Message from LUCID LYNX',
    html: getHtmlMessage(name)
  };

  smtpTransport.sendMail(mailOptions, (error, response) => {
    if (error) {
      console.log('Error:', error);
    } else {
      console.log(`Message sent: ${response.messageId}`);
    }
    smtpTransport.close();
  });

}

function getHtmlMessage(name){
  return `<h1>Hi ${name}!</h1>
  <p>
    This is a message from LUCID LYNX.
  </p>
  <p>
    Thanks for the Donation!!!
  </p>
  <p>
    - LUCID LYNX
  </p>`
}

sendEmail('Paco', 'mqhzumamzpwgwijwcc@kvhrs.com')