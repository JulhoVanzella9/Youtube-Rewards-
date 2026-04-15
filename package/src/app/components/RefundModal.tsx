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

export default function RefundModal({ isOpen, onClose }: RefundModalProps) {
  const { t } = useI18n();
  const [step, setStep] = useState<"legal" | "acknowledge" | "form">("legal");
  const [email, setEmail] = useState("");
  const [purchaseCode, setPurchaseCode] = useState("");
  const [reason, setReason] = useState("");
  const [fullName, setFullName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [existingRequests, setExistingRequests] = useState<ExistingRequest[]>([]);
  const [duplicateError, setDuplicateError] = useState<string | null>(null);
  const [lastRequestId, setLastRequestId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [notificationStatus, setNotificationStatus] = useState<{ emailSent: boolean; smsSent: boolean }>(
    { emailSent: false, smsSent: false }
  );

  // Acknowledgment checkboxes
  const [ack1, setAck1] = useState(false);
  const [ack2, setAck2] = useState(false);
  const [ack3, setAck3] = useState(false);
  const [ack4, setAck4] = useState(false);
  const [ack5, setAck5] = useState(false);

  const allAcknowledged = ack1 && ack2 && ack3 && ack4 && ack5;

  // Hide header/footer and lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isOpen]);

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
    if (!email || !purchaseCode || !reason || !fullName) return;

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
    setFullName("");
    setSubmitted(false);
    setDuplicateError(null);
    setAck1(false);
    setAck2(false);
    setAck3(false);
    setAck4(false);
    setAck5(false);
    onClose();
  };

  const WarningIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
        <style>{`
          .bottom-nav { display: none !important; }
          header { display: none !important; }
        `}</style>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: "fixed", inset: 0,
            background: "rgba(0,0,0,0.95)",
            display: "block",
            padding: "0", zIndex: 9999,
            overflowY: "auto",
            overflowX: "hidden",
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
              width: "100%", maxWidth: step === "form" ? "420px" : "600px",
              display: "flex", flexDirection: "column", alignItems: "center",
              margin: "0 auto",
              padding: "20px 8px 120px",
              boxSizing: "border-box",
            }}
          >
            {step === "legal" ? (
              <>
                {/* YouCash Logo */}
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
                    fontSize: "20px", fontWeight: 800, color: "#fff",
                    letterSpacing: "-0.5px",
                    fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
                    lineHeight: 1,
                  }}>
                    YouCash
                  </span>
                </div>

                <h2 style={{
                  fontSize: "16px", fontWeight: 600, color: "rgba(255,255,255,0.7)",
                  marginBottom: "20px", textAlign: "center", width: "100%",
                }}>
                  Community
                </h2>

                <div style={{
                  background: "#000",
                  padding: "24px 16px",
                  width: "100%",
                  borderRadius: "12px",
                }}>
                  {/* Warning Header */}
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    marginBottom: "16px",
                    padding: "10px",
                    background: "rgba(255,68,68,0.1)",
                    borderRadius: "10px",
                    border: "1px solid rgba(255,68,68,0.3)",
                  }}>
                    <WarningIcon />
                    <h3 style={{
                      fontSize: "14px", fontWeight: 800, color: "#FF4444",
                      letterSpacing: "0.5px", margin: 0,
                    }}>
                      LEGAL CONSEQUENCES NOTICE
                    </h3>
                    <WarningIcon />
                  </div>

                  <p style={{
                    fontSize: "13px", color: "rgba(255,255,255,0.7)",
                    lineHeight: 1.7, marginBottom: "20px",
                    textAlign: "left",
                  }}>
                    Please note that initiating a chargeback (a formal request to the credit provider to reverse an unrecognized transaction) without proper justification constitutes illegal conduct under the Fair Credit Billing Act (FCBA). These actions not only harm reputable and ethical businesses but also involve the refusal to acknowledge a legitimate transaction despite having received the product or service. Engaging in such practices may result in legal consequences. It is essential to maintain honesty in all online transactions to ensure a safe and trustworthy shopping environment for all parties involved.
                  </p>

                  {/* Refund & Dispute Policy */}
                  <div style={{
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: "10px",
                    padding: "16px",
                    marginBottom: "20px",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}>
                    <h4 style={{
                      fontSize: "13px", fontWeight: 800, color: "#fff",
                      marginBottom: "14px", textTransform: "uppercase",
                      letterSpacing: "0.5px", textAlign: "center",
                    }}>
                      Refund & Dispute Policy
                    </h4>

                    <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.65)", lineHeight: 1.7, marginBottom: "12px", textAlign: "left" }}>
                      Before initiating any chargeback or dispute with your bank or card provider, you agree to contact our support team first to resolve the issue.
                    </p>

                    <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.65)", lineHeight: 1.7, marginBottom: "14px", textAlign: "left" }}>
                      Failure to contact us prior to opening a dispute may result in your case being formally contested with detailed evidence, including proof of access, usage logs, and acceptance of our terms.
                    </p>

                    <p style={{ fontSize: "12px", color: "#FF4444", lineHeight: 1.7, marginBottom: "10px", textAlign: "left", fontWeight: 600 }}>
                      Unresolved or abusive chargebacks may lead to:
                    </p>

                    <div style={{ paddingLeft: "4px", marginBottom: "14px" }}>
                      {[
                        "Permanent account suspension and loss of all earned balance",
                        "Complete and irreversible loss of access to all platform services",
                        "Internal fraud prevention flagging across affiliated platforms",
                        "Reporting the dispute with supporting documentation to financial institutions, which may affect your standing with payment providers",
                        "Formal legal action to recover costs associated with fraudulent disputes",
                        "Collection of all evidence (IP logs, device fingerprints, usage data, timestamps) for dispute contestation",
                      ].map((item, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px", marginBottom: "8px" }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FF4444" strokeWidth="2" style={{ marginTop: "3px", flexShrink: 0 }}>
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="15" y1="9" x2="9" y2="15"/>
                            <line x1="9" y1="9" x2="15" y2="15"/>
                          </svg>
                          <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>{item}</span>
                        </div>
                      ))}
                    </div>

                    <div style={{
                      background: "rgba(255,68,68,0.08)",
                      border: "1px solid rgba(255,68,68,0.2)",
                      borderRadius: "8px",
                      padding: "10px",
                    }}>
                      <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.55)", lineHeight: 1.7, margin: 0, textAlign: "left" }}>
                        We are committed to resolving any issue quickly and fairly. Please contact our support team before taking external action. All refund requests are reviewed individually and processed within 5-10 business days.
                      </p>
                    </div>
                  </div>

                  {/* Evidence Warning */}
                  <div style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "8px",
                    padding: "12px",
                    background: "rgba(255,68,68,0.08)",
                    borderRadius: "8px",
                    border: "1px solid rgba(255,68,68,0.2)",
                    marginBottom: "20px",
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF4444" strokeWidth="2" style={{ flexShrink: 0, marginTop: "1px" }}>
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                    <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.55)", lineHeight: 1.6, margin: 0 }}>
                      <strong style={{ color: "#FF4444" }}>Important:</strong> By proceeding, you acknowledge that your account activity, access logs, IP addresses, and device information have been recorded and may be used as evidence in the event of a dispute or chargeback.
                    </p>
                  </div>

                  <button
                    onClick={() => setStep("acknowledge")}
                    className="btn-3d btn-3d-primary"
                    style={{ fontFamily: "inherit", width: "100%", maxWidth: "280px", display: "block", margin: "0 auto" }}
                  >
                    I Understand - Continue
                  </button>
                </div>

                <div style={{
                  display: "flex", gap: "20px", marginTop: "24px",
                  justifyContent: "center", flexWrap: "wrap",
                }}>
                  <span style={{ fontSize: "12px", color: "#fff", fontWeight: 600, cursor: "pointer" }}>Terms of Use</span>
                  <span style={{ fontSize: "12px", color: "#fff", fontWeight: 600, cursor: "pointer" }}>Privacy Policy</span>
                </div>

                <button
                  onClick={handleClose}
                  className="btn-3d btn-3d-dark btn-3d-sm"
                  style={{ marginTop: "16px", fontFamily: "inherit" }}
                >
                  Back to Start
                </button>
              </>
            ) : step === "acknowledge" ? (
              /* Acknowledgment Step */
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  background: "#000",
                  padding: "24px 16px",
                  width: "100%",
                  borderRadius: "12px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
                  <button
                    type="button"
                    onClick={() => setStep("legal")}
                    style={{
                      background: "none", border: "none", cursor: "pointer",
                      color: "rgba(255,255,255,0.6)", padding: "4px", marginRight: "12px",
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                  </button>
                  <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#fff" }}>
                    Required Acknowledgments
                  </h3>
                </div>

                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.55)", marginBottom: "18px", lineHeight: 1.6 }}>
                  Before proceeding with your refund request, you must acknowledge and agree to all of the following statements. This is a mandatory step required by our compliance department.
                </p>

                {[
                  { checked: ack1, setter: setAck1, text: "I confirm that I have contacted or attempted to contact the support team before initiating this refund request." },
                  { checked: ack2, setter: setAck2, text: "I understand that filing a chargeback or dispute without first attempting resolution through the platform's support channels may be treated as a fraudulent claim and will be formally contested with all available evidence." },
                  { checked: ack3, setter: setAck3, text: "I acknowledge that my account activity, IP address, device information, and usage logs have been recorded and may be submitted to financial institutions, payment processors, and relevant authorities." },
                  { checked: ack4, setter: setAck4, text: "I understand that abusive or fraudulent chargebacks may result in permanent account suspension, loss of all earned balance, fraud prevention flagging, and potential legal action." },
                  { checked: ack5, setter: setAck5, text: "I confirm that all information I provide in this refund request is truthful and accurate. I understand that providing false information may constitute fraud." },
                ].map((item, i) => (
                  <label
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "10px",
                      padding: "12px",
                      marginBottom: "8px",
                      background: item.checked ? "rgba(255,68,68,0.08)" : "rgba(255,255,255,0.03)",
                      borderRadius: "10px",
                      border: item.checked ? "1px solid rgba(255,68,68,0.25)" : "1px solid rgba(255,255,255,0.08)",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={(e) => item.setter(e.target.checked)}
                      style={{
                        width: "16px", height: "16px",
                        marginTop: "2px", accentColor: "#FF0000",
                        flexShrink: 0, cursor: "pointer",
                      }}
                    />
                    <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.65)", lineHeight: 1.6 }}>
                      {item.text}
                    </span>
                  </label>
                ))}

                <div style={{ display: "flex", gap: "12px", marginTop: "18px" }}>
                  <button
                    onClick={handleClose}
                    className="btn-3d btn-3d-dark"
                    style={{ flex: 1, fontFamily: "inherit" }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => allAcknowledged && setStep("form")}
                    disabled={!allAcknowledged}
                    className="btn-3d btn-3d-primary"
                    style={{
                      flex: 1, fontFamily: "inherit",
                      opacity: allAcknowledged ? 1 : 0.4,
                      cursor: allAcknowledged ? "pointer" : "not-allowed",
                    }}
                  >
                    Proceed to Form
                  </button>
                </div>
              </motion.div>
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
                      Request Submitted
                    </h3>

                    <div style={{ marginBottom: "16px", fontSize: "13px" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "6px", color: "rgba(255,255,255,0.8)" }}>
                        {notificationStatus.emailSent ? (
                          <>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#282828" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                            <span>Email sent</span>
                          </>
                        ) : (
                          <>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>
                            <span>Email sending...</span>
                          </>
                        )}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", color: "rgba(255,255,255,0.8)" }}>
                        {notificationStatus.smsSent ? (
                          <>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#282828" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                            <span>SMS sent</span>
                          </>
                        ) : (
                          <>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>
                            <span>SMS sending...</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div style={{
                      background: "rgba(255,255,255,0.05)",
                      borderRadius: "10px",
                      padding: "14px",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}>
                      <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", lineHeight: 1.6, margin: 0 }}>
                        Processing time: 5-10 business days. You will receive an email notification with the outcome. Please do not initiate a chargeback during this period, as it may result in your request being denied and your account being flagged.
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
                      <button
                        type="button"
                        onClick={() => setStep("acknowledge")}
                        style={{
                          background: "none", border: "none", cursor: "pointer",
                          color: "rgba(255,255,255,0.6)", padding: "4px", marginRight: "12px",
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

                    {/* Step indicator */}
                    <div style={{
                      display: "flex", alignItems: "center", justifyContent: "center",
                      gap: "8px", marginBottom: "20px",
                      fontSize: "11px", color: "rgba(255,255,255,0.4)",
                    }}>
                      <span style={{ color: "rgba(255,255,255,0.3)" }}>Policy</span>
                      <span>-</span>
                      <span style={{ color: "rgba(255,255,255,0.3)" }}>Acknowledgments</span>
                      <span>-</span>
                      <span style={{ color: "#FF0000", fontWeight: 600 }}>Request Form</span>
                    </div>

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
                          <span style={{ fontSize: "13px", fontWeight: 600, color: "#FF0000" }}>Refund already in progress</span>
                        </div>
                        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", margin: 0 }}>
                          You already have an active refund request. Please wait for it to be processed before submitting a new one.
                        </p>
                      </div>
                    )}

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
                          <span style={{ fontSize: "13px", fontWeight: 600, color: "#FF0000" }}>{duplicateError}</span>
                        </div>
                      </div>
                    )}

                    <div style={{ marginBottom: "16px" }}>
                      <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", marginBottom: "8px", display: "block" }}>
                        Full Legal Name
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        placeholder="Enter your full legal name..."
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

                    <div style={{ marginBottom: "16px" }}>
                      <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", marginBottom: "8px", display: "block" }}>
                        {t("refundReason")}
                      </label>
                      <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        required
                        placeholder="Please provide a detailed explanation for your refund request. Include specific reasons and any relevant information..."
                        rows={5}
                        style={{
                          width: "100%", padding: "14px 16px",
                          background: "rgba(0,0,0,0.4)",
                          border: "2px solid rgba(255,255,255,0.12)",
                          borderRadius: "12px",
                          color: "#fff", fontSize: "14px",
                          outline: "none", fontFamily: "inherit",
                          resize: "vertical", minHeight: "120px",
                        }}
                      />
                    </div>

                    {/* Final Warning */}
                    <div style={{
                      display: "flex", alignItems: "flex-start", gap: "10px",
                      padding: "12px", background: "rgba(255,68,68,0.08)",
                      borderRadius: "10px", border: "1px solid rgba(255,68,68,0.2)",
                      marginBottom: "20px",
                    }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF4444" strokeWidth="2" style={{ flexShrink: 0, marginTop: "1px" }}>
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                      </svg>
                      <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", lineHeight: 1.6, margin: 0 }}>
                        By submitting this request, you confirm that you have read and agreed to the Refund & Dispute Policy. Your request will be reviewed by our compliance team. Processing time: 5-10 business days.
                      </p>
                    </div>

                    <div style={{ display: "flex", gap: "12px" }}>
                      <button
                        type="button"
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="btn-3d btn-3d-dark"
                        style={{ flex: 1, fontFamily: "inherit" }}
                      >
                        {t("cancel")}
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting || !email || !purchaseCode || !reason || !fullName}
                        className="btn-3d btn-3d-primary"
                        style={{
                          flex: 1, fontFamily: "inherit",
                          opacity: isSubmitting || !email || !purchaseCode || !reason || !fullName ? 0.6 : 1,
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
        </>
      )}
    </AnimatePresence>
  );
}
