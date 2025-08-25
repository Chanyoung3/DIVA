import React, { useEffect, useState } from "react";
import { DataTable } from "../ui/data-table";
import "../css/main.css";

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

function Main() {
    const [seriesList, setSeriesList] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8080/api/v1/studies")
            .then((res) => res.json())
            .then((data) => {
                setSeriesList(data);
            })
            .catch((err) => console.error("데이터 가져오기 실패:", err));
    }, []);

    return (
        <div className="container mx-auto py-10">
            <h2 className="text-2xl font-bold mb-4">시리즈 목록</h2>
            <DataTable columns={columns} data={seriesList}/>
        </div>
    );
}

export default Main;
