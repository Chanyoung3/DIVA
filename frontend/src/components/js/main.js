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
        accessorKey: "ed_studyequipment",
        header: "검사장비",
    },
    {
        accessorKey: "ed_studyexplanation",
        header: "검사설명",
    },
    {
        accessorKey: "ed_studydate",
        header: "검사일시",
    },
    {
        accessorKey: "ed_seriesnum",
        header: "시리즈",
    },
    {
        accessorKey: "ed_imagecnt",
        header: "이미지",
    },
];

const seriesList2 = [

]
function Main() {
    const [seriesList, setSeriesList] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8080/api/v1/studies")
            .then((res) => res.json())
            .then((data) => {
                setSeriesList(data);
                console.log("data: " + data);
            })
            .catch((err) => console.error("데이터 가져오기 실패:", err));
    }, []);

    return (
        <div className="container">
            <Header />

            <div className="content">
                <div className="tables">
                    <div className="recordsec card">
                        <ReportTable columns={columns2} data={seriesList2} />
                    </div>

                    <div className="data-table-container card">
                        <DataTable columns={columns} data={seriesList} />
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
