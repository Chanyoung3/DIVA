import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { init as cornerstoneInit, RenderingEngine } from "@cornerstonejs/core";
import { init as dicomImageLoaderInit } from "@cornerstonejs/dicom-image-loader";

function Viewer() {
    const { studyUid } = useParams();
    const elementRef = useRef(null);
    const renderingEngineRef = useRef(null);
    const viewportRef = useRef(null);

    const [stack, setStack] = useState({ imageIds: [], currentIndex: 0 });
    const [cornerstoneReady, setCornerstoneReady] = useState(false);

    // 1️⃣ Cornerstone 초기화
    useEffect(() => {
        async function initCornerstone() {
            await cornerstoneInit();
            await dicomImageLoaderInit({ maxWebWorkers: navigator.hardwareConcurrency || 1 });
            setCornerstoneReady(true);
        }
        initCornerstone();
    }, []);

    // 2️⃣ 이미지 목록 fetch
    useEffect(() => {
        if (!studyUid) return;

        async function fetchImages() {
            try {
                const res = await fetch(`http://localhost:8080/api/v1/studies/${studyUid}`);
                const data = await res.json();
                const ids = data.data.map(img =>
                    `wadouri:http://localhost:8080/api/v1/studies/${studyUid}/image?path=${encodeURIComponent(img.path)}&fname=${encodeURIComponent(img.fname)}`
                );
                setStack({ imageIds: ids, currentIndex: 0 });
            } catch (err) {
                console.error("이미지 fetch 실패:", err);
            }
        }

        fetchImages();
    }, [studyUid]);

    // 3️⃣ RenderingEngine 및 StackViewport 생성 (Cornerstone 초기화 완료 후)
    useLayoutEffect(() => {
        if (!cornerstoneReady) return;
        if (!elementRef.current || renderingEngineRef.current) return;

        try {
            const element = elementRef.current;
            const renderingEngine = new RenderingEngine("engine");
            const viewportId = "STACK_VIEWPORT";

            renderingEngine.enableElement({
                viewportId,
                element,
                type: "stack"
            });

            const viewport = renderingEngine.getViewport(viewportId);

            renderingEngineRef.current = renderingEngine;
            viewportRef.current = viewport;
        } catch (err) {
            console.error("StackViewport 생성 실패:", err);
        }
    }, [cornerstoneReady]);

    // 4️⃣ 이미지 스택 적용
    useEffect(() => {
        const viewport = viewportRef.current;
        if (!viewport) return;
        if (!Array.isArray(stack.imageIds) || !stack.imageIds.length) {
            console.warn("imageIds is not a valid array:", stack.imageIds);
            return;
        }

        const loadStack = async () => {
            try {
                await viewport.setStack(stack.imageIds, stack.currentIndex);
                viewport.render();
            } catch (err) {
                console.error("스택 적용 실패:", err);
            }
        };


        loadStack();
    }, [stack]);

    const prev = () => {
        if (stack.currentIndex === 0) return;
        setStack(prev => ({ ...prev, currentIndex: prev.currentIndex - 1 }));
    };

    const next = () => {
        if (stack.currentIndex === stack.imageIds.length - 1) return;
        setStack(prev => ({ ...prev, currentIndex: prev.currentIndex + 1 }));
    };

    return (
        <div>
            <h1>Study {studyUid}</h1>
            <div ref={elementRef} style={{ width: 1024, height: 1024, background: "black" }} />
            <button onClick={prev} disabled={stack.currentIndex === 0}>이전</button>
            <button onClick={next} disabled={stack.currentIndex === stack.imageIds.length - 1}>다음</button>
            <span>{stack.currentIndex + 1} / {stack.imageIds.length}</span>
        </div>
    );
}

export default Viewer;
