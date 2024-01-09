const nodemailer = require('nodemailer');

const sendEmail = async (req, res) => {
    try {
        const { email } = req.body;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Regarding the subscription in the United Kingdom for Education and Learning',
            html: `<p>Hello</p>
            <p>You got a new message from United Kingdom For education and learning</p>
            <p style="padding: 12px; border-left: 4px solid #d0d0d0; font-style: italic;">
                thank you for subscribing in our website,
                we hope to see you a part of our community,
                for joining this community use the following link "https://united-kingdom-for-education-and.onrender.com/signup"
            </p>
            <p>
                Sincerely,<br>The United Kingdom For Education and Learning Public Relations' team
            </p>`,
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log('Email sent successfully');

            res.status(200).json({
                success: true,
                message: 'Email sent successfully',
            });
        } catch (error) {
            console.error('Error sending email:', error);

            res.status(500).json({
                success: false,
                message: 'Unable to send email',
                error: error,
            });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: 'An unexpected error occurred',
            error: error,
        });
    }
};

module.exports = {
    sendEmail,
};
