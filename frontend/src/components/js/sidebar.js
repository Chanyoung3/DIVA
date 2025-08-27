import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../css/sidebar.css';

function Sidebar({ onActivateTool }) {
    // 기본값은 "Basic"
    const [activeTool, setActiveTool] = useState("Basic");
    const navigate = useNavigate();

    const handleClick = (toolName) => {
        onActivateTool(toolName);   // Viewer에게 알림
        setActiveTool(toolName);    // UI에서 active 표시
    };

    const handleHome = () => {
        navigate("/");
    };

    return (
        <div className="sidebar">
            <div className="toolsection">
                <button
                    className="button button_lg"
                    onClick={handleHome}
                >
                    Home
                </button>
                <button
                    className={`button button_lg ${activeTool === "Basic" ? "active" : ""}`}
                    onClick={() => handleClick("Basic")}
                >
                    Basic
                </button>
                <button
                    className={`button button_lg ${activeTool === "WindowLevel" ? "active" : ""}`}
                    onClick={() => handleClick("WindowLevel")}
                >
                    WindowLevel
                </button>
                <button
                    className={`button button_lg ${activeTool === "Zoom" ? "active" : ""}`}
                    onClick={() => handleClick("Zoom")}
                >
                    Zoom
                </button>
                <button
                    className={`button button_lg ${activeTool === "Move" ? "active" : ""}`}
                    onClick={() => handleClick("Move")}
                >
                    Move
                </button>
            </div>
        </div>
    );
}

export default Sidebar;
