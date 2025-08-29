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

    const [studykey, setStudyKey] = useState(0);
    const [userid, setUserid] = useState(null);
    const [reportText, setReportText] = useState("");

    useEffect(() => {
        fetch("http://localhost:8080/api/v1/studies")
            .then((res) => res.json())
            .then((data) => {
                setTotalCnt(data.recordCnt);
                setStudyList(data.data);
            })
            .catch((err) => console.error("데이터 가져오기 실패:", err));
    }, []);

    const handleRecordSearch = (pid, studykey) => {
        setStudyKey(studykey);
        fetch(`http://localhost:8080/api/v1/studies/${pid}/record`)
            .then((res) => res.json())
            .then((data) => {
                setStudy2List(data.data);
            })
            .catch((err) => console.error("데이터 가져오기 실패:", err));
        // 코멘트 불러오기
        fetch(`http://localhost:8080/report?key=${studykey}`, {
            method: "GET",
        })
            .then(res => res.text())  // text로 받기
            .then(text => {
                setReportText(text);  // 상태에 저장
                console.log("받은 리포트:", text);
            })
            .catch(err => console.error("리포트 가져오기 실패:", err));

    };

    const handleReport = () => { // 코멘트 저장
        const comment = document.querySelector(".report").value;
        fetch(`http://localhost:8080/report?id=${userid}&key=${studykey}&comment=${comment}`,{
            method: "POST",
        })
            .then((res) => res.text())   // 먼저 텍스트로 받기
            .then((text) => {
                const data = JSON.parse(text);
                if(data.success){
                    alert("성공적으로 저장했습니다.");
                } else{
                    alert("저장에 실패했습니다.");
                }
            })
            .catch((err) => {
                console.error("저장 실패:", err);
            })
    }

    return (
        <div className="container">
            <Header setUserid={setUserid} />

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
                    <textarea className="report" value={reportText} onChange={(e) => setReportText(e.target.value)}></textarea>
                    <button className="report-submit" onClick={handleReport}>저장</button>
                </div>
            </div>
        </div>
    );
}

export default Main;
