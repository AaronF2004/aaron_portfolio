function escapeHtml(str) {
    if (!str) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { name, email, phone, subject, message } = req.body || {};

    if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: "Brevo API key not configured on server" });
    }

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safePhone = escapeHtml(phone || "N/A");
    const safeSubject = escapeHtml(subject);
    const safeMessage = escapeHtml(message).replace(/\n/g, "<br>");

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
                    email: "aaronfernandes08112004@gmail.com" 
                },
                to: [
                    { 
                        email: "aaronfernandes08112004@gmail.com", 
                        name: "Aaron Fernandes" 
                    }
                ],
                replyTo: { email: email.trim(), name: name.trim() },
                subject: `[Portfolio Inquiry] ${subject.trim()}`,
                htmlContent: `
                    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #250713; max-width: 600px; margin: 0 auto; border: 1px solid rgba(148, 27, 75, 0.2); border-radius: 12px; overflow: hidden;">
                        <div style="background: #941B4B; padding: 20px; color: #ffffff;">
                            <h2 style="margin: 0; font-size: 20px;">New Portfolio Contact Message</h2>
                        </div>
                        <div style="padding: 24px; background: #fffdfd;">
                            <p style="margin: 0 0 10px;"><strong>Name:</strong> ${safeName}</p>
                            <p style="margin: 0 0 10px;"><strong>Email:</strong> <a href="mailto:${safeEmail}" style="color: #941B4B;">${safeEmail}</a></p>
                            <p style="margin: 0 0 10px;"><strong>Phone:</strong> ${safePhone}</p>
                            <p style="margin: 0 0 18px;"><strong>Subject:</strong> ${safeSubject}</p>
                            <div style="padding: 16px; background: #fff0f5; border-left: 4px solid #941B4B; border-radius: 6px; color: #171017;">
                                <strong style="display: block; margin-bottom: 6px; color: #941B4B;">Message:</strong>
                                ${safeMessage}
                            </div>
                        </div>
                    </div>
                `
            })
        });

        if (!response.ok) {
            const errData = await response.json();
            return res.status(response.status).json({ error: errData });
        }

        return res.status(200).json({ success: true, message: "Email sent successfully" });
    } catch (error) {
        return res.status(500).json({ error: error.message || "Internal server error" });
    }
}