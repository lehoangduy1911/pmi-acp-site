import React, { useState, useId } from "react";

/** CẤU HÌNH: chọn 1 trong 2 chế độ gửi dữ liệu */
const ENDPOINT_MODE: "n8n" | "formspree" = "n8n";
// 1) Nếu dùng n8n (khuyên dùng – free, chủ động dữ liệu):
const N8N_WEBHOOK_URL = "https://YOUR-N8N-HOST/webhook/subscribe";
// 2) Nếu dùng Formspree (siêu nhanh):
const FORMSPREE_URL = "https://formspree.io/f/YOUR_FORM_ID";

type Props = { source?: string }; // ví dụ: "docs:start-here" | "blog:hello-world"

export default function Subscribe({ source = "unknown" }: Props) {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
    const [msg, setMsg] = useState("");
    const [hp, setHp] = useState(""); // honeypot chống bot
    const inputId = useId();

    const validateEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
    const emailValid = validateEmail(email);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!emailValid) {
            setMsg("Email không hợp lệ");
            return;
        }
        if (hp) return; // bot điền honeypot → bỏ qua
        setStatus("loading");
        setMsg("");
        try {
            if (ENDPOINT_MODE === "n8n") {
                const res = await fetch(N8N_WEBHOOK_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email,
                        name,
                        source,
                        list: "pmi-acp",
                        ts: new Date().toISOString(),
                    }),
                });
                if (!res.ok) throw new Error("n8n error");
            } else {
                const fd = new FormData();
                fd.append("email", email);
                fd.append("name", name);
                fd.append("source", source);
                const res = await fetch(FORMSPREE_URL, {
                    method: "POST",
                    body: fd,
                    headers: { Accept: "application/json" },
                });
                if (!res.ok) throw new Error("formspree error");
            }
            setStatus("ok");
            setMsg("Đăng ký thành công! Kiểm tra email xác nhận (nếu có).");
            setEmail("");
            setName("");
        } catch {
            setStatus("error");
            setMsg("Có lỗi xảy ra. Vui lòng thử lại sau.");
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

            {/* Honeypot ẩn cho bot */}
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
