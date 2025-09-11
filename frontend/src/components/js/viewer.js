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
} from "@cornerstonejs/tools";
import * as toolsEnums from "@cornerstonejs/tools/enums";
import "../css/viewer.css";
import "./header";
import Header from "./header";
import Sidebar from "./sidebar";

function Viewer() {
    const navigate = useNavigate();
    const { studyUid } = useParams();
    const [data, setData] = useState(null);
    const [toolGroup, setToolGroup] = useState(null);
    const [stack, setStack] = useState({ imageIds: [], currentIndex: 0 });
    const [cornerstoneReady, setCornerstoneReady] = useState(false);

    const [grid, setGrid] = useState({ rows: 1, cols: 1 });
    const elementRefs = useRef({}); // 여러 뷰포트 DOM 저장
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
        if (!toolGroup) return;

        if (toolName === "Section") {
            const { row, col } = options;
            if (row && col) { // 값이 들어왔을 때만 적용
                setGrid({ rows: row, cols: col });
            }
            return;
        }

        // 모든 툴 비활성화
        [
            WindowLevelTool.toolName,
            PanTool.toolName,
            ZoomTool.toolName,
            AngleTool.toolName,
            LengthTool.toolName,
            ProbeTool.toolName,
            RectangleROITool.toolName,
            EllipticalROITool.toolName,
            EraserTool.toolName,
            LabelTool.toolName,
        ].forEach((name) => {
            toolGroup.setToolPassive(name);
        });

        if (toolName === "Basic") return;
        if (toolName === "Home") navigate("/");

        if (toolName === "Zoom") {
            toolGroup.setToolActive(ZoomTool.toolName, {
                bindings: [{ mouseButton: toolsEnums.MouseBindings.Primary }],
            });
        } else if (toolName === "Move") {
            toolGroup.setToolActive(PanTool.toolName, {
                bindings: [{ mouseButton: toolsEnums.MouseBindings.Primary }],
            });
        } else if (toolName === "WindowLevel") {
            toolGroup.setToolActive(WindowLevelTool.toolName, {
                bindings: [{ mouseButton: toolsEnums.MouseBindings.Primary }],
            });
        } else if (toolName === "Angle") {
            toolGroup.setToolActive(AngleTool.toolName, {
                bindings: [{ mouseButton: toolsEnums.MouseBindings.Primary }],
            });
        } else if (toolName === "Length") {
            toolGroup.setToolActive(LengthTool.toolName, {
                bindings: [{ mouseButton: toolsEnums.MouseBindings.Primary }],
            });
        } else if (toolName === "Probe") {
            toolGroup.setToolActive(ProbeTool.toolName, {
                bindings: [{ mouseButton: toolsEnums.MouseBindings.Primary }],
            });
        } else if (toolName === "RectangleROI") {
            toolGroup.setToolActive(RectangleROITool.toolName, {
                bindings: [{ mouseButton: toolsEnums.MouseBindings.Primary }],
            });
        } else if (toolName === "EllipticalROI") {
            toolGroup.setToolActive(EllipticalROITool.toolName, {
                bindings: [{ mouseButton: toolsEnums.MouseBindings.Primary }],
            });
        } else if (toolName === "Eraser") {
            toolGroup.setToolActive(EraserTool.toolName, {
                bindings: [{ mouseButton: toolsEnums.MouseBindings.Primary }],
            });
        } else if (toolName === "Label") {
            toolGroup.setToolActive(LabelTool.toolName, {
                bindings: [{ mouseButton: toolsEnums.MouseBindings.Primary }],
            });
        }
    };

    // Cornerstone 초기화
    useEffect(() => {
        async function initCornerstone() {
            await coreInit();
            await dicomImageLoaderInit({
                maxWebWorkers: navigator.hardwareConcurrency || 1,
            });
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
                const res = await fetch(
                    `http://localhost:8080/api/v1/studies/${studyUid}`
                );
                const data = await res.json();
                setData(data);

                const ids = data.data.map(
                    (img) =>
                        `wadouri:http://localhost:8080/api/v1/studies/${studyUid}/image?path=${encodeURIComponent(
                            img.path
                        )}&fname=${encodeURIComponent(img.fname)}`
                );
                setStack({ imageIds: ids, currentIndex: 0 });
            } catch (err) {
                console.error("이미지 fetch 실패:", err);
            }
        }
        fetchImages();
    }, [studyUid]);

    // overlay 표시
    const setViewportOverlay = (viewport, text) => {
        if (!viewport) return;
        let overlayDiv = viewport.element.querySelector(".viewportOverlay");
        if (!overlayDiv) {
            overlayDiv = document.createElement("div");
            overlayDiv.className = "viewportOverlay";
            overlayDiv.style.position = "absolute";
            overlayDiv.style.top = "5px";
            overlayDiv.style.left = "5px";
            overlayDiv.style.color = "yellow";
            overlayDiv.style.padding = "2px 5px";
            overlayDiv.style.borderRadius = "4px";
            overlayDiv.style.fontSize = "100%";
            overlayDiv.style.pointerEvents = "none";
            overlayDiv.style.backgroundColor = "transparent";
            viewport.element.appendChild(overlayDiv);
        }
        overlayDiv.innerText = text;
    };

    // RenderingEngine + 여러 Viewport 생성
    useEffect(() => {
        if (!cornerstoneReady || !stack.imageIds.length || !data) return;

        // 기존 엔진 초기화
        if (renderingEngineRef.current) {
            renderingEngineRef.current.disableElement();
        }

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

        // ToolGroup 생성
        const toolGroupId = "ctToolGroup";
        let ctToolGroup = ToolGroupManager.getToolGroup(toolGroupId);
        if (!ctToolGroup) {
            ctToolGroup = ToolGroupManager.createToolGroup(toolGroupId);
            ctToolGroup.addTool(PanTool.toolName);
            ctToolGroup.addTool(ZoomTool.toolName);
            ctToolGroup.addTool(StackScrollTool.toolName);
            ctToolGroup.addTool(WindowLevelTool.toolName);
            ctToolGroup.addTool(LengthTool.toolName);
            ctToolGroup.addTool(ProbeTool.toolName);
            ctToolGroup.addTool(RectangleROITool.toolName);
            ctToolGroup.addTool(EllipticalROITool.toolName);
            ctToolGroup.addTool(AngleTool.toolName);
            ctToolGroup.addTool(EraserTool.toolName);
            ctToolGroup.addTool(LabelTool.toolName);

            [
                WindowLevelTool,
                PanTool,
                ZoomTool,
                LengthTool,
                ProbeTool,
                RectangleROITool,
                EllipticalROITool,
                AngleTool,
                EraserTool,
                LabelTool,
            ].forEach((t) => ctToolGroup.setToolPassive(t.toolName));

            ctToolGroup.setToolActive(StackScrollTool.toolName, {
                bindings: [{ mouseButton: toolsEnums.MouseBindings.Wheel }],
            });
        }
        setToolGroup(ctToolGroup);

        // 각 뷰포트 생성
        const totalViewports = grid.rows * grid.cols;
        const step = Math.floor(stack.imageIds.length / totalViewports);

        // 각 뷰포트 생성
        Object.entries(elementRefs.current).forEach(([id, element], idx) => {
            renderingEngine.enableElement({ viewportId: id, element, type: "stack" });
            const viewport = renderingEngine.getViewport(id);

            const sliceIndex = Math.min(step * idx, stack.imageIds.length - 1);
            viewport.setStack(stack.imageIds, sliceIndex).then(() => {
                const currentImage = data.data[sliceIndex];
                if (currentImage) {
                    setViewportOverlay(
                        viewport,
                        `${currentImage.pid}\n${currentImage.pname}\nSeries: ${currentImage.serieskey}\nImage: ${currentImage.imagekey}\nStudyDate: ${currentImage.studydate}\nStudyTime: ${currentImage.studytime}\n`
                    );
                }
                viewport.setDisplayArea({
                    imageArea: [1, 1],
                    imageCanvasPoint: { imagePoint: [0.5, 0.5], canvasPoint: [0.5, 0.5] },
                });
                viewport.render();
            });

            ctToolGroup.addViewport(id, renderingEngine.id);

        });
    }, [cornerstoneReady, stack.imageIds, data, grid]);

    useEffect(() => {
        if (!cornerstoneReady || !stack.imageIds.length || !data) return;

        const renderingEngine = renderingEngineRef.current;
        if (!renderingEngine) return;

        Object.entries(elementRefs.current).forEach(([id, element]) => {
            const viewport = renderingEngine.getViewport(id);
            if (!viewport) return;

            const onStackNewImage = (evt) => {
                const currentIndex = viewport.getCurrentImageIdIndex();
                const currentImage = data.data[currentIndex];
                if (currentImage) {
                    setViewportOverlay(viewport, `${currentImage.pid}\n${currentImage.pname}\nSeries: ${currentImage.serieskey}\nImage: ${currentImage.imagekey}\nStudyDate: ${currentImage.studydate}\nStudyTime: ${currentImage.studytime}\n`);
                }
            };

            element.addEventListener(STACK_NEW_IMAGE, onStackNewImage);

            // cleanup
            return () => {
                element.removeEventListener(STACK_NEW_IMAGE, onStackNewImage);
            };
        });
    }, [cornerstoneReady, stack.imageIds, data, grid]);

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
                            <div key={id} ref={(el) => {if (el) elementRefs.current[id] = el;}}
                                style={{ position: "relative", width: "100%", height: "100%",}}
                            />
                        );
                    })
                )}
            </div>
        </div>
    );
}

export default Viewer;
