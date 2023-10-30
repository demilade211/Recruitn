import dotenv from "dotenv"; 
const { MailtrapClient } = require("mailtrap");

dotenv.config({ path: "config/config.env" });
 

const sendEmail = async (options:any) => {



  const TOKEN = "e11974ddce280b7d7a4b3d7c42e939d8";
  const ENDPOINT = "https://send.api.mailtrap.io/";

  const client = new MailtrapClient({ endpoint: ENDPOINT, token: TOKEN });

  const sender = {   email: "noreply@tuale.app" };

  await client.send({
    from: sender,
    to: [{ email: options.email }],
    subject: options.subject,
    text: options.message,
  }) 
 
}

export default sendEmail;