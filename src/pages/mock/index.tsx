import { useEffect } from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

export default function MockRedirect() {
    // Tự tôn trọng baseUrl ở dev/prod (GH Pages, subpath…)
    const url = useBaseUrl('/mock/index.html');
    useEffect(() => {
        // replace để không để lại trang “trung gian” trong lịch sử
        window.location.replace(url);
    }, [url]);

    // Có thể trả về null; hoặc một dòng chữ “Đang chuyển…”
    return null;
}
