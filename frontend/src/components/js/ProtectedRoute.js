import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
    const [loading, setLoading] = useState(true);
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        fetch("http://localhost:8080/session-check", {
            method: "GET",
            credentials: "include",
        })
        .then(res => res.json())
        .then(data => {
            setLoggedIn(data.loggedIn);
            setLoading(false);
            if (!data.loggedIn) {
                alert("로그인이 필요합니다.");
            }
        })
        .catch(err => {
            console.error("세션 체크 실패:", err);
            setLoggedIn(false);
            setLoading(false);
            alert("로그인이 필요합니다.");
        });
    }, []);

    if (loading) return <div>로딩 중...</div>;

    return loggedIn ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
