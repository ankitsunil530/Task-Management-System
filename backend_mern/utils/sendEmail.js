import nodemailer from "nodemailer";

const createTransporter = () => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !EMAIL_FROM) {
    throw new Error("SMTP configuration is missing");
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
};

export const sendVerificationEmail = async ({ to, name, verificationUrl }) => {
  const transporter = createTransporter();
  const { EMAIL_FROM } = process.env; 

  const info = await transporter.sendMail({
    from: EMAIL_FROM,
    to,
    subject: "Verify your email address",
    text: `Hi ${name}, please verify your email address by visiting: ${verificationUrl}`,
    html: `
      <p>Hi ${name},</p>
      <p>Please verify your email address to activate your account.</p>
      <p><a href="${verificationUrl}">Verify email</a></p>
      <p>If you did not create this account, you can ignore this email.</p>
    `,
  });

  return {
    messageId: info.messageId,
    previewUrl: nodemailer.getTestMessageUrl(info),
  };
};