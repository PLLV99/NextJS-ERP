'use client';

import { Config } from "@/Config";
import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import Swal from "sweetalert2";


export default function DashboardPage() {
    const [sumQty, setSumQty] = useState(0);
    const [sumIncome, setSumIncome] = useState(0);
    const [totalProduct, setTotalProduct] = useState(0);
    const [sumLoss, setSumLoss] = useState(0);

    const fetchData = useCallback(async () => {
        try {
            const url = Config.apiUrl + '/api/report/dashboard';
            const response = await axios.get(url);

            if (response.status === 200) {
                const data = response.data;
                setSumQty(data.sumQty);
                setSumIncome(data.sumIncome);
                setTotalProduct(data.totalProduct);
                setSumLoss(data.sumLoss)
            }
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: (error as Error).message,
                icon: 'error',
            })
        }
    }, []);


    useEffect(() => {
        fetchData();
    }, [fetchData])

    return (
        <div>
            <div className="text-2xl font-bold mb-2">Dashboard</div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-end"> 
                <div className="flex flex-col gap-2 bg-blue-500 text-white rounded-lg p-4"> 
                    <div className="text-lg">Production Quantity</div> 
                    <div className="text-3xl font-bold">{sumQty.toLocaleString()}</div> 
                </div>
                <div className="flex flex-col gap-2 bg-green-700 text-white rounded-lg p-4">
                    <div className="text-lg">Sales Revenue</div>
                    <div className="text-3xl font-bold">${sumIncome.toLocaleString()}</div>
                </div>
                <div className="flex flex-col gap-2 bg-yellow-600 text-white rounded-lg p-4">
                    <div className="text-lg">Number of Products</div>
                    <div className="text-3xl font-bold">{totalProduct.toLocaleString()}</div>
                </div>
                <div className="flex flex-col gap-2 bg-red-500 text-white rounded-lg p-4">
                    <div className="text-lg">Loss Quantity</div>
                    <div className="text-3xl font-bold">{sumLoss.toLocaleString()}</div>
                </div>
            </div>
        </div>
    );
}