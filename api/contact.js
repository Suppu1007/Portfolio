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

    // Call Resend's API to dispatch the email
    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Portfolio Contact <onboarding@resend.dev>', // Resend testing email
        to: 'mathyamsupriya@gmail.com',
        subject: `New Portfolio Message from ${name}`,
        html: `<p><strong>From:</strong> ${name} (${email})</p><p><strong>Message:</strong><br/>${message}</p>`
      })
    });

    if (!emailRes.ok) {
      throw new Error(`Resend API Error: ${emailRes.statusText}`);
    }

    // Return a verified success response
    return res.status(200).json({ success: true, message: "Your message has been sent successfully directly to your inbox!" });
  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({ error: 'Internal Server Error. Please try again later.' });
  }
}
