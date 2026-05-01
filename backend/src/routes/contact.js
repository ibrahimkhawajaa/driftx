import express from "express";
import nodemailer from "nodemailer";
const router = express.Router();

// Configure email transporter (Gmail)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "your-email@gmail.com",
    pass: process.env.EMAIL_PASSWORD || "your-app-password",
  },
});

router.post("/", async (req, res) => {
  try {
    const { name, email, phone, propertyId, propertyTitle, message } = req.body;

    if (!name || !email || !phone || !propertyId || !propertyTitle) {
      return res.status(400).json({ error: "Missing required contact fields" });
    }

    console.log("New contact request:", {
      name,
      email,
      phone,
      propertyId,
      propertyTitle,
      message,
    });

    // Send email to admin
    const adminEmailContent = `
      <h2>New Property Inquiry</h2>
      <p><strong>Property:</strong> ${propertyTitle}</p>
      <p><strong>Property ID:</strong> ${propertyId}</p>
      <hr />
      <h3>Visitor Information</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <hr />
      <h3>Message</h3>
      <p>${message || "No message provided"}</p>
    `;

    // Send email to visitor
    const visitorEmailContent = `
      <p>Hi ${name},</p>
      <p>Thank you for your interest in <strong>${propertyTitle}</strong>. We have received your inquiry and our team will reach out to you shortly.</p>
      <p>Best regards,<br/>Monarque Stays Team</p>
    `;

    // Send emails asynchronously (don't wait for them)
    Promise.all([
      transporter.sendMail({
        from: process.env.EMAIL_USER || "your-email@gmail.com",
        to: "ibrahimmkhawajaa@gmail.com",
        subject: `New Property Inquiry: ${propertyTitle}`,
        html: adminEmailContent,
      }),
      transporter.sendMail({
        from: process.env.EMAIL_USER || "your-email@gmail.com",
        to: email,
        subject: `We received your inquiry - ${propertyTitle}`,
        html: visitorEmailContent,
      }),
    ]).catch((emailErr) => {
      console.error("Email sending error:", emailErr);
    });

    // Return success immediately without waiting for emails
    return res.status(201).json({ ok: true, message: "Inquiry submitted successfully" });
  } catch (err) {
    console.error("Contact form error:", err);
    return res.status(500).json({ error: "Failed to submit contact request" });
  }
});

export default router;
