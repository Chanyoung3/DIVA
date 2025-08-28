import React, { useState } from "react";
import "../css/login.css";
import {useNavigate} from "react-router-dom"; // CSS import

function Login() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        id: "",
        password: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        fetch("http://localhost:8080/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: form.id,
                password: form.password,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (!data.success) {
                    alert("아이디나 패스워드가 일치하지 않습니다.");
                } else {
                    navigate("/");
                }
            })
            .catch((err) => {
                console.error("로그인 에러:", err);
            });
    };


    return (
        <div className="login-container">
            <h1 className="login-title">Login</h1>
            <form onSubmit={handleSubmit} className="login-form">
                <input
                    type="text"
                    name="id"
                    placeholder="아이디"
                    value={form.id}
                    onChange={handleChange}
                    className="login-input"
                />
                <input
                    type="password"
                    name="password"
                    placeholder="비밀번호"
                    value={form.password}
                    onChange={handleChange}
                    className="login-input"
                />
                <button type="submit" className="login-button">
                    로그인
                </button>
            </form>
        </div>
    );
}

export default Login;
