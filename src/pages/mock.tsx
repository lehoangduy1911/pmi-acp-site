// src/pages/mock.tsx
import { useEffect } from 'react';

export default function MockBridge() {
    useEffect(() => {
        const p = window.location.pathname;
        const isEN = p.startsWith('/en/');
        // Redirect thẳng sang file tĩnh đã được copy bởi postbuild
        const target = isEN ? '/en/mock/index.html' : '/mock/index.html';
        // Dùng replace để không để lại entry trong history
        window.location.replace(target);
    }, []);

    return (
        <div style={{ padding: '2rem' }}>
            <p>Đang mở trang thi thử…</p>
            <p>
                Nếu trình duyệt không tự chuyển, hãy bấm vào đây:&nbsp;
                <a href="/mock/index.html">/mock/index.html</a>
            </p>
        </div>
    );
}
