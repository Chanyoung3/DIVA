import React, { useState } from "react";

function Login() {
    const [form, setForm] = useState({
        username: "",
        password: "",
    });

    // 입력값 변경 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // 로그인 버튼 클릭 시 실행
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("로그인 요청:", form);
        // 여기서 fetch/axios로 서버에 로그인 요청 보내면 됨
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Login</h1>
            <form onSubmit={handleSubmit} style={styles.form}>
                <input
                    type="text"
                    name="username"
                    placeholder="아이디"
                    value={form.username}
                    onChange={handleChange}
                    style={styles.input}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="비밀번호"
                    value={form.password}
                    onChange={handleChange}
                    style={styles.input}
                />
                <button type="submit" style={styles.button}>
                    로그인
                </button>
            </form>
        </div>
    );
}

// 간단한 스타일
const styles = {
    container: {
        width: "300px",
        margin: "100px auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "10px",
        textAlign: "center",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    },
    title: {
        marginBottom: "20px",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
    },
    input: {
        padding: "10px",
        fontSize: "14px",
        borderRadius: "5px",
        border: "1px solid #ccc",
    },
    button: {
        padding: "10px",
        backgroundColor: "#4CAF50",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "16px",
    },
};

export default Login;
