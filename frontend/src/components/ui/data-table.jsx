import React from "react";
import { useNavigate } from "react-router-dom";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";

export function DataTable({ columns, data, cnt, onRecordSearch }) {
    const navigate = useNavigate();

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        columnResizeMode: "onChange",
    });

    return (
        <div className="data-table-container">
            <div className="totalstudytext">총 검사 수 : {cnt}</div>

            {/* 테이블 스크롤 영역 */}
            <div
                className="table-scroll-wrapper"
            >
                <table className="data-table">
                    <colgroup>
                        {table.getAllColumns().map((column) => (
                            <col key={column.id} style={{ width: column.columnDef.size }} />
                        ))}
                    </colgroup>
                    <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(header.column.columnDef.header, header.getContext())}
                                </th>
                            ))}
                        </tr>
                    ))}
                    </thead>
                    <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <tr
                            key={row.id}
                            onClick={() => onRecordSearch(row.original.pid, row.original.studykey)}
                            onDoubleClick={() => navigate(`/view/${row.original.studykey}`)}
                        >
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
