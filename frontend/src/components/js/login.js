import React, { useState } from "react";
import "../css/login.css";
import {useNavigate} from "react-router-dom"; // CSS import

function Login() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        userid: "",
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

        fetch(`http://localhost:8080/login?userid=${form.userid}&password=${form.password}`, {
            method: "POST",
            credentials: "include",
        })
            .then((res) => res.text())   // 먼저 텍스트로 받기
            .then((text) => {
                try {
                    const data = JSON.parse(text);  // JSON 변환 시도
                    if (data.success) {
                        navigate("/"); // 로그인 성공
                    } else {
                        // 실패 사유에 따라 분기
                        switch (data.reason) {
                            case "wrong_password":
                                alert("비밀번호가 틀립니다.");
                                break;
                            case "not_found":
                                alert("아이디가 존재하지 않습니다.");
                                break;
                            default:
                                alert("로그인에 실패했습니다.");
                                break;
                        }
                    }
                } catch (err) {
                    console.error("JSON 파싱 실패, 서버 응답:", text);
                }
            })
            .catch((err) => {
                console.error("로그인 에러:", err);
            });
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-title">DIVA</div>
                <div className="fullname">Dicom Imaging & Visualization Application</div>
                <form onSubmit={handleSubmit} className="login-form">
                    <input
                        type="text"
                        name="userid"
                        placeholder="아이디"
                        value={form.userid}
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
        </div>
    );
}

export default Login;
