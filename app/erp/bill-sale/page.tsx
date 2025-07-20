'use client'

import { Config } from "@/app/Config";
import { BillSaleInterface } from "@/app/interface/BillSaleInterface";
import axios from "axios";
import { useEffect, useState } from "react"
import Swal from "sweetalert2";



export default function BillSalePage() {
    const [billSale, setBillSale] = useState<BillSaleInterface[]>([]);

    useEffect(() => {
        fetchData();
    }, []);


    const fetchData = async () => {
        try {
            const url = Config.apiUrl + '/api/report/bill-sales';
            const response = await axios.get(url);

            if (response.status === 200) {
                setBillSale(response.data);
            }

        } catch (err) {
            Swal.fire({
                title: "Error",
                icon: "error",
                text: (err as Error).message
            })

        }
    }
    return (
        <div>
            <h1>Sales Invoices</h1>
            <div className="table-container">
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Status</th>
                            <th>Invoice No.</th>
                            <th>Date</th>
                            <th>Total Amount</th>
                            <th className="w-[80px]"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {billSale.map((billSale) => (
                            <tr key={billSale.id}>
                                <td>
                                    {billSale.status === 'paid' ? (
                                        <div className="bg-green-600 text-white px-2 py-1 rounded-xl text-center">
                                            <i></i>
                                            Paid
                                        </div>
                                    ) : (
                                        <div className="bg-red-600 text-white px-2 py-1 rounded-xl text-center">
                                            <i className="fa fa-times mr-2"></i>
                                            Void
                                        </div>
                                    )}
                                </td>
                                <td>{billSale.id}</td>
                                <td>{(new Date(billSale.createdAt)).toLocaleDateString()}</td>
                                <td>{billSale.total.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )


}