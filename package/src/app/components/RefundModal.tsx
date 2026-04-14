"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n/context";
import { createClient } from "@/lib/supabase/client";

interface RefundModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ExistingRequest {
  id: string;
  purchase_code: string;
  status: string;
  created_at: string;
}

interface NotificationStatus {
  type: 'email' | 'sms';
  status: 'pending' | 'sent' | 'failed';
  timestamp: string;
}

export default function RefundModal({ isOpen, onClose }: RefundModalProps) {
  const { t } = useI18n();
  const [step, setStep] = useState<"legal" | "form">("legal");
  const [email, setEmail] = useState("");
  const [purchaseCode, setPurchaseCode] = useState("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [existingRequests, setExistingRequests] = useState<ExistingRequest[]>([]);
  const [duplicateError, setDuplicateError] = useState<string | null>(null);
  const [lastRequestId, setLastRequestId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [notificationStatus, setNotificationStatus] = useState<{ emailSent: boolean; smsSent: boolean }>(
    { emailSent: false, smsSent: false }
  );

  // Get current user and fetch existing refund requests when modal opens
  useEffect(() => {
    if (isOpen) {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          setUserId(user.id);
          fetch(`/api/refund?userId=${user.id}`)
            .then(r => r.json())
            .then(data => {
              if (data.requests) {
                setExistingRequests(data.requests);
              }
            })
            .catch(() => {});
        }
      });
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !purchaseCode || !reason) return;
    
    setIsSubmitting(true);
    setDuplicateError(null);
    
    try {
      const response = await fetch('/api/refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, purchaseCode, reason, userId }),
      });
      
      const data = await response.json();
      
      if (response.status === 409 && data.error === 'duplicate_request') {
        // Duplicate request detected - show message with days remaining
        setDuplicateError(data.message || 'You already have a refund request from this account.');
        setIsSubmitting(false);
        return;
      }

      if (response.status === 401 && data.error === 'authentication_required') {
        setDuplicateError(data.message || 'You must be logged in to submit a refund request.');
        setIsSubmitting(false);
        return;
      }
      
      if (!response.ok) {
        setDuplicateError(data.message || data.error || 'Failed to submit refund request');
        setIsSubmitting(false);
        return;
      }
      
      setIsSubmitting(false);
      setSubmitted(true);
      setLastRequestId(data.requestId);
      
      // Poll for notification status
      let attempts = 0;
      const pollInterval = setInterval(async () => {
        attempts++;
        try {
          const statusResponse = await fetch(
            `/api/refund-status?refundRequestId=${data.requestId}`
          );
          const statusData = await statusResponse.json();
          
          if (statusData.success && statusData.summary) {
            setNotificationStatus({
              emailSent: statusData.summary.emailSent,
              smsSent: statusData.summary.smsSent,
            });
            
            // Stop polling if both sent successfully or after 30 attempts (30 seconds)
            if ((statusData.summary.emailSent && statusData.summary.smsSent) || attempts >= 30) {
              clearInterval(pollInterval);
            }
          }
        } catch (error) {
          console.error('[v0] Error polling notification status:', error);
        }
      }, 1000);
      
      setTimeout(() => {
        clearInterval(pollInterval);
        handleClose();
      }, 5000);
    } catch (error) {
      console.error('Refund request error:', error);
      setDuplicateError('Connection error. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setStep("legal");
    setEmail("");
    setPurchaseCode("");
    setReason("");
    setSubmitted(false);
    setDuplicateError(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: "fixed", inset: 0,
            background: "rgba(0,0,0,0.95)",
            display: "flex", alignItems: "flex-start", justifyContent: "center",
            padding: "8px", zIndex: 1000,
            flexDirection: "column",
            overflowY: "auto",
            WebkitOverflowScrolling: "touch",
          }}
          onClick={() => !isSubmitting && handleClose()}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%", maxWidth: step === "legal" ? "600px" : "420px",
              display: "flex", flexDirection: "column", alignItems: "center",
              margin: "auto",
              padding: "10px 0",
            }}
          >
            {step === "legal" ? (
              /* Legal Notice Step */
              <>
                {/* YouCash Logo - same as TopBar, centered */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  marginBottom: "16px",
                  width: "100%",
                }}>
                  <div style={{
                    width: "36px", height: "36px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <svg width="36" height="26" viewBox="0 0 68 48" fill="none">
                      <path d="M66.52 7.74C65.72 4.64 63.28 2.2 60.18 1.4C54.9 0 34 0 34 0S13.1 0 7.82 1.4C4.72 2.2 2.28 4.64 1.48 7.74C0 13.02 0 24 0 24S0 34.98 1.48 40.26C2.28 43.36 4.72 45.8 7.82 46.6C13.1 48 34 48 34 48S54.9 48 60.18 46.6C63.28 45.8 65.72 43.36 66.52 40.26C68 34.98 68 24 68 24S68 13.02 66.52 7.74Z" fill="#FF0000"/>
                      <text x="34" y="24" textAnchor="middle" dominantBaseline="central" fill="white" fontSize="28" fontWeight="700" fontFamily="'Roboto', Arial, sans-serif">$</text>
                    </svg>
                  </div>
                  <span style={{
                    fontSize: "20px",
                    fontWeight: 800,
                    color: "#fff",
                    letterSpacing: "-0.5px",
                    fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
                    lineHeight: 1,
                  }}>
                    YouCash
                  </span>
                </div>

                <h2 style={{ 
                  fontSize: "16px", fontWeight: 600, color: "rgba(255,255,255,0.7)", 
                  marginBottom: "20px", textAlign: "center",
                  width: "100%",
                }}>
                  Community
                </h2>

                <div style={{
                  background: "#000",
                  padding: "24px 16px",
                  width: "100%",
                  textAlign: "center",
                  borderRadius: "12px",
                }}>
                  <h3 style={{ 
                    fontSize: "16px", fontWeight: 800, color: "#fff", 
                    marginBottom: "16px", letterSpacing: "0.5px",
                  }}>
                    LEGAL CONSEQUENCES NOTICE
                  </h3>

                  <p style={{ 
                    fontSize: "13px", color: "rgba(255,255,255,0.7)", 
                    lineHeight: 1.7, marginBottom: "24px",
                    textAlign: "left",
                  }}>
                    Please note that initiating a chargeback (a formal request to the credit provider to reverse an unrecognized transaction) without proper justification constitutes illegal conduct under the Fair Credit Billing Act (FCBA). These actions not only harm reputable and ethical businesses but also involve the refusal to acknowledge a legitimate transaction despite having received the product or service. Engaging in such practices may result in legal consequences. It is essential to maintain honesty in all online transactions to ensure a safe and trustworthy shopping environment for all parties involved.
                  </p>

                  <button
                    onClick={() => setStep("form")}
                    className="btn-3d btn-3d-primary"
                    style={{
                      fontFamily: "inherit",
                      width: "100%",
                      maxWidth: "280px",
                    }}
                  >
                    Continue Request
                  </button>
                </div>

                {/* Footer Links */}
                <div style={{ 
                  display: "flex", gap: "20px", marginTop: "24px",
                  justifyContent: "center", flexWrap: "wrap",
                }}>
                  <span style={{ fontSize: "12px", color: "#fff", fontWeight: 600, cursor: "pointer" }}>
                    Terms of Use
                  </span>
                  <span style={{ fontSize: "12px", color: "#fff", fontWeight: 600, cursor: "pointer" }}>
                    Privacy Policy
                  </span>
                </div>

                <button
                  onClick={handleClose}
                  className="btn-3d btn-3d-dark btn-3d-sm"
                  style={{
                    marginTop: "16px",
                    fontFamily: "inherit",
                  }}
                >
                  Back to Start
                </button>
              </>
            ) : (
              /* Form Step */
              <div style={{
                background: "linear-gradient(145deg, rgba(26,26,46,0.98) 0%, rgba(18,18,30,0.99) 100%)",
                borderRadius: "20px",
                border: "1px solid rgba(255,255,255,0.08)",
                padding: "20px",
                width: "100%",
                boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
              }}>
                {submitted ? (
                  <div style={{ textAlign: "center", padding: "20px 0" }}>
                    <div style={{
                      width: "64px", height: "64px", borderRadius: "50%",
                      background: "linear-gradient(135deg, #FF0000, #CC0000)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      margin: "0 auto 16px",
                    }}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>
                    <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#fff", marginBottom: "8px" }}>
                      Request Submitted!
                    </h3>
                    
                    {/* Notification Status */}
                    <div style={{ marginBottom: "16px", fontSize: "13px" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "6px", color: "rgba(255,255,255,0.8)" }}>
                        {notificationStatus.emailSent ? (
                          <>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#282828" strokeWidth="3">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            <span>Email sent</span>
                          </>
                        ) : (
                          <>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="10"/>
                              <circle cx="12" cy="12" r="3"/>
                            </svg>
                            <span>Email sending...</span>
                          </>
                        )}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", color: "rgba(255,255,255,0.8)" }}>
                        {notificationStatus.smsSent ? (
                          <>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#282828" strokeWidth="3">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            <span>SMS sent</span>
                          </>
                        ) : (
                          <>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="10"/>
                              <circle cx="12" cy="12" r="3"/>
                            </svg>
                            <span>SMS sending...</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", marginBottom: "16px" }}>
                      We will contact you soon.
                    </p>
                    
                    {/* WHATSAPP_DISABLED_START - Remove this comment block to re-enable WhatsApp */}
                    {/* WhatsApp Support Button - TEMPORARILY DISABLED
                    <a
                      href={`https://wa.me/5546999192885?text=${encodeURIComponent(
                        `Hello YouCash Support!\n\nI just submitted a refund request.\n\nEmail: ${email}\nPurchase Code: ${purchaseCode}\n\nReason:\n${reason}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        padding: "12px 20px",
                        background: "#25D366",
                        borderRadius: "12px",
                        color: "#fff",
                        fontWeight: 600,
                        fontSize: "14px",
                        textDecoration: "none",
                        marginTop: "8px",
                        transition: "transform 0.2s, box-shadow 0.2s",
                        boxShadow: "0 4px 12px rgba(37, 211, 102, 0.3)",
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = "scale(1.02)";
                        e.currentTarget.style.boxShadow = "0 6px 16px rgba(37, 211, 102, 0.4)";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                        e.currentTarget.style.boxShadow = "0 4px 12px rgba(37, 211, 102, 0.3)";
                      }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      Contact via WhatsApp
                    </a>
                    WHATSAPP_DISABLED_END */}
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    {/* Back button */}
                    <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
                      <button
                        type="button"
                        onClick={() => setStep("legal")}
                        style={{
                          background: "none", border: "none", cursor: "pointer",
                          color: "rgba(255,255,255,0.6)", padding: "4px",
                          marginRight: "12px",
                        }}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M19 12H5M12 19l-7-7 7-7"/>
                        </svg>
                      </button>
                      <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#fff" }}>
                        {t("requestRefund")}
                      </h3>
                    </div>

                    {/* Show existing pending/processing requests */}
                    {existingRequests.filter(r => r.status === 'pending' || r.status === 'processing').length > 0 && (
                      <div style={{
                        background: "rgba(255, 0, 0, 0.15)",
                        border: "1px solid rgba(255, 0, 0, 0.3)",
                        borderRadius: "12px",
                        padding: "12px 16px",
                        marginBottom: "16px",
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF0000" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="12" y1="8" x2="12" y2="12"/>
                            <line x1="12" y1="16" x2="12.01" y2="16"/>
                          </svg>
                          <span style={{ fontSize: "13px", fontWeight: 600, color: "#FF0000" }}>
                            Refund in progress
                          </span>
                        </div>
                        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", margin: 0 }}>
                          You already have an active refund request. Please wait for it to be processed before submitting a new one.
                        </p>
                      </div>
                    )}

                    {/* Show duplicate error message */}
                    {duplicateError && (
                      <div style={{
                        background: "rgba(255, 0, 0, 0.15)",
                        border: "1px solid rgba(255, 0, 0, 0.3)",
                        borderRadius: "12px",
                        padding: "12px 16px",
                        marginBottom: "16px",
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF0000" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="15" y1="9" x2="9" y2="15"/>
                            <line x1="9" y1="9" x2="15" y2="15"/>
                          </svg>
                          <span style={{ fontSize: "13px", fontWeight: 600, color: "#FF0000" }}>
                            {duplicateError}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <div style={{ marginBottom: "16px" }}>
                      <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", marginBottom: "8px", display: "block" }}>
                        {t("yourEmail")}
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="email@example.com"
                        style={{
                          width: "100%", padding: "14px 16px",
                          background: "rgba(0,0,0,0.4)",
                          border: "2px solid rgba(255,255,255,0.12)",
                          borderRadius: "12px",
                          color: "#fff", fontSize: "14px",
                          outline: "none", fontFamily: "inherit",
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: "16px" }}>
                      <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", marginBottom: "8px", display: "block" }}>
                        Purchase or Transfer Code
                      </label>
                      <input
                        type="text"
                        value={purchaseCode}
                        onChange={(e) => setPurchaseCode(e.target.value)}
                        required
                        placeholder="Enter your purchase or transfer code..."
                        style={{
                          width: "100%", padding: "14px 16px",
                          background: "rgba(0,0,0,0.4)",
                          border: "2px solid rgba(255,255,255,0.12)",
                          borderRadius: "12px",
                          color: "#fff", fontSize: "14px",
                          outline: "none", fontFamily: "inherit",
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: "20px" }}>
                      <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", marginBottom: "8px", display: "block" }}>
                        {t("refundReason")}
                      </label>
                      <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        required
                        placeholder={t("describeReason")}
                        rows={4}
                        style={{
                          width: "100%", padding: "14px 16px",
                          background: "rgba(0,0,0,0.4)",
                          border: "2px solid rgba(255,255,255,0.12)",
                          borderRadius: "12px",
                          color: "#fff", fontSize: "14px",
                          outline: "none", fontFamily: "inherit",
                          resize: "vertical", minHeight: "100px",
                        }}
                      />
                    </div>

                    <div style={{ display: "flex", gap: "12px" }}>
                      <button
                        type="button"
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="btn-3d btn-3d-dark"
                        style={{
                          flex: 1,
                          fontFamily: "inherit",
                        }}
                      >
                        {t("cancel")}
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting || !email || !purchaseCode || !reason}
                        className="btn-3d btn-3d-primary"
                        style={{
                          flex: 1,
                          fontFamily: "inherit",
                          opacity: isSubmitting || !email || !purchaseCode || !reason ? 0.6 : 1,
                          cursor: isSubmitting ? "not-allowed" : "pointer",
                        }}
                      >
                        {isSubmitting ? t("submitting") : t("submit")}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
