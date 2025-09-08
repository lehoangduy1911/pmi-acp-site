import React, { useEffect, useMemo, useState } from "react";

type Item = { id: string; label: string };

type Props = {
    storageKey: string;
    title?: string;
    items?: Item[]; // optional
};

const StudyChecklist: React.FC<Props> = ({ storageKey, title, items = [] }) => {
    const safeItems = useMemo(
        () =>
            (Array.isArray(items) ? items : [])
                .filter(Boolean)
                .filter(
                    (i): i is Item =>
                        !!i && typeof (i as any).id === "string" && typeof (i as any).label === "string"
                ),
        [items]
    );

    const [checked, setChecked] = useState<Record<string, boolean>>({});

    useEffect(() => {
        try {
            const raw = localStorage.getItem(`study-checklist:${storageKey}`);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed && typeof parsed === "object") setChecked(parsed);
            }
        } catch { }
    }, [storageKey]);

    useEffect(() => {
        try {
            localStorage.setItem(
                `study-checklist:${storageKey}`,
                JSON.stringify(checked)
            );
        } catch { }
    }, [checked, storageKey]);

    const total = safeItems.length;
    const completed = safeItems.reduce((n, i) => n + (checked[i.id] ? 1 : 0), 0);
    const percent = total ? Math.round((completed / total) * 100) : 0;

    const toggle = (id: string) =>
        setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

    const markAll = () => {
        const all: Record<string, boolean> = {};
        safeItems.forEach((i) => (all[i.id] = true));
        setChecked(all);
    };

    const resetAll = () => setChecked({});

    return (
        <div style={styles.wrapper} className="study-checklist">
            {title && <h3 style={styles.title}>{title}</h3>}

            <div style={styles.progressWrap} aria-live="polite">
                <div style={styles.progressLabel}>
                    Tiến độ: {completed}/{total} ({percent}%)
                </div>
                <div style={styles.progressOuter} aria-hidden="true">
                    <div style={{ ...styles.progressInner, width: `${percent}%` }} />
                </div>
            </div>

            {total === 0 ? (
                <div style={styles.empty}>
                    Chưa có mục checklist. Hãy truyền prop <code>items</code> dạng
                    {" { id: string; label: string }"}.
                </div>
            ) : (
                <>
                    <ul style={styles.list}>
                        {safeItems.map((it, idx) => {
                            const inputId = `${storageKey}-${it.id}`;
                            return (
                                <li key={it.id} style={styles.item}>
                                    <label htmlFor={inputId} style={styles.label}>
                                        <input
                                            id={inputId}
                                            type="checkbox"
                                            checked={!!checked[it.id]}
                                            onChange={() => toggle(it.id)}
                                            style={styles.checkbox}
                                        />
                                        <span>
                                            {String(idx + 1).padStart(2, "0")}. {it.label}
                                        </span>
                                    </label>
                                </li>
                            );
                        })}
                    </ul>

                    <div style={styles.actions}>
                        <button type="button" onClick={markAll} style={styles.button}>
                            Đánh dấu hoàn thành
                        </button>
                        <button type="button" onClick={resetAll} style={{ ...styles.button, ...styles.ghost }}>
                            Xóa dấu
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

const styles: Record<string, React.CSSProperties> = {
    wrapper: { border: "1px solid var(--ifm-color-emphasis-300)", borderRadius: 12, padding: "16px 16px 12px", margin: "12px 0 24px", background: "var(--ifm-background-surface-color)" },
    title: { margin: "0 0 8px", fontSize: "1.1rem" },
    progressWrap: { marginBottom: 12 },
    progressLabel: { fontSize: 14, marginBottom: 8, opacity: 0.9 },
    progressOuter: { height: 10, borderRadius: 999, background: "var(--ifm-color-emphasis-200)", overflow: "hidden" },
    progressInner: { height: "100%", background: "var(--ifm-color-primary)", transition: "width 240ms ease" },
    empty: { fontSize: 14, opacity: 0.8, border: "1px dashed var(--ifm-color-emphasis-300)", padding: "8px 10px", borderRadius: 8 },
    list: { listStyle: "none", padding: 0, margin: 0 },
    item: { padding: "6px 4px", borderBottom: "1px dashed var(--ifm-color-emphasis-200)" },
    label: { display: "flex", alignItems: "center", gap: 8, cursor: "pointer" },
    checkbox: { width: 18, height: 18, accentColor: "var(--ifm-color-primary)" },
    actions: { display: "flex", gap: 8, marginTop: 12 },
    button: { padding: "8px 12px", borderRadius: 8, border: "1px solid var(--ifm-color-primary)", background: "var(--ifm-color-primary)", color: "white", cursor: "pointer", fontSize: 14 },
    ghost: { background: "transparent", color: "var(--ifm-color-primary)" },
};

export default StudyChecklist;
