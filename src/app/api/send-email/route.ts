import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { SendEmailRequestPayload } from "@/app/types/sendEmailRequestPayload";

export async function POST(request: Request) {
  const { giver, receiver }: SendEmailRequestPayload = await request.json();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const emailTemplate = `
  <!DOCTYPE html>
  <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          color: #333;
        }
        .container {
          padding: 20px;
          text-align: center;
        }
        h1 {
          color: #d32f2f;
        }
        .content {
          background-color: #f7f7f7;
          padding: 15px;
          margin-top: 20px;
          border-radius: 8px;
          text-align: left;
        }
        .highlight {
          color: #d32f2f;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>BBLD Secret Santa 🎅</h1>
        <p>Hi <span class="highlight">${giver.nickname}</span>!</p>
        <div class="content">
          <p>🎄 The holiday season is here, and it’s time to share some cheer! You’ve been chosen to give a special gift to <span class="highlight">${receiver.nickname}</span>.</p>
          <p>🎁 Please keep your assignment a secret and make it special for your recipient. Remember, it's all about spreading joy and thoughtfulness!</p>
        </div>
        <p>Happy gifting, and may your holidays be filled with joy!</p>
        <p>- The BBLD Secret Santa Team 🎅</p>
      </div>
    </body>
  </html>
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: giver.email,
    subject: "BBLD Secret Santa Assignments",
    html: emailTemplate,
  };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send email" },
      { status: 500 },
    );
  }
}
