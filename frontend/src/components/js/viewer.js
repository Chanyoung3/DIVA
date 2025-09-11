import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { init as coreInit, RenderingEngine, Enums } from "@cornerstonejs/core";
import { init as dicomImageLoaderInit } from "@cornerstonejs/dicom-image-loader";
import * as csTools3d from "@cornerstonejs/tools";
import {
    StackScrollTool,
    init as toolsInit,
    ToolGroupManager,
    WindowLevelTool,
    ProbeTool,
    RectangleROITool,
    EllipticalROITool,
    EraserTool,
    AngleTool,
    LabelTool,
    LengthTool,
} from "@cornerstonejs/tools";
import * as toolsEnums from "@cornerstonejs/tools/enums";
import "../css/viewer.css";
import Header from "./header";
import Sidebar from "./sidebar";

function Viewer() {
    const navigate = useNavigate();
    const { studyUid } = useParams();
    const [data, setData] = useState(null);
    const [cornerstoneReady, setCornerstoneReady] = useState(false);
    const [grid, setGrid] = useState({ rows: 1, cols: 1 });
    const elementRefs = useRef({});
    const renderingEngineRef = useRef(null);

    const { STACK_NEW_IMAGE } = Enums.Events;
    const {
        PanTool,
        ZoomTool,
        WindowLevelTool,
        AngleTool,
        LengthTool,
        ProbeTool,
        RectangleROITool,
        EllipticalROITool,
        EraserTool,
        LabelTool,
    } = csTools3d;

    // 툴 활성화 함수
    const activateTool = (toolName, options = {}) => {
        const toolGroups = ToolGroupManager.getAllToolGroups();
        if (!toolGroups.length) return;

        // 모든 뷰포트 ToolGroup에서 툴 비활성화
        toolGroups.forEach((tg) => {
            [
                WindowLevelTool,
                PanTool,
                ZoomTool,
                AngleTool,
                LengthTool,
                ProbeTool,
                RectangleROITool,
                EllipticalROITool,
                EraserTool,
                LabelTool,
            ].forEach((t) => tg.setToolPassive(t.toolName));
        });

        if (toolName === "Section" && options.row && options.col) {
            setGrid({ rows: options.row, cols: options.col });
            return;
        }

        if (toolName === "Home") navigate("/");

        toolGroups.forEach((tg) => {
            let tool;
            switch (toolName) {
                case "Zoom":
                    tool = ZoomTool; break;
                case "Move":
                    tool = PanTool; break;
                case "WindowLevel":
                    tool = WindowLevelTool; break;
                case "Angle":
                    tool = AngleTool; break;
                case "Length":
                    tool = LengthTool; break;
                case "Probe":
                    tool = ProbeTool; break;
                case "RectangleROI":
                    tool = RectangleROITool; break;
                case "EllipticalROI":
                    tool = EllipticalROITool; break;
                case "Eraser":
                    tool = EraserTool; break;
                case "Label":
                    tool = LabelTool; break;
                default:
                    tool = null;
            }
            if (tool) {
                tg.setToolActive(tool.toolName, {
                    bindings: [{ mouseButton: toolsEnums.MouseBindings.Primary }],
                });
            }
        });
    };

    // Cornerstone 초기화
    useEffect(() => {
        async function initCornerstone() {
            await coreInit();
            await dicomImageLoaderInit({ maxWebWorkers: navigator.hardwareConcurrency || 1 });
            await toolsInit();
            setCornerstoneReady(true);
        }
        initCornerstone();
    }, []);

    // 이미지 fetch
    useEffect(() => {
        if (!studyUid) return;
        async function fetchImages() {
            try {
                const res = await fetch(`http://localhost:8080/api/v1/studies/${studyUid}`);
                const data = await res.json();
                setData(data);
            } catch (err) {
                console.error("이미지 fetch 실패:", err);
            }
        }
        fetchImages();
    }, [studyUid]);

    // Overlay 설정
    const setViewportOverlay = (viewport, text) => {
        if (!viewport) return;
        let overlayDiv = viewport.element.querySelector(".viewportOverlay");
        if (!overlayDiv) {
            overlayDiv = document.createElement("div");
            overlayDiv.className = "viewportOverlay";
            Object.assign(overlayDiv.style, {
                position: "absolute",
                top: "5px",
                left: "5px",
                color: "yellow",
                padding: "2px 5px",
                borderRadius: "4px",
                fontSize: "100%",
                pointerEvents: "none",
                backgroundColor: "transparent",
            });
            viewport.element.appendChild(overlayDiv);
        }
        overlayDiv.innerText = text;
    };

    // RenderingEngine + Viewport 생성
    useEffect(() => {
        if (!cornerstoneReady || !data) return;

        // 기존 엔진 초기화
        if (renderingEngineRef.current) renderingEngineRef.current.disableElement();

        const renderingEngine = new RenderingEngine("engine");
        renderingEngineRef.current = renderingEngine;

        // 툴 등록
        [
            PanTool,
            ZoomTool,
            AngleTool,
            ProbeTool,
            RectangleROITool,
            EllipticalROITool,
            LengthTool,
            LabelTool,
            EraserTool,
            StackScrollTool,
            WindowLevelTool,
        ].forEach((tool) => csTools3d.addTool(tool));

        // 시리즈별 그룹화
        const seriesMap = {};
        data.data.forEach((img) => {
            if (!seriesMap[img.serieskey]) seriesMap[img.serieskey] = [];
            seriesMap[img.serieskey].push(img);
        });
        const seriesList = Object.values(seriesMap);

        // 뷰포트별 생성
        Object.entries(elementRefs.current).forEach(([id, element], idx) => {
            const series = seriesList[idx]; // idx번째 시리즈
            if (!series) return;

            renderingEngine.enableElement({ viewportId: id, element, type: "stack" });
            const viewport = renderingEngine.getViewport(id);

            const imageIds = series.map(img =>
                `wadouri:http://localhost:8080/api/v1/studies/${studyUid}/image?path=${encodeURIComponent(img.path)}&fname=${encodeURIComponent(img.fname)}`
            );

            viewport.setStack(imageIds, 0).then(() => {
                setViewportOverlay(
                    viewport,
                    `${series[0].pid}\n${series[0].pname}\nSeries: ${series[0].serieskey}\nImage: ${series[0].imagekey}\nStudyDate: ${series[0].studydate}\nStudyTime: ${series[0].studytime}`
                );
                viewport.setDisplayArea({
                    imageArea: [1, 1],
                    imageCanvasPoint: { imagePoint: [0.5, 0.5], canvasPoint: [0.5, 0.5] },
                });
                viewport.render();
            });

            // 뷰포트별 ToolGroup 생성
            const tgId = `toolGroup-${id}`;
            let tg = ToolGroupManager.getToolGroup(tgId);
            if (!tg) {
                tg = ToolGroupManager.createToolGroup(tgId);
                tg.addTool(StackScrollTool.toolName);
                tg.setToolActive(StackScrollTool.toolName, {
                    bindings: [{ mouseButton: toolsEnums.MouseBindings.Wheel }],
                });
                tg.addViewport(id, renderingEngine.id);
            }

            // STACK_NEW_IMAGE 이벤트 등록
            const onStackNewImage = () => {
                const currentIndex = viewport.getCurrentImageIdIndex();
                const currentImage = series[currentIndex];
                if (currentImage) {
                    setViewportOverlay(
                        viewport,
                        `${currentImage.pid}\n${currentImage.pname}\nSeries: ${currentImage.serieskey}\nImage: ${currentImage.imagekey}\nStudyDate: ${currentImage.studydate}\nStudyTime: ${currentImage.studytime}`
                    );
                }
            };
            element.addEventListener(STACK_NEW_IMAGE, onStackNewImage);

            // Cleanup
            return () => {
                element.removeEventListener(STACK_NEW_IMAGE, onStackNewImage);
            };
        });
    }, [cornerstoneReady, data, grid, studyUid]);

    return (
        <div className="viewerpage">
            <Header />
            <Sidebar onActivateTool={activateTool} />
            <div
                className="viewimage"
                style={{
                    display: "grid",
                    gridTemplateRows: `repeat(${grid.rows}, 1fr)`,
                    gridTemplateColumns: `repeat(${grid.cols}, 1fr)`,
                    gap: "2px",
                    width: "100%",
                    height: "100%",
                }}
            >
                {Array.from({ length: grid.rows }).map((_, r) =>
                    Array.from({ length: grid.cols }).map((_, c) => {
                        const id = `viewport-${r}-${c}`;
                        return (
                            <div
                                key={id}
                                ref={(el) => {
                                    if (el) elementRefs.current[id] = el;
                                }}
                                style={{ position: "relative", width: "100%", height: "100%" }}
                            />
                        );
                    })
                )}
            </div>
        </div>
    );
}

export default Viewer;
