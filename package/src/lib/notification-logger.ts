// Notification logging utilities
import { createClient } from "@/lib/supabase/server";

export type NotificationType = 'email' | 'sms';
export type NotificationStatus = 'pending' | 'sent' | 'failed';

export async function logNotification(params: {
  refundRequestId: string;
  userId?: string;
  type: NotificationType;
  recipient: string;
  status: NotificationStatus;
  externalId?: string;
  errorMessage?: string;
}) {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('notification_logs')
      .insert({
        refund_request_id: params.refundRequestId,
        notification_type: params.type,
        recipient: params.recipient,
        status: params.status,
        provider_message_id: params.externalId,
        error_message: params.errorMessage,
      })
      .select()
      .single();

    if (error) {
      console.error('[v0] Failed to log notification:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('[v0] Notification logging error:', error);
    return null;
  }
}

export async function getNotificationStatus(refundRequestId: string) {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('notification_logs')
      .select('*')
      .eq('refund_request_id', refundRequestId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[v0] Failed to fetch notification status:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('[v0] Error fetching notification status:', error);
    return [];
  }
}

export function maskSensitiveData(data: unknown): unknown {
  if (typeof data === 'object' && data !== null) {
    const obj = data as Record<string, unknown>;
    return {
      ...obj,
      recipient: obj.recipient ? (typeof obj.recipient === 'string' ? 'masked' : obj.recipient) : undefined,
      error_message: obj.error_message ? 'masked' : undefined,
    };
  }
  return data;
}
