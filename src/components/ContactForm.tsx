import React, { useMemo, useState } from "react";

type Props = {
    /** Email nhận phản hồi (bắt buộc nếu không dùng Formspree) */
    toEmail?: string;
    /** ID Formspree, ví dụ: "xwkgqjyz". Nếu có, form sẽ POST tới Formspree */
    formspreeId?: string;
    /** Tiêu đề hiển thị trên thẻ */
    title?: string;
};

const topics = [
    "Góp ý nội dung",
    "Báo lỗi / Bug",
    "Đề xuất tính năng",
    "Hợp tác / Liên hệ khác",
];

export default function ContactForm({ toEmail, formspreeId, title = "Góp ý & Liên hệ" }: Props) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [topic, setTopic] = useState(topics[0]);
    const [message, setMessage] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const action = useMemo(() => {
        if (formspreeId) return `https://formspree.io/f/${formspreeId}`;
        return undefined;
    }, [formspreeId]);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        if (action) {
            // Gửi thẳng tới Formspree (no JS)
            return;
        }
        e.preventDefault();
        setError(null);

        if (!toEmail) {
            setError("Chưa cấu hình email nhận phản hồi (toEmail).");
            return;
        }
        if (!email) {
            setError("Vui lòng nhập email liên hệ.");
            return;
        }
        const subject = `[VNOptimus] ${topic} — ${name || "Người dùng"}`;
        const body =
            `Họ tên: ${name || "-"}\n` +
            `Email: ${email}\n` +
            `Chủ đề: ${topic}\n\n` +
            `${message}\n\n---\nGửi từ trang Contact VNOptimus`;

        const href = `mailto:${encodeURIComponent(toEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        // Chỉ chạy ở client
        if (typeof window !== "undefined") {
            window.location.href = href;
            setSubmitted(true);
        }
    }

    const copyEmail = async () => {
        if (!toEmail) return;
        try {
            await navigator.clipboard.writeText(toEmail);
            setError(null);
            setSubmitted(true);
        } catch {
            setError("Không copy được email. Bạn có thể bôi đen và copy thủ công.");
        }
    };

    return (
        <div className="card" style={{ borderRadius: 12 }}>
            <div className="card__header">
                <h3 style={{ margin: 0 }}>{title}</h3>
            </div>

            <div className="card__body">
                {submitted && !action && (
                    <div className="alert alert--success" role="status">
                        Mở ứng dụng email của bạn để hoàn tất gửi thư. Cảm ơn bạn!
                    </div>
                )}
                {error && (
                    <div className="alert alert--danger" role="alert">
                        {error}
                    </div>
                )}

                <form
                    action={action}
                    method={action ? "POST" : undefined}
                    onSubmit={handleSubmit}
                >
                    {/* Honeypot chống bot cho Formspree */}
                    {action && <input type="text" name="_gotcha" style={{ display: "none" }} aria-hidden="true" />}

                    <div className="row">
                        <div className="col col--6">
                            <label className="margin-bottom--xs">Họ tên</label>
                            <input className="input" type="text" name="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nguyễn Văn A" />
                        </div>
                        <div className="col col--6">
                            <label className="margin-bottom--xs">Email</label>
                            <input className="input" type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ban@domain.com" required />
                        </div>
                    </div>

                    <div className="margin-top--sm">
                        <label className="margin-bottom--xs">Chủ đề</label>
                        <select className="input" name="topic" value={topic} onChange={(e) => setTopic(e.target.value)}>
                            {topics.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>

                    <div className="margin-top--sm">
                        <label className="margin-bottom--xs">Nội dung</label>
                        <textarea className="input" name="message" rows={6} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Mô tả ngắn gọn góp ý / vấn đề bạn gặp..." required />
                    </div>

                    {/* Hidden fields cho Formspree: tuỳ biến tiêu đề */}
                    {action && (
                        <>
                            <input type="hidden" name="_subject" value={`[VNOptimus] ${topic} — ${name || "Người dùng"}`} />
                            <input type="hidden" name="_format" value="plain" />
                        </>
                    )}

                    <div className="margin-top--md" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <button type="submit" className="button button--primary">
                            {action ? "Gửi phản hồi" : "Gửi qua Email"}
                        </button>

                        {/* Nút copy email hiển thị khi dùng mailto */}
                        {!action && toEmail && (
                            <button type="button" className="button button--secondary" onClick={copyEmail}>
                                Copy địa chỉ email ({toEmail})
                            </button>
                        )}
                    </div>
                </form>

                {/* Liên hệ trực tiếp */}
                {!action && toEmail && (
                    <p className="margin-top--md" style={{ opacity: .85 }}>
                        Hoặc gửi trực tiếp:{" "}
                        <a href={`mailto:${toEmail}?subject=${encodeURIComponent("[VNOptimus] Liên hệ nhanh")}`}>
                            {toEmail}
                        </a>
                    </p>
                )}
            </div>
        </div>
    );
}

