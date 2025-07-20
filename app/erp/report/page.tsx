'use client';

import { Config } from "@/app/Config";
import { ReportIncomePerMonthInterface } from "@/app/interface/ReportIncomePerMonthInterface";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";







export default function ReportPage() {
    const [report, setReport] = useState<ReportIncomePerMonthInterface[]>([]);
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [arrYear, setArrYear] = useState<number[]>([]);

    useEffect(() => {
        fetchData();
        setArrYear(fetchArrYear());
    }, []);

    useEffect(() => {
        fetchData();
    }, [year]);


    const fetchData = async () => {
        const url = Config.apiUrl + '/api/report/sum-income-per-month/' + year;
        const response = await axios.get(url);

        if (response.status === 200) {
            setReport(response.data);
        } else {
            Swal.fire({
                text: "Failed to fetch data",
                icon: "error"
            });
        }
    }
    // Function to generate an array of years from the current year to 5 years ago
    const fetchArrYear = () => {
        const currentYear = new Date().getFullYear();
        const lastYear = currentYear - 5;
        const arrYear = [];
        // Loop from current year to last year and push each year into the array
        for (let i = currentYear; i >= lastYear; i--) {
            arrYear.push(i);
        }

        return arrYear;
    }


    return (
        <div className="container mx-auto">
            <h1 className="text-2xl font-bold">Monthly Sales Report</h1>
            <div className="flex gap-2 mt-5">
                <label >Year</label>
                <select onChange={(e) => setYear(Number(e.target.value))}>
                    {arrYear.map((item) => (
                        <option key={item} value={item}>{item}</option>
                    ))}
                </select>
            </div>
            <div className="table-container mt-2">
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Month</th>
                            <th style={{ textAlign: "right" }}>Sales Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {report.map((item) => (
                            <tr key={item.month}>
                                <td className="text-right">
                                    {item.income.toLocaleString("en-US", {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    })}
                                </td>
                            </tr>
                        ))}
                        {report.length === 0 && (
                            <tr>
                                <td colSpan={2} className="text-center py-4 text-red-500">
                                    No data available for this year.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}