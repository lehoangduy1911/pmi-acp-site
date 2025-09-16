import React, { useState, useId } from "react";

/** Giữ FormSubmit làm mặc định */
const ENDPOINT_MODE: "n8n" | "formspree" | "formsubmit" = "formsubmit";

// n8n (để dành)
const N8N_WEBHOOK_URL = "https://YOUR-N8N/webhook/subscribe";
// Formspree (để dành)
const FORMSPREE_URL = "https://formspree.io/f/YOUR_FORM_ID";

/** FormSubmit endpoints */
const FORMSUBMIT_AJAX = "https://formsubmit.co/ajax/lehoangduy1911@gmail.com";
const FORMSUBMIT_HTML = "https://formsubmit.co/lehoangduy1911@gmail.com";

type Props = { source?: string };

const IS_BROWSER = typeof window !== "undefined";
const isLocalhost =
    IS_BROWSER && /^(localhost|127\.0\.0\.1)$/i.test(window.location.hostname);

/** ✅ Production-safe: submit qua form + iframe ẩn (không CORS, chạy cả /docs lẫn /pages) */
function postViaHiddenForm(url: string, fields: Record<string, string>) {
    if (!IS_BROWSER) return;

    const iframeName = `fs_iframe_${Date.now()}`;
    const iframe = document.createElement("iframe");
    iframe.name = iframeName;
    iframe.style.display = "none";

    const form = document.createElement("form");
    form.action = url;
    form.method = "POST";
    form.target = iframeName;
    form.style.display = "none";

    for (const [k, v] of Object.entries(fields)) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = k;
        input.value = v ?? "";
        form.appendChild(input);
    }

    document.body.appendChild(iframe);
    document.body.appendChild(form);
    form.submit();

    setTimeout(() => {
        try { form.remove(); iframe.remove(); } catch { }
    }, 3000);
}

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
        const common: Record<string, string> = {
            email,
            name,
            source,
            origin: IS_BROWSER ? window.location.href : "",
            ts: new Date().toISOString(),
            _subject: "New PMI-ACP subscribe",
            _template: "table",
            _captcha: "false",
            _replyto: email,
        };

        // 🌐 Production: luôn dùng hidden form (ổn định trên mọi trang)
        if (!isLocalhost) {
            postViaHiddenForm(FORMSUBMIT_HTML, common);
            return { ok: true as const, mode: "html-hidden-form" as const };
        }

        // 🧪 Local: thử AJAX -> nếu fail fallback HTML no-cors
        const fd = new FormData();
        Object.entries(common).forEach(([k, v]) => fd.append(k, v));

        try {
            const res = await fetch(FORMSUBMIT_AJAX, {
                method: "POST",
                body: fd,
                headers: { Accept: "application/json" },
            });
            const data = await res.json().catch(() => ({} as any));
            if (res.ok && String((data as any)?.success) === "true") {
                return { ok: true as const, mode: "ajax" as const };
            }
            throw new Error((data as any)?.message || "AJAX not allowed");
        } catch {
            const body = new URLSearchParams(common);
            await fetch(FORMSUBMIT_HTML, {
                method: "POST",
                mode: "no-cors",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body,
            });
            return { ok: true as const, mode: "html-no-cors" as const };
        }
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!emailValid) { setMsg("Email không hợp lệ"); return; }
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
                fd.append("email", email); fd.append("name", name); fd.append("source", source);
                const res = await fetch(FORMSPREE_URL, { method: "POST", body: fd, headers: { Accept: "application/json" } });
                const data = await res.json().catch(() => ({}));
                if (!res.ok || (data && data.ok === false)) throw new Error(data?.errors?.[0]?.message || "formspree error");
            } else {
                const r = await sendViaFormsubmit();
                console.log("[FormSubmit] sent via:", r.mode);
            }

            setStatus("ok");
            setMsg("Đã gửi đăng ký. Nếu đây là lần đầu, hãy mở hộp thư lehoangduy1911@gmail.com để 'Confirm' FormSubmit (một lần duy nhất).");
            setEmail(""); setName("");
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
                    style={{ flex: 1, padding: "10px 12px", borderRadius: 8, border: "1px solid var(--ifm-color-emphasis-300)" }}
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
                style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid var(--ifm-color-emphasis-300)" }}
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
                <div className={`alert ${status === "error" ? "alert--danger" : "alert--info"}`} role="status" aria-live="polite">
                    {msg}
                </div>
            )}

            <small style={{ opacity: 0.8 }}>Không spam. Bạn có thể huỷ đăng ký bất cứ lúc nào.</small>
        </form>
    );
}
