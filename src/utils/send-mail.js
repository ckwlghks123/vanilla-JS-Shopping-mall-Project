import smtpTransport from "../../email";

const sendMail = (to, subject, text) =>
  new Promise((resolve, reject) => {
    const message = {
      from: "pets shopping",
      to,
      subject,
      text,
    };

    smtpTransport.sendMail(message, (err, info) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(info);
    });
  });
