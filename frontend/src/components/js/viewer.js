import React, { useEffect } from "react";

function Viewer() {
    const studyUid = 1;  // 실제 값으로 대체하거나 state/props에서 받아오기

    useEffect(() => {

        fetch(`http://localhost:8080/api/v1/studies/${studyUid}`, {
            mode: "cors",
            headers: {
                // 필요 시 헤더 추가 가능
                // 'Authorization': 'Bearer ...',
            },
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`서버 응답 에러: ${res.status}`);
                }
                return res.arrayBuffer();
            })
            .then((buffer) => {
                console.log("ArrayBuffer 크기:", buffer.byteLength);

                const byteArray = new Uint8Array(buffer);
                const hexString = Array.from(byteArray.slice(0, 20))
                    .map((b) => b.toString(16).padStart(2, "0"))
                    .join(" ");
                console.log("첫 20바이트(16진수):", hexString);

                const base64 = arrayBufferToBase64(buffer);
                console.log("Base64 예시:", base64.slice(0, 50) + "...");
            })
            .catch((err) => console.error("에러 발생:", err));
    }, [studyUid]);

    // base64 변환 함수
    function arrayBufferToBase64(buffer) {
        let binary = "";
        const bytes = new Uint8Array(buffer);
        bytes.forEach((b) => (binary += String.fromCharCode(b)));
        return window.btoa(binary);
    }

    return <div>콘솔에서 바이너리 응답 확인</div>;
}

export default Viewer;
