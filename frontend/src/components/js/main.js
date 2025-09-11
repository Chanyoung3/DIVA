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
        size: 200,
    },
    {
        accessorKey: "pname",
        header: "환자 이름",
        size: 200,
    },
    {
        accessorKey: "studydesc",
        header: "검사 설명",
        size: 600,
    },
    {
        accessorKey: "bodypart",
        header: "검사 부위",
        size: 200,
    },
    {
        accessorKey: "seriescnt",
        header: "시리즈 수",
        size: 100,
    },
    {
        accessorKey: "imagecnt",
        header: "이미지 수",
        size: 100,
    },
    {
        accessorKey: "modality",
        header: "장비",
        size: 200,
    },
    {
        accessorKey: "studydate",
        header: "검사 날짜",
        size: 200,
    },
];

const columns2  = [
    {
        accessorKey: "modality",
        header: "검사장비",
        size: 200,
    },
    {
        accessorKey: "studydesc",
        header: "검사설명",
        size: 600,
    },
    {
        accessorKey: "studydate",
        header: "검사일시",
        size: 100,
    },
    {
        accessorKey: "seriescnt",
        header: "시리즈",
        size: 100,
    },
    {
        accessorKey: "imagecnt",
        header: "이미지",
        size: 100,
    },
];

function Main() {
    const [totalCnt, setTotalCnt] = useState("");
    const [studyList, setStudyList] = useState([]);
    const [study2List, setStudy2List] = useState([]);
    const [filteredStudyList, setFilteredStudyList] = useState([]);

    const [studykey, setStudyKey] = useState(0);
    const [userid, setUserid] = useState(null);
    const [reportText, setReportText] = useState("");

    const [searchType, setSearchType] = useState("name");
    const [searchTerm, setSearchTerm] = useState("");

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const todayStr = `${yyyy}-${mm}-${dd}`;

    const [startDate, setStartDate] = useState(todayStr);
    const [endDate, setEndDate] = useState(todayStr);


    useEffect(() => {
        fetch("http://localhost:8080/api/v1/studies")
            .then((res) => res.json())
            .then((data) => {
                setStudyList(data.data);

                const formatDate = (dateStr) => {
                    if (!dateStr) return null;
                    if (dateStr.includes("-")) return new Date(dateStr);
                    if (dateStr.length === 8) {
                        const y = dateStr.slice(0, 4);
                        const m = dateStr.slice(4, 6);
                        const d = dateStr.slice(6, 8);
                        return new Date(`${y}-${m}-${d}`);
                    }
                    return new Date(dateStr);
                };

                const filteredToday = data.data.filter(item => {
                    const itemDate = formatDate(item.studydate);
                    const todayDate = formatDate(todayStr.replace(/-/g,""));
                    return itemDate && itemDate.toDateString() === todayDate.toDateString();
                });

                setFilteredStudyList(filteredToday);
                setTotalCnt(filteredToday.length);
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
            })
            .catch(err => console.error("리포트 가져오기 실패:", err));

    };

    const handleReport = () => { // 코멘트 저장
        const comment = document.querySelector(".report").value;
        if ( studykey == 0 || userid == null ) alert("잘못된 접근입니다.");
        else{
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
    }

    const handleSearch = () => {
        const filtered = studyList.filter((item) => {

            const formatDate = (dateStr) => {
                if (!dateStr) return null;
                if (dateStr.includes("-")) return new Date(dateStr);
                if (dateStr.length === 8) {
                    const y = dateStr.slice(0, 4);
                    const m = dateStr.slice(4, 6);
                    const d = dateStr.slice(6, 8);
                    return new Date(`${y}-${m}-${d}`);
                }
                return new Date(dateStr);
            };

            const itemDate = formatDate(item.studydate);
            const start = new Date(startDate);
            const end = new Date(endDate);

            const matchDate = itemDate && itemDate >= start && itemDate <= end;

            if (!searchTerm.trim()) {
                return matchDate;
            }

            const matchSearch =
                searchType === "name"
                    ? item.pname?.includes(searchTerm)
                    : item.pid?.toString().includes(searchTerm);

            return matchSearch && matchDate;
        });

        setFilteredStudyList(filtered);
        setTotalCnt(filtered.length);
    };

    return (
        <div className="container">
            <div className="option">
                <Header setUserid={setUserid} />
                <div className="search-container card">
                    <div className="title">검색</div>
                    <div className="search-box">
                        <div className="search-inputs">
                            <select value={searchType} onChange={(e) => setSearchType(e.target.value)}>
                                <option value="name">환자 이름</option>
                                <option value="id">환자 ID</option>
                            </select>
                            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => {if (e.key === "Enter") {handleSearch();}}}/>
                            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}/>
                            <span>~</span>
                            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}/>
                        </div>

                        <button onClick={handleSearch}>검색</button>
                    </div>
                </div>
            </div>
            <div className="tables">
                    <div className="left-panel card">
                        <div className="title">검사 이력</div>
                        <ReportTable columns={columns2} data={study2List} />

                        <div className="report-section">
                            <div className="title">리포트</div>
                            <textarea className="report" placeholder="코멘트를 입력해주세요." value={reportText} onChange={(e) => setReportText(e.target.value)}/>
                            <button className="report-submit" onClick={handleReport}>저장</button>
                        </div>
                    </div>
                    <div className="data-table-container card">
                        <div className="title">전체 리스트</div>
                        <DataTable columns={columns} data={filteredStudyList} cnt={totalCnt} onRecordSearch={handleRecordSearch}/>
                    </div>
                </div>
        </div>
    );
}

export default Main;
