import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, email, phone, serviceType, message } = req.body;

    // Server-side validation
    if (!name || !email || !phone || !serviceType || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Format service type for display
    const formatServiceType = (type) => {
      return type
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    };

    // Send email to business owner
    const ownerEmail = await resend.emails.send({
      from: "UK Roofing <noreply@ukrrofing.com.au>",
      to: ["ukrrofing@gmail.com"],
      subject: `🏠 New Inquiry: ${formatServiceType(serviceType)} - ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #fb923c 0%, #f97316 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .field { margin-bottom: 20px; }
              .label { font-weight: bold; color: #f97316; margin-bottom: 5px; }
              .value { background: white; padding: 10px; border-radius: 5px; border-left: 3px solid #f97316; }
              .footer { margin-top: 20px; padding-top: 20px; border-top: 2px solid #ddd; text-align: center; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🏠 New Customer Inquiry</h1>
              </div>
              <div class="content">
                <div class="field">
                  <div class="label">Customer Name:</div>
                  <div class="value">${name}</div>
                </div>
                
                <div class="field">
                  <div class="label">Email:</div>
                  <div class="value"><a href="mailto:${email}">${email}</a></div>
                </div>
                
                <div class="field">
                  <div class="label">Phone:</div>
                  <div class="value"><a href="tel:${phone}">${phone}</a></div>
                </div>
                
                <div class="field">
                  <div class="label">Service Required:</div>
                  <div class="value">${formatServiceType(serviceType)}</div>
                </div>
                
                <div class="field">
                  <div class="label">Project Details:</div>
                  <div class="value">${message.replace(/\n/g, "<br>")}</div>
                </div>
                
                <div class="footer">
                  <p>This inquiry was submitted via your website contact form.</p>
                  <p>Please respond within 24 hours for the best customer experience.</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    console.log("✅ Owner email sent:", ownerEmail.data?.id);

    // Send confirmation email to customer
    const customerEmail = await resend.emails.send({
      from: "UK Roofing <noreply@ukrrofing.com.au>",
      to: [email],
      subject: "Thank you for your inquiry - UK Roofing",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #fb923c 0%, #f97316 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .message { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
              .summary { background: #fff5ed; border-left: 4px solid #f97316; padding: 15px; margin: 20px 0; }
              .footer { margin-top: 20px; padding-top: 20px; border-top: 2px solid #ddd; text-align: center; color: #666; }
              .button { display: inline-block; background: #f97316; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
              h2 { color: #f97316; }
              .steps { background: white; padding: 20px; border-radius: 5px; }
              .steps ol { padding-left: 20px; }
              .steps li { margin: 10px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>✓ Thank You for Your Inquiry!</h1>
              </div>
              <div class="content">
                <div class="message">
                  <p>Hi ${name},</p>
                  <p>Thank you for contacting UK Roofing! We've received your inquiry about <strong>${formatServiceType(serviceType)}</strong> and one of our roofing specialists will get back to you within 24 hours.</p>
                </div>
                
                <h2>Your Inquiry Summary:</h2>
                <div class="summary">
                  <p><strong>Service:</strong> ${formatServiceType(serviceType)}</p>
                  <p><strong>Message:</strong> ${message.replace(/\n/g, "<br>")}</p>
                </div>
                
                <div class="steps">
                  <h3>What Happens Next?</h3>
                  <ol>
                    <li>Our team will review your inquiry</li>
                    <li>We'll contact you within 24 hours to discuss your project</li>
                    <li>We'll schedule a free consultation if needed</li>
                    <li>Receive a detailed quote for your roofing project</li>
                  </ol>
                </div>
                
                <div class="footer">
                  <p><strong>Need immediate assistance?</strong></p>
                  <p>Call us at: <a href="tel:0404631472">0404 631 472</a></p>
                  <p>Email: <a href="mailto:ukrrofing@gmail.com">ukrrofing@gmail.com</a></p>
                  <br>
                  <p style="font-size: 12px;">UK Roofing - Your Trusted Roofing Partner<br>www.ukrrofing.com.au</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    console.log("✅ Customer confirmation sent:", customerEmail.data?.id);

    return res.status(200).json({
      success: true,
      message: "Inquiry sent successfully",
      ownerEmailId: ownerEmail.data?.id,
      customerEmailId: customerEmail.data?.id,
    });
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return res.status(500).json({
      error: "Failed to send inquiry. Please try again or contact us directly.",
      details: error.message,
    });
  }
}
