import React, { useState } from "react";
import { List, Eye, ZoomIn, Move, Tags, Sun, Type, LayoutGrid, DraftingCompass, Square, Ruler, ScanEye, Circle, Eraser} from "lucide-react";
import '../css/sidebar.css';

function Sidebar({ onActivateTool }) {
    const [activeTool, setActiveTool] = useState("Basic");
    const [annotationTool, setAnnotationTool] = useState();
    const [hoverPos, setHoverPos] = useState({ row: -1, col: -1 }); // hover 위치 상태
    const [showMarkTools, setShowMarkTools] = useState(false);
    const [showSection, setShowSection] = useState(false);

    const isActiveCell = (rowIdx, colIdx) => {
        return rowIdx <= hoverPos.row && colIdx <= hoverPos.col;
    };

    const handleCellClick = (row, col) => {
        const rowCoord = row + 1; // 세로
        const colCoord = col + 1; // 가로
        setShowSection(false);

        onActivateTool("Section", { row: rowCoord, col: colCoord });
    };

    const handleClick = (toolName) => {
        onActivateTool(toolName);
        setActiveTool(toolName);

        if( toolName !== "Mark") setShowMarkTools(false); // 주석 툴 도구 닫기
    };

    const handletoggle  = (toolName) => {
        setAnnotationTool(toolName);
        onActivateTool(toolName);
    }

    return (
        <div className="sidebar">
            <div className="toolsection">
                <div className="buttonGroup">
                    <button
                        className={`button button_lg ${activeTool === "Home" ? "active" : ""}`}
                        onClick={() => { handleClick("Home"); }}
                        title="메인"
                    >
                        <div className="icon-label">
                            <List />
                            <span className="icon-text">메인</span>
                        </div>
                    </button>
                    <button
                        className={`button button_lg ${activeTool === "Basic" ? "active" : ""}`}
                        onClick={() => { handleClick("Basic"); }}
                        title="기본"
                    >
                        <div className="icon-label">
                            <Eye />
                            <span className="icon-text">기본</span>
                        </div>
                    </button>
                    <button
                        className={`button button_lg ${activeTool === "WindowLevel" ? "active" : ""}`}
                        onClick={() => { handleClick("WindowLevel"); }}
                        title="윈도우레벨"
                    >
                        <div className="icon-label">
                            <Sun />
                            <span className="icon-text">윈도우 레벨</span>
                        </div>
                    </button>
                    <button
                        className={`button button_lg ${activeTool === "Zoom" ? "active" : ""}`}
                        onClick={() => { handleClick("Zoom"); }}
                        title="줌"
                    >
                        <div className="icon-label">
                            <ZoomIn />
                            <span className="icon-text">확대/축소</span>
                        </div>
                    </button>
                    <button
                        className={`button button_lg ${activeTool === "Move" ? "active" : ""}`}
                        onClick={() =>  { handleClick("Move"); }}
                        title="이동"
                    >
                        <div className="icon-label">
                            <Move />
                            <span className="icon-text">이동</span>
                        </div>
                    </button>
                    <button
                        className={`button button_lg ${activeTool.startsWith("Mark") ? "active" : ""}`}
                        onClick={() => {handleClick("Mark"); setShowMarkTools(true); }}
                        title="주석"
                    >
                        <div className="icon-label">
                            <Tags />
                            <span className="icon-text">주석</span>
                        </div>
                    </button>
                    {showMarkTools && (
                        <div className="markTools">
                            <button
                                className={`button button_md ${annotationTool === "Angle" ? "active" : ""}`}
                                onClick={() => handletoggle("Angle") }
                                title="각도"
                            >
                                <div className="icon-label">
                                    <DraftingCompass />
                                    <span className="icon-text">각도</span>
                                </div>
                            </button>
                            <button
                                className={`button button_md ${annotationTool === "Length" ? "active" : ""}`}
                                onClick={() => handletoggle("Length") }
                                title="길이"
                            >
                                <div className="icon-label">
                                    <Ruler />
                                    <span className="icon-text">길이</span>
                                </div>
                            </button>
                            <button
                                className={`button button_md ${annotationTool === "Probe" ? "active" : ""}`}
                                onClick={() => handletoggle("Probe") }
                                title="픽셀 정보"
                            >
                                <div className="icon-label">
                                    <ScanEye />
                                    <span className="icon-text">픽셀정보</span>
                                </div>
                            </button>
                            <button
                                className={`button button_md ${annotationTool === "RectangleROI" ? "active" : ""}`}
                                onClick={() => handletoggle("RectangleROI") }
                                title="사각형"
                            >
                                <div className="icon-label">
                                    <Square />
                                    <span className="icon-text">사각형 모양</span>
                                </div>
                            </button>
                            <button
                                className={`button button_md ${annotationTool === "EllipticalROI" ? "active" : ""}`}
                                onClick={() => handletoggle("EllipticalROI") }
                                title="원형"
                            >
                                <div className="icon-label">
                                    <Circle />
                                    <span className="icon-text">원형 모양</span>
                                </div>
                            </button>
                            <button
                                className={`button button_md ${annotationTool === "Eraser" ? "active" : ""}`}
                                onClick={() => handletoggle("Eraser") }
                                title="지우개"
                            >
                                <div className="icon-label">
                                    <Eraser />
                                    <span className="icon-text">지우개</span>
                                </div>
                            </button>
                            <button
                                className={`button button_md ${annotationTool === "Label" ? "active" : ""}`}
                                onClick={() => handletoggle("Label") }
                                title="텍스트"
                            >
                                <div className="icon-label">
                                    <Type />
                                    <span className="icon-text">텍스트</span>
                                </div>
                            </button>
                        </div>
                    )}
                    <button
                        className={`button button_lg ${activeTool === "Section" ? "active" : ""}`}
                        onClick={() => { handleClick("Section"); setShowSection(!showSection); }}
                        title="Series"
                    >
                        <div className="icon-label">
                            <LayoutGrid />
                            <span className="icon-text">Series</span>
                        </div>
                    </button>
                </div>

                {showSection && (
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
