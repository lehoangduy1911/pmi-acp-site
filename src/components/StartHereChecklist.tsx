import React, { useEffect, useState } from "react";

/** Checklist cục bộ lưu localStorage, không phụ thuộc dữ liệu ngoài */
export default function StartHereChecklist() {
    const STORAGE_KEY = "start-here-checklist-v1";
    const items = [
        { id: "read-blueprint", label: "Đọc bài “Blueprint PMI-ACP” (4 domain, tỉ trọng, format đề)" },
        { id: "read-howto", label: "Đọc bài “Cách dùng site & lộ trình 6 tuần”" },
        { id: "book-slots", label: "Đặt lịch học cố định 45–60’/ngày (lịch điện thoại)" },
        { id: "pretest", label: "Làm Pretest 20–30 câu để đo baseline" },
        { id: "setup-notes", label: "Tạo sổ tay “Vì sao sai” & “Bẫy đề hôm nay”" },
    ];
    const [checked, setChecked] = useState<Record<string, boolean>>({});

    // Load
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) setChecked(JSON.parse(saved) || {});
        } catch { }
    }, []);

    // Save
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
        } catch { }
    }, [checked]);

    const done = items.reduce((n, it) => n + (checked[it.id] ? 1 : 0), 0);
    const toggle = (id: string) => setChecked((s) => ({ ...s, [id]: !s[id] }));
    const reset = () => setChecked({});

    return (
        <div className="card">
            <div className="card__header">
                <h3>
                    Checklist khởi động <small>({done}/{items.length})</small>
                </h3>
            </div>
            <div className="card__body">
                <ul style={{ listStyle: "none", paddingLeft: 0, margin: 0 }}>
                    {items.map((it) => (
                        <li key={it.id} style={{ marginBottom: ".35rem" }}>
                            <label
                                style={{
                                    display: "flex",
                                    gap: ".5rem",
                                    alignItems: "center",
                                    cursor: "pointer",
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={!!checked[it.id]}
                                    onChange={() => toggle(it.id)}
                                />
                                <span>{it.label}</span>
                            </label>
                        </li>
                    ))}
                </ul>
                <button
                    className="button button--secondary button--sm"
                    style={{ marginTop: ".5rem" }}
                    onClick={reset}
                    type="button"
                >
                    Reset
                </button>
            </div>
        </div>
    );
}
