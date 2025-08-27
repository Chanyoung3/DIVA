import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { init as coreInit, RenderingEngine } from "@cornerstonejs/core";
import { init as dicomImageLoaderInit } from "@cornerstonejs/dicom-image-loader";
import * as csTools3d from "@cornerstonejs/tools";
import { StackScrollTool, init as toolsInit, ToolGroupManager, WindowLevelTool } from "@cornerstonejs/tools";
import * as toolsEnums from "@cornerstonejs/tools/enums";
import "../css/viewer.css";
import "./header";
import Header from "./header";
import Sidebar from "./sidebar";

function Viewer() {
    const { studyUid } = useParams();
    const [data, setData] = useState(null);
    const [toolGroup, setToolGroup] = useState(null);
    const [stack, setStack] = useState({ imageIds: [], currentIndex: 0 });
    const [cornerstoneReady, setCornerstoneReady] = useState(false);

    const elementRef = useRef(null);
    const renderingEngineRef = useRef(null);
    const viewportRef = useRef(null);
    const viewportId = "CT_AXIAL_STACK";

    const { PanTool, ZoomTool, LengthTool, ProbeTool } = csTools3d;

    // Viewer.js
    const activateTool = (toolName) => {
        if (!toolGroup) return;

        // 모든 툴 비활성화
        [WindowLevelTool.toolName, PanTool.toolName, ZoomTool.toolName, StackScrollTool.toolName].forEach(name => {
            toolGroup.setToolPassive(name);
        });

        // Basic 은 그냥 전부 비활성화된 상태 유지
        if (toolName === "Basic") return;

        // 선택한 툴만 활성화
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
        }
    };


    // 1️⃣ Cornerstone 초기화
    useEffect(() => {
        async function initCornerstone() {
            await coreInit();
            await dicomImageLoaderInit({ maxWebWorkers: navigator.hardwareConcurrency || 1 });
            await toolsInit();
            setCornerstoneReady(true);
        }
        initCornerstone();
    }, []);

    // 2️⃣ 이미지 fetch
    useEffect(() => {
        if (!studyUid) return;
        async function fetchImages() {
            try {
                const res = await fetch(`http://localhost:8080/api/v1/studies/${studyUid}`);
                const data = await res.json();
                setData(data);

                const ids = data.data.map(
                    img => `wadouri:http://localhost:8080/api/v1/studies/${studyUid}/image?path=${encodeURIComponent(img.path)}&fname=${encodeURIComponent(img.fname)}`
                );
                setStack({ imageIds: ids, currentIndex: 0 });
            } catch (err) {
                console.error("이미지 fetch 실패:", err);
            }
        }
        fetchImages();
    }, [studyUid]);

    // overlay 표시 함수
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
            overlayDiv.style.backgroundColor = "rgba(0,0,0,0.3)";
            overlayDiv.style.padding = "2px 5px";
            overlayDiv.style.borderRadius = "4px";
            overlayDiv.style.fontSize = "100%";
            overlayDiv.style.pointerEvents = "none";
            overlayDiv.style.backgroundColor = "transparent";
            viewport.element.appendChild(overlayDiv);
        }
        overlayDiv.innerText = text;
    };

    // 3️⃣ RenderingEngine + Viewport + ToolGroup 설정
    useEffect(() => {
        if (!cornerstoneReady || !stack.imageIds.length || !elementRef.current || !data) return;
        if (renderingEngineRef.current) return;

        const renderingEngine = new RenderingEngine("engine");
        renderingEngine.enableElement({ viewportId, element: elementRef.current, type: "stack" });
        const viewport = renderingEngine.getViewport(viewportId);

        renderingEngineRef.current = renderingEngine;
        viewportRef.current = viewport;

        // 툴 등록
        [PanTool, ZoomTool, LengthTool, ProbeTool, StackScrollTool, WindowLevelTool].forEach(tool => csTools3d.addTool(tool));

        viewport.setStack(stack.imageIds, stack.currentIndex).then(() => {
            const toolGroupId = "ctToolGroup";
            let ctToolGroup = ToolGroupManager.getToolGroup(toolGroupId);

            if (!ctToolGroup) {
                ctToolGroup = ToolGroupManager.createToolGroup(toolGroupId);
                ctToolGroup.addTool(PanTool.toolName);
                ctToolGroup.addTool(ZoomTool.toolName);
                ctToolGroup.addTool(StackScrollTool.toolName);
                ctToolGroup.addTool(WindowLevelTool.toolName);

                ctToolGroup.addViewport(viewportId, renderingEngine.id);

                ctToolGroup.setToolPassive(WindowLevelTool.toolName);
                ctToolGroup.setToolPassive(PanTool.toolName);
                ctToolGroup.setToolPassive(ZoomTool.toolName);
                ctToolGroup.setToolActive(StackScrollTool.toolName, {
                    bindings: [
                        { mouseButton: toolsEnums.MouseBindings.Primary },
                        { mouseButton: toolsEnums.MouseBindings.Wheel },
                    ],
                });
            }
            setToolGroup(ctToolGroup);

            setInterval(() => {
                const index = viewportRef.current.getCurrentImageIdIndex();
                setStack(prev => {
                    if (index !== prev.currentIndex) {
                        return { ...prev, currentIndex: index };
                    }
                    return prev;
                });
            }, 10);

            // 초기 overlay 설정
            const currentImage = data.data[stack.currentIndex];
            if (currentImage) {
                setViewportOverlay(viewport, `${currentImage.pid}\n${currentImage.pname}\nSeries: ${currentImage.serieskey}\nImage: ${currentImage.imagekey}\nStudyDate: ${currentImage.studydate}\nStudyTime: ${currentImage.studytime}\n`);
            }

            viewport.setDisplayArea({
                imageArea: [1,1],         // 뷰포트에 맞춰 최대 영역
                imageCanvasPoint: {       // 이미지 중앙 기준
                    imagePoint: [0.5,0.5],
                    canvasPoint: [0.5,0.5]
                }
            });
            viewport.render();

        });
    }, [cornerstoneReady, stack.imageIds, data]);

    // 4️⃣ stack.currentIndex 변경 시 overlay 갱신
    useEffect(() => {
        const viewport = viewportRef.current;
        if (!viewport || !data) return;

        const currentImage = data.data[stack.currentIndex];
        if (currentImage) {
            setViewportOverlay(viewport, `${currentImage.pid}\n${currentImage.pname}\nSeries: ${currentImage.serieskey}\nImage: ${currentImage.imagekey}\nStudyDate: ${currentImage.studydate}\nStudyTime: ${currentImage.studytime}\n`);
        }
    }, [stack.currentIndex, data]);

    useEffect(() => {
        const applyFitImage = () => {
            const viewport = viewportRef.current;
            if (!viewport) return;
            viewport.setDisplayArea({
                imageArea: [1, 1],
                imageCanvasPoint: {
                    imagePoint: [0.5, 0.5],
                    canvasPoint: [0.5, 0.5],
                },
            });
            viewport.render();
        };

        window.addEventListener("resize", applyFitImage);
        applyFitImage(); // ✅ 최초 한 번 실행

        return () => {
            window.removeEventListener("resize", applyFitImage);
        };
    }, []);

    return (
        <div className="viewerpage">
            <Header />
            <Sidebar onActivateTool={activateTool} />
            <div className="viewimage" ref={elementRef} />
        </div>

    );
}

export default Viewer;
