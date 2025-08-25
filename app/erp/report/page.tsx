'use client';

import { Config } from "@/Config";
import { ReportIncomePerMonthInterface } from "@/interface/ReportIncomePerMonthInterface";
import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import Swal from "sweetalert2";

export default function ReportPage() {
    const [report, setReport] = useState<ReportIncomePerMonthInterface[]>([]);
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [arrYear, setArrYear] = useState<number[]>([]);

    const fetchData = useCallback(async () => {
        try { 
            const url = Config.apiUrl + '/report/sum-income-per-month/' + year;
            const response = await axios.get(url);

            if (response.status === 200) {
                setReport(response.data);
            } else {
                Swal.fire({
                    text: "Failed to fetch data",
                    icon: "error"
                });
            }
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: (error as Error).message,
                icon: "error"
            });
        }
    }, [year]); 

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

    useEffect(() => {
        // This effect runs only once to populate the year dropdown
        setArrYear(fetchArrYear());
    }, []);

    useEffect(() => {
        // This effect runs whenever the 'year' or 'fetchData' function changes
        fetchData();
    }, [year, fetchData]); 

    return (
        <div className="container mx-auto p-4"> 
            <h1 className="text-2xl font-bold">Monthly Sales Report</h1>
            <div className="flex items-center gap-2 mt-5"> 
                <label htmlFor="year-select">Year</label>
                <select id="year-select" className="input-field" value={year} onChange={(e) => setYear(Number(e.target.value))}>
                    {arrYear.map((item) => (
                        <option key={item} value={item}>{item}</option>
                    ))}
                </select>
            </div>
            <div className="table-container mt-4"> 
                <table className="table">
                    <thead>
                        <tr>
                            <th>Month</th>
                            <th className="text-right">Sales Amount</th> 
                        </tr>
                    </thead>
                    <tbody>
                        {report.length > 0 ? (
                            report.map((item) => (
                                <tr key={item.month}>
                                    
                                    <td>{new Date(year, item.month - 1).toLocaleString('default', { month: 'long' })}</td>
                                    <td className="text-right">
                                        {item.income.toLocaleString("en-US", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        })}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={2} className="text-center py-4 text-gray-500"> 
                                    No data available for this year.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}