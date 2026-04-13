import { NextResponse } from 'next/server';

// Configuration
const SUPPORT_EMAIL = "accesssupport.ai@gmail.com";
const SUPPORT_PHONE = "+55 46 99919-2885";

export async function GET() {
  try {
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ 
        success: false,
        error: 'RESEND_API_KEY not configured',
        message: 'Please add RESEND_API_KEY to environment variables'
      }, { status: 400 });
    }

    // Using verified domain tikcash.money
    const testEmail = {
      from: 'TikCash Support <support@tikcash.money>',
      to: SUPPORT_EMAIL,
      subject: 'TikCash Email Test - System Check',
      text: `Email system test from TikCash\n\nIf you received this, the email system is working correctly!\n\nSupport Email: ${SUPPORT_EMAIL}\nSupport Phone: ${SUPPORT_PHONE}`,
      html: `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #FE2C55; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background-color: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
        .success { color: #27ae60; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>TikCash Email System Test</h1>
        </div>
        <div class="content">
            <p class="success">Email system is working correctly!</p>
            <p>If you received this email, the Resend integration is properly configured.</p>
            <hr/>
            <p><strong>Support Contact:</strong></p>
            <p>Email: ${SUPPORT_EMAIL}</p>
            <p>Phone: ${SUPPORT_PHONE}</p>
        </div>
    </div>
</body>
</html>
      `
    };

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testEmail),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ 
        success: false,
        error: data.message || 'Email send failed',
        details: data
      }, { status: response.status });
    }

    return NextResponse.json({ 
      success: true,
      message: 'Test email sent successfully',
      emailId: data.id,
      sentTo: SUPPORT_EMAIL,
      from: 'support@tikcash.money',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return NextResponse.json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
