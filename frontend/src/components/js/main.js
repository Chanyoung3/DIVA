import React, { useEffect, useState } from "react";
import { DataTable } from "../ui/data-table";
import { ReportTable } from "../ui/report-table";
import "../css/main.css";
import Header from "./header";

// 컬럼 정의 (타입 없이)
const columns = [
    {
        accessorKey: "pid",
        header: "환자 ID",
    },
    {
        accessorKey: "studydesc",
        header: "검사 설명",
    },
    {
        accessorKey: "bodypart",
        header: "검사 부위",
    },
    {
        accessorKey: "seriescnt",
        header: "시리즈 수",
    },
    {
        accessorKey: "imagecnt",
        header: "이미지 수",
    },
    {
        accessorKey: "modality",
        header: "장비",
    },
    {
        accessorKey: "studydate",
        header: "검사 날짜",
    },
];

const columns2  = [
    {
        accessorKey: "modality",
        header: "검사장비",
    },
    {
        accessorKey: "studydesc",
        header: "검사설명",
    },
    {
        accessorKey: "studydate",
        header: "검사일시",
    },
    {
        accessorKey: "seriescnt",
        header: "시리즈",
    },
    {
        accessorKey: "imagecnt",
        header: "이미지",
    },
];

function Main() {
    const [totalCnt, setTotalCnt] = useState("");
    const [studyList, setStudyList] = useState([]);
    const [study2List, setStudy2List] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8080/api/v1/studies")
            .then((res) => res.json())
            .then((data) => {
                setTotalCnt(data.recordCnt);
                setStudyList(data.data);
            })
            .catch((err) => console.error("데이터 가져오기 실패:", err));
    }, []);

    const handleRecordSearch = (pid) => {
        fetch(`http://localhost:8080/api/v1/studies/${pid}/record`)
            .then((res) => res.json())
            .then((data) => {
                setStudy2List(data.data);
            })
            .catch((err) => console.error("데이터 가져오기 실패:", err));
    };

    return (
        <div className="container">
            <Header />

            <div className="content">
                <div className="tables">
                    <div className="recordsec card">
                        <ReportTable columns={columns2} data={study2List} />
                    </div>

                    <div className="data-table-container card">
                        <DataTable columns={columns} data={studyList} cnt={totalCnt} onRecordSearch={handleRecordSearch}/>
                    </div>
                </div>

                <div className="report-container card">
                    <h3>리포트</h3>
                    <textarea className="report"></textarea>
                    <button className="report-submit">저장</button>
                </div>
            </div>
        </div>
    );
}

export default Main;
