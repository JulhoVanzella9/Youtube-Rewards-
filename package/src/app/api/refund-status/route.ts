import { NextResponse } from 'next/server';
import { createClient } from "@/lib/supabase/server";
import { getNotificationStatus, maskSensitiveData } from "@/lib/notification-logger";

// GET - Check notification status for a refund request
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const refundRequestId = searchParams.get('refundRequestId');

    if (!refundRequestId) {
      return NextResponse.json({ 
        error: 'refundRequestId parameter is required' 
      }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Verify user owns this refund request
    if (user) {
      const { data: refundRequest } = await supabase
        .from('refund_requests')
        .select('id, user_id')
        .eq('id', refundRequestId)
        .single();

      if (refundRequest && refundRequest.user_id !== user.id) {
        return NextResponse.json({ 
          error: 'Unauthorized' 
        }, { status: 403 });
      }
    }

    // Get notification logs
    const notifications = await getNotificationStatus(refundRequestId);

    // Return masked status (no sensitive data exposed)
    const safeNotifications = notifications.map(notif => ({
      type: notif.notification_type,
      status: notif.status,
      timestamp: notif.created_at,
    }));

    return NextResponse.json({ 
      success: true,
      refundRequestId,
      notifications: safeNotifications,
      summary: {
        emailSent: notifications.some(n => n.notification_type === 'email' && n.status === 'sent'),
        smsSent: notifications.some(n => n.notification_type === 'sms' && n.status === 'sent'),
        emailFailed: notifications.some(n => n.notification_type === 'email' && n.status === 'failed'),
        smsFailed: notifications.some(n => n.notification_type === 'sms' && n.status === 'failed'),
      }
    });
  } catch (error) {
    console.error('[v0] Notification status API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
