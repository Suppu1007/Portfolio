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

    // 1. Notification to You
    const notifyRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev', // Must be this exact email for Resend free tier
        to: 'mathyamsupriya@gmail.com', // IMPORTANT: This must match the email you verified on Resend exactly!
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

    // Extract detailed error from Resend if it fails
    if (!notifyRes.ok) {
        const errorData = await notifyRes.json();
        console.error("Resend API Error details:", errorData);
        throw new Error(errorData.message || `Resend API Error: ${notifyRes.statusText}`);
    }

    /* 
      NOTE: The Auto-Reply to the visitor has been temporarily disabled. 
      Resend's Free Sandbox tier (using onboarding@resend.dev) strictly PROHIBITS sending 
      emails to unverified addresses (like the visitor's random email address). 
      It only allows sending emails to your own verified email. 
      To enable auto-replies, you must verify a custom domain in Resend.
    */

    // Return a verified success response
    return res.status(200).json({ success: true, message: "Your message has been sent successfully directly to your inbox!" });
  } catch (error) {
    console.error('Contact form error:', error);
    // Send the actual error message back to the frontend so we can see why it failed 
    return res.status(500).json({ error: error.message || 'Internal Server Error. Please try again later.' });
  }
}
