import React, { useState } from "react";
import '../css/sidebar.css';

function Sidebar() {
    // 기본값을 "Basic"으로 설정
    const [activeTool, setActiveTool] = useState("Basic");

    const handleClick = (toolName) => {
        setActiveTool(toolName); // 클릭한 버튼을 active로
    };

    return (
        <div className="sidebar">
            <div className="toolsection">
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
