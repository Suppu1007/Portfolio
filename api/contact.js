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

    // Here you would typically integrate with an email service like Resend, SendGrid, etc.
    // Example:
    // const apiKey = process.env.EMAIL_API_KEY; 
    // await sendEmail({ to: 'mathyamsupriya@gmail.com', subject: `New message from ${name}`, body: message });

    // For now, we simulate a successful integration.
    console.log(`Received message from ${name} (${email}): ${message}`);

    // Return a success response
    return res.status(200).json({ success: true, message: "Your message has been sent successfully!" });
  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({ error: 'Internal Server Error. Please try again later.' });
  }
}
