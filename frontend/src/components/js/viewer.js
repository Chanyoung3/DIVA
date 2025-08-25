import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { init as coreInit, RenderingEngine } from "@cornerstonejs/core";
import { init as dicomImageLoaderInit } from "@cornerstonejs/dicom-image-loader";
import * as csTools3d from "@cornerstonejs/tools";
import { StackScrollTool, init as toolsInit, ToolGroupManager, WindowLevelTool } from "@cornerstonejs/tools";
import * as toolsEnums from "@cornerstonejs/tools/enums";

function Viewer() {
    const { studyUid } = useParams();
    const [data, setData] = useState(null);
    const [stack, setStack] = useState({ imageIds: [], currentIndex: 0 });
    const [cornerstoneReady, setCornerstoneReady] = useState(false);

    const elementRef = useRef(null);
    const renderingEngineRef = useRef(null);
    const viewportRef = useRef(null);
    const viewportId = "CT_AXIAL_STACK";

    const { PanTool, ZoomTool, LengthTool, ProbeTool } = csTools3d;

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
            overlayDiv.style.fontSize = "20px";
            overlayDiv.style.pointerEvents = "none";
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

                // 툴 활성화
                ctToolGroup.setToolActive(WindowLevelTool.toolName, {
                    bindings: [{ mouseButton: toolsEnums.MouseBindings.Primary }],
                });
                ctToolGroup.setToolActive(PanTool.toolName, {
                    bindings: [{
                        mouseButton: toolsEnums.MouseBindings.Primary,
                        modifierKey: toolsEnums.KeyboardBindings.Ctrl,
                    }],
                });
                ctToolGroup.setToolActive(ZoomTool.toolName, {
                    bindings: [{ mouseButton: toolsEnums.MouseBindings.Secondary }],
                });
                ctToolGroup.setToolActive(StackScrollTool.toolName, {
                    bindings: [
                        { mouseButton: toolsEnums.MouseBindings.Primary },
                        { mouseButton: toolsEnums.MouseBindings.Wheel },
                    ],
                });
            }

            // 초기 overlay 설정
            const currentImage = data.data[stack.currentIndex];
            if (currentImage) {
                setViewportOverlay(viewport, `Series: ${currentImage.serieskey}\nImage: ${currentImage.imagekey}`);
            }
            viewport.render();
        });

    }, [cornerstoneReady, stack.imageIds, data]);

    // 4️⃣ stack.currentIndex 변경 시 overlay 갱신
    useEffect(() => {
        const viewport = viewportRef.current;
        if (!viewport || !data) return;

        const currentImage = data.data[stack.currentIndex];
        if (currentImage) {
            setViewportOverlay(viewport, `Series: ${currentImage.serieskey}\nImage: ${currentImage.imagekey}`);
        }
    }, [stack.currentIndex, data]);

    return (
        <div>
            <h1>Study {studyUid}</h1>
            <div
                ref={elementRef}
                style={{ width: 1600, height: 900, background: "black", position: "relative" }}
            />
        </div>
    );
}

export default Viewer;
