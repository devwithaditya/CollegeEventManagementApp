function generateOTP(){
    return Math.floor(100000 + Math.random() * 900000).toString()
}

function otpTemplate(otp){
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Email Verification</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">

    <table align="center" width="500" cellpadding="0" cellspacing="0"
        style="background: white; border-radius: 10px; padding: 30px;">

        <tr>
            <td align="center">
                <h2 style="color: #333;">Email Verification</h2>
            </td>
        </tr>

        <tr>
            <td>
                <p>Hello,</p>

                <p>
                    Thank you for registering. Please use the following
                    One-Time Password (OTP) to verify your email address:
                </p>

                <div
                    style="
                        background: #f0f4ff;
                        padding: 15px;
                        text-align: center;
                        font-size: 32px;
                        font-weight: bold;
                        letter-spacing: 8px;
                        border-radius: 8px;
                        margin: 20px 0;
                    ">
                    ${otp}
                </div>

                <p>
                    This OTP will expire in <strong>5 minutes</strong>.
                </p>

                <p>
                    If you did not request this verification, please ignore this email.
                </p>

                <br>

                <p>
                    Regards,<br>
                    CEC Events
                </p>
            </td>
        </tr>

    </table>

</body>
</html>`
}

module.exports = {generateOTP,otpTemplate}