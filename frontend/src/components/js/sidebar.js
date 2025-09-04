import React, { useState } from "react";
import { List, Eye, ZoomIn, Hand, Tag, Layout, Sliders} from "lucide-react";
import '../css/sidebar.css';

function Sidebar({ onActivateTool }) {
    const [activeTool, setActiveTool] = useState("Basic");
    const [hoverPos, setHoverPos] = useState({ row: -1, col: -1 }); // hover 위치 상태

    const isActiveCell = (rowIdx, colIdx) => {
        return rowIdx <= hoverPos.row && colIdx <= hoverPos.col;
    };

    const handleCellClick = (row, col) => {
        console.log("가로 : " + row + "세로 : " + col);
        setActiveTool("Basic");
    };

    const handleClick = (toolName) => {
        onActivateTool(toolName);
        setActiveTool(toolName);
    };

    return (
        <div className="sidebar">
            <div className="toolsection">
                <div className="buttonGroup">
                    <button
                        className={`button button_lg ${activeTool === "Home" ? "active" : ""}`}
                        onClick={(e) => handleClick("Home")}
                        title="메인"
                    >
                        <List />
                    </button>
                    <button
                        className={`button button_lg ${activeTool === "Basic" ? "active" : ""}`}
                        onClick={(e) => handleClick("Basic")}
                        title="기본"
                    >
                        <Eye />
                    </button>
                    <button
                        className={`button button_lg ${activeTool === "WindowLevel" ? "active" : ""}`}
                        onClick={(e) => handleClick("WindowLevel")}
                        title="윈도우레벨"
                    >
                        <Sliders />
                    </button>
                    <button
                        className={`button button_lg ${activeTool === "Zoom" ? "active" : ""}`}
                        onClick={(e) => handleClick("Zoom")}
                        title="줌"
                    >
                        <ZoomIn />
                    </button>
                    <button
                        className={`button button_lg ${activeTool === "Move" ? "active" : ""}`}
                        onClick={(e) => handleClick("Move")}
                        title="이동"
                    >
                        <Hand />
                    </button>
                    <button
                        className={`button button_lg ${activeTool === "Mark" ? "active" : ""}`}
                        onClick={(e) => handleClick("Mark")}
                        title="주석"
                    >
                        <Tag />
                    </button>
                    <button
                        className={`button button_lg ${activeTool === "Section" ? "active" : ""}`}
                        onClick={(e) => handleClick("Section")}
                        title="화면구분"
                    >
                        <Layout />
                    </button>
                </div>

                {activeTool === "Section" && (
                    <div className="gridContainer">
                        {[...Array(4)].map((_, rowIdx) => (
                            <div className="gridRow" key={rowIdx}>
                                {[...Array(4)].map((_, colIdx) => (
                                    <div
                                        key={colIdx}
                                        className={`gridCell ${isActiveCell(rowIdx, colIdx) ? "active" : ""}`}
                                        onMouseEnter={() => setHoverPos({ row: rowIdx, col: colIdx })}
                                        onMouseLeave={() => setHoverPos({ row: -1, col: -1 })}
                                        onClick={() => handleCellClick(rowIdx, colIdx)}
                                    ></div>
                                ))}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Sidebar;
