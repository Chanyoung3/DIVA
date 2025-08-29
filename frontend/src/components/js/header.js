import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/header.css";

function Header({ setUserid }) {
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [username, setUsername] = useState(null);

    useEffect(() => {
        fetch("http://localhost:8080/session-username", {
            credentials: "include" // 쿠키 세션 포함
        })
            .then(res => res.json())
            .then(data => {
                if(data.loggedIn){
                    setUserid(data.id);
                    setUsername(data.username);
                }
            })
            .catch(err => console.error("세션 유저 가져오기 실패", err));
    }, []);

    const handleLogout = () => {
        fetch("http://localhost:8080/logout", {
            method: "POST",
            credentials: "include",
        })
            .then(() => {
                navigate("/login");
            })
            .catch(err => console.error("로그아웃 실패:", err));
    };

    return (
        <div className="header-container">
            <div className="headname">Dicom Viewer</div>

            <div className="profile-container">
                <text className="login-info">{username}</text>
                <button className="profile-button" onClick={() => setDropdownOpen(prev => !prev)}>
                    프로필
                </button>

                {dropdownOpen && (
                    <div className="profile-dropdown">
                        <button onClick={() => navigate("/settings")}>설정</button>
                        <button onClick={handleLogout}>로그아웃</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Header;
