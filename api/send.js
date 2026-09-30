export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: "Brevo API key not configured" });
    }

    try {
        const response = await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "api-key": apiKey
            },
            body: JSON.stringify({
                sender: { 
                    name: "Portfolio Contact Form", 
                    email: "aaronfernandes08112004@gmail.com" // Must match your verified sender in Brevo
                },
                to: [
                    { 
                        email: "aaronfernandes08112004@gmail.com", 
                        name: "Aaron Fernandes" 
                    }
                ],
                replyTo: { email: email, name: name },
                subject: `[Portfolio Inquiry] ${subject}`,
                htmlContent: `
                    <h3>New message from your Portfolio:</h3>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Phone:</strong> ${phone || "N/A"}</p>
                    <p><strong>Subject:</strong> ${subject}</p>
                    <p><strong>Message:</strong><br>${message.replace(/\n/g, "<br>")}</p>
                `
            })
        });

        if (!response.ok) {
            const errData = await response.json();
            return res.status(500).json({ error: errData });
        }

        return res.status(200).json({ success: true, message: "Email sent" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}