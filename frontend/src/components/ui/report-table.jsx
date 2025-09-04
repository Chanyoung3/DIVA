import React from "react";
import { useNavigate } from "react-router-dom";
import {flexRender, getCoreRowModel, useReactTable,} from "@tanstack/react-table";

export function ReportTable({ columns, data }) {
    const navigate = useNavigate();

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="data-table-container">
            <div className="pid-info">
                <span className="pidtext">환자 ID : {data[0]?.pid || ""}</span>
                <span className="pidnametext">환자 이름 : {data[0]?.pname || ""}</span>
            </div>
            <table className="data-table">
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
                    <tr key={row.id}
                        onDoubleClick={() =>  navigate(`/view/${row.original.studykey}`)}>
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
    );
}
