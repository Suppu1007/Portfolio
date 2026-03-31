export default async function handler(req, res) {
  // Only allow POST requests for the contact form
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { name, email, message } = req.body;

    // Validate the input
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Integrate with Resend to actually send the email using an Environment Variable securely
    const resendApiKey = process.env.RESEND_API_KEY; 
    
    if (!resendApiKey) {
      // If no key is configured yet, we just log it as a simulation
      console.log(`[Simulation] Received message from ${name} (${email}): ${message}`);
      return res.status(200).json({ success: true, message: "Server received your message! (Email API key not configured yet)" });
    }

    // Fire two emails concurrently:
    // 1. Notification to You
    const notifyPromise = fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Portfolio Contact <onboarding@resend.dev>', // Sender
        to: 'mathyamsupriya@gmail.com', // Receiver: You
        subject: `New Contact from ${name}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 30px; background-color: #fafafa; border-radius: 8px;">
            <h2 style="color: #111; margin-bottom: 20px; font-family: 'Playfair Display', serif;">📩 New Portfolio Contact Request</h2>
            
            <table style="width: 100%; max-width: 600px; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); margin: 0 auto;">
              <tr>
                <td style="padding-bottom: 15px; width: 80px; color: #555;"><strong>Name:</strong></td>
                <td style="padding-bottom: 15px; color: #111;">${name}</td>
              </tr>
              <tr>
                <td style="padding-bottom: 15px; color: #555;"><strong>Email:</strong></td>
                <td style="padding-bottom: 15px;"><a href="mailto:${email}" style="color: #bc9c82; text-decoration: none; font-weight: bold;">${email}</a></td>
              </tr>
              <tr>
                <td colspan="2" style="padding-top: 15px; border-top: 1px solid #eee;">
                  <strong style="color: #555;">Message:</strong>
                  <div style="margin-top: 15px; padding: 20px; background: #f4f1ec; border-left: 4px solid #bc9c82; color: #333; line-height: 1.6; border-radius: 0 4px 4px 0;">
                    ${message}
                  </div>
                </td>
              </tr>
            </table>

            <p style="font-size: 12px; color: #888; margin-top: 30px; text-align: center;">
              Sent securely from your Mathyam Supriya AI Portfolio
            </p>
          </div>
        `
      })
    });

    // 2. Beautiful Auto-Reply to the User
    const autoReplyPromise = fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Mathyam Supriya <onboarding@resend.dev>', // Note: Use your verified domain email later if upgraded (e.g. supriya@cortexa.dev)
        to: email, // Receiver: The person who filled the form
        subject: `Thank you for reaching out, ${name}!`,
        html: `
          <div style="font-family: Arial, sans-serif; color: #111; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #d4cfc7; padding: 30px; text-align: center;">
              <h2 style="margin: 0; color: #111; font-family: 'Playfair Display', serif;">I received your message!</h2>
            </div>
            <div style="padding: 30px; background-color: #f4f1ec;">
              <p>Hi <strong>${name}</strong>,</p>
              <p>Thank you for getting in touch through my portfolio. This is an auto-reply just to let you know that your message landed safely in my inbox.</p>
              <p>I will review your message and get back to you as soon as possible.</p>
              <hr style="border: none; border-top: 1px solid #ccc; margin: 25px 0;" />
              <p style="font-size: 0.85em; color: #555;"><strong>Your Original Message:</strong><br/><em>"${message}"</em></p>
            </div>
          </div>
        `
      })
    });

    // Wait for both emails to send
    const [notifyRes, autoReplyRes] = await Promise.all([notifyPromise, autoReplyPromise]);

    if (!notifyRes.ok || !autoReplyRes.ok) {
      throw new Error(`Resend API Error. Notify: ${notifyRes.statusText}, Auto-Reply: ${autoReplyRes.statusText}`);
    }

    // Return a verified success response
    return res.status(200).json({ success: true, message: "Your message has been sent successfully directly to your inbox!" });
  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({ error: 'Internal Server Error. Please try again later.' });
  }
}
