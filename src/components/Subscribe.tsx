import React, { useState, useId } from "react";

/** Chọn 1 trong 3 (mặc định: formsubmit) */
const ENDPOINT_MODE: "n8n" | "formspree" | "formsubmit" = "formsubmit";

// n8n (nếu sau này dùng)
const N8N_WEBHOOK_URL = "https://YOUR-N8N/webhook/subscribe";
// Formspree (nếu sau này dùng)
const FORMSPREE_URL = "https://formspree.io/f/YOUR_FORM_ID";

/** FormSubmit
 *  - AJAX trả JSON (thường cần Origin/Referer hợp lệ).
 *  - Non-AJAX trả HTML, nhưng vẫn gửi email (ít lỗi hơn, hợp dev/local).
 */
const FORMSUBMIT_AJAX = "https://formsubmit.co/ajax/lehoangduy1911@gmail.com";
const FORMSUBMIT_HTML = "https://formsubmit.co/lehoangduy1911@gmail.com";

type Props = { source?: string };

export default function Subscribe({ source = "unknown" }: Props) {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
    const [msg, setMsg] = useState("");
    const [hp, setHp] = useState("");
    const inputId = useId();

    const validateEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
    const emailValid = validateEmail(email);

    async function sendViaFormsubmit() {
        // --- Thử AJAX trước ---
        const fd = new FormData();
        fd.append("email", email);
        fd.append("name", name);
        fd.append("source", source);
        fd.append("origin", typeof window !== "undefined" ? window.location.href : "");
        fd.append("ts", new Date().toISOString());
        fd.append("_subject", "New PMI-ACP subscribe");
        fd.append("_template", "table");
        fd.append("_captcha", "false");
        fd.append("_replyto", email);

        try {
            const res = await fetch(FORMSUBMIT_AJAX, {
                method: "POST",
                body: fd,
                headers: { Accept: "application/json" },
            });
            const data = await res.json().catch(() => ({} as any));
            // success của FormSubmit là "true" (string)
            if (res.ok && String((data as any)?.success) === "true") {
                return { ok: true as const, mode: "ajax" as const };
            }
            const reason = (data as any)?.message || "AJAX not allowed";
            console.warn("[FormSubmit][AJAX] failed:", reason);
            throw new Error(reason);
        } catch {
            // --- Fallback sang endpoint HTML: fire-and-forget cho local ---
            const body = new URLSearchParams({
                email,
                name,
                source,
                origin: typeof window !== "undefined" ? window.location.href : "",
                ts: new Date().toISOString(),
                _subject: "New PMI-ACP subscribe",
                _template: "table",
                _captcha: "false",
                _replyto: email,
            });

            await fetch(FORMSUBMIT_HTML, {
                method: "POST",
                // ⚠️ no-cors -> response "opaque" (không đọc được status), nhưng server vẫn nhận POST
                mode: "no-cors",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body,
            });

            // Xem như thành công (server sẽ gửi mail nếu đã confirm unlock)
            return { ok: true as const, mode: "html-no-cors" as const };
        }
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!emailValid) {
            setMsg("Email không hợp lệ");
            return;
        }
        if (hp) return; // honeypot

        setStatus("loading");
        setMsg("");

        try {
            if (ENDPOINT_MODE === "n8n") {
                const res = await fetch(N8N_WEBHOOK_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, name, source, list: "pmi-acp", ts: new Date().toISOString() }),
                });
                if (!res.ok) throw new Error("n8n error");
            } else if (ENDPOINT_MODE === "formspree") {
                const fd = new FormData();
                fd.append("email", email);
                fd.append("name", name);
                fd.append("source", source);
                const res = await fetch(FORMSPREE_URL, {
                    method: "POST",
                    body: fd,
                    headers: { Accept: "application/json" },
                });
                const data = await res.json().catch(() => ({}));
                if (!res.ok || (data && data.ok === false))
                    throw new Error(data?.errors?.[0]?.message || "formspree error");
            } else {
                const r = await sendViaFormsubmit();
                console.log("[FormSubmit] sent via:", r.mode);
            }

            setStatus("ok");
            setMsg(
                "Đã gửi đăng ký."
            );
            setEmail("");
            setName("");
        } catch (err: any) {
            console.error(err);
            setStatus("error");
            setMsg(err?.message || "Có lỗi xảy ra. Vui lòng thử lại sau.");
        }
    }

    if (status === "ok") {
        return (
            <div className="alert alert--success" role="status" style={{ marginTop: 16 }}>
                <strong>Đã đăng ký.</strong> {msg}
            </div>
        );
    }

    return (
        <form onSubmit={onSubmit} style={{ marginTop: 16, display: "grid", gap: 8, maxWidth: 520 }}>
            <label htmlFor={`${inputId}-email`} style={{ fontWeight: 600 }}>
                Nhận email nhắc học (miễn phí)
            </label>

            <div style={{ display: "flex", gap: 8 }}>
                <input
                    id={`${inputId}-email`}
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-label="Email"
                    className="input"
                    style={{
                        flex: 1,
                        padding: "10px 12px",
                        borderRadius: 8,
                        border: "1px solid var(--ifm-color-emphasis-300)",
                    }}
                />
                <button
                    type="submit"
                    className="button button--primary"
                    disabled={status === "loading" || !emailValid}
                    aria-busy={status === "loading"}
                    aria-disabled={status === "loading" || !emailValid}
                >
                    {status === "loading" ? "Đang gửi..." : "Subscribe"}
                </button>
            </div>

            <input
                name="name"
                type="text"
                placeholder="Tên (tuỳ chọn)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input"
                style={{
                    padding: "10px 12px",
                    borderRadius: 8,
                    border: "1px solid var(--ifm-color-emphasis-300)",
                }}
            />

            {/* Honeypot ẩn */}
            <input
                type="text"
                value={hp}
                onChange={(e) => setHp(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                style={{ position: "absolute", left: "-10000px", top: "auto", width: 1, height: 1, overflow: "hidden" }}
                aria-hidden="true"
            />

            {msg && (
                <div
                    className={`alert ${status === "error" ? "alert--danger" : "alert--info"}`}
                    role="status"
                    aria-live="polite"
                >
                    {msg}
                </div>
            )}

            <small style={{ opacity: 0.8 }}>Không spam. Bạn có thể huỷ đăng ký bất cứ lúc nào.</small>
        </form>
    );
}
