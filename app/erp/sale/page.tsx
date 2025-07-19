'use client'

import { Config } from "@/app/Config";
import { ProductionInterface } from "@/app/interface/ProductionInterface";
import { SaleTempInterface } from "@/app/interface/SaleTempInterface";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Modal from "../components/Modal";

export default function SalePage() {
    const [total, setTotal] = useState<number>(0);
    const [quantity, setQuantity] = useState<number>(0);
    const [discount, setDiscount] = useState<number>(0);
    const [showModalProductions, setShowModalProductions] = useState<boolean>(false);
    const [productions, setProductions] = useState<ProductionInterface[]>([]);
    const [saleTemps, setSaleTemps] = useState<SaleTempInterface[]>([]);
    const [showModalEndSale, setShowModalEndSale] = useState<boolean>(false);
    const [inputMoney, setInputMoney] = useState<number>(0);
    const [returnMoney, setReturnMoney] = useState<number>(0);

    useEffect(() => {
        fetchProductions();
        fetchDataSaleTemp();
    }, []);


    useEffect(() => {
        let total = 0;
        let sumQuantity = 0;

        for (const saleTemp of saleTemps) {
            total += saleTemp.price * saleTemp.qty;
            sumQuantity += saleTemp.qty;
        }

        setTotal(total);
        setQuantity(sumQuantity);
    }, [saleTemps]);

    // --- API Calls ---
    const fetchProductions = async () => {
        try {
            const url = Config.apiUrl + '/api/productions'
            const response = await axios.get(url)
            if (response.status === 200) {
                setProductions(response.data)
            }
        } catch (error) {
            Swal.fire({
                title: 'error',
                icon: 'error',
                text: 'error : ' + error
            })
        }
    }

    const fetchDataSaleTemp = async () => {
        try {
            const url = Config.apiUrl + '/api/SaleTemp';
            const headers = getHeaders();
            const response = await axios.get(url, { headers });
            if (response.status === 200) {
                setSaleTemps(response.data)
            }
        } catch (error) {
            Swal.fire({
                title: 'error',
                icon: 'error',
                text: 'error : ' + error
            })
        }
    }

    const handleChooseProduction = async (production: ProductionInterface) => {
        try {
            const url = Config.apiUrl + '/api/SaleTemp';
            const payload = {
                production: {
                    id: production.id
                }
            }
            const headers = getHeaders();
            const response = await axios.post(url, payload, { headers })
            if (response.status === 200) {
                fetchDataSaleTemp();
                closeModalProductions();
            }
        } catch (error) {
            Swal.fire({
                title: 'error',
                icon: 'error',
                text: 'error: ' + error
            })
        }
    }

    const handleDeleteSaleTemp = async (id: number) => {
        try {
            const buttonConfirm = await Swal.fire({
                title: 'Delete Confirmation',
                text: 'Are you sure you want to delete?',
                icon: 'question',
                showCancelButton: true,
                showConfirmButton: true
            });

            if (buttonConfirm.isConfirmed) {
                const url = Config.apiUrl + '/api/SaleTemp/' + id;
                const headers = getHeaders();
                const response = await axios.delete(url, { headers })

                if (response.status === 200) {
                    fetchDataSaleTemp();
                }
            }

        } catch (error) {
            Swal.fire({
                title: 'error',
                icon: 'error',
                text: 'error: ' + error
            })
        }
    }

    const handleUpQty = async (id: number) => {
        try {
            const url = Config.apiUrl + '/api/SaleTemp/' + id;
            const saleTemp = saleTemps.find((saleTemp) => saleTemp.id === id);
            if (saleTemp) {
                const payload = {
                    qty: saleTemp.qty + 1
                }
                const response = await axios.put(url, payload);
                if (response.status === 200) fetchDataSaleTemp();
            }
        } catch (error) {
            Swal.fire({
                title: 'error',
                icon: 'error',
                text: 'error: ' + error
            })
        }
    }
    const handleDownQty = async (id: number) => {
        try {
            const url = Config.apiUrl + '/api/SaleTemp/' + id;
            const saleTemp = saleTemps.find((saleTemp) => saleTemp.id === id);
            if (saleTemp && saleTemp?.qty > 1) {
                const payload = {
                    qty: saleTemp.qty - 1
                }
                const response = await axios.put(url, payload);
                if (response.status === 200) fetchDataSaleTemp();
            }
        } catch (error) {
            Swal.fire({
                title: 'error',
                icon: 'error',
                text: 'error: ' + error
            })
        }
    }

    const handleEndSale = async () => {
        const confirmButton = await Swal.fire({
            title: 'Complete this sale?',
            icon: 'question',
            text: 'Make sure the payment has been received',
            showCancelButton: true,
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cancel'
        });

        if (confirmButton.isConfirmed) {
            const url = Config.apiUrl + '/api/SaleTemp/endSale';
            const headers = getHeaders();
            const payload = {
                inputMoney: inputMoney,
                discount: discount,
                total: total
            }
            const response = await axios.post(url, payload, { headers });
            if (response.status === 200) {
                closeModalEndSale();
                fetchDataSaleTemp();
            }
        } else {
            openModalEndSale();
        }

    }

    // --- Modal Controls ---
    const openModalProductions = () => {
        setShowModalProductions(true);
    }
    const closeModalProductions = () => {
        setShowModalProductions(false);
    }
    const openModalEndSale = () => {
        setShowModalEndSale(true);
    }
    const closeModalEndSale = () => {
        setShowModalEndSale(false);
    }

    // --- Input Handles
    const handleChangeInputMoney = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.trim();
        const inputMoneyValue = Number(value);

        if (!isNaN(inputMoneyValue)) {
            setInputMoney(inputMoneyValue);
            setReturnMoney(inputMoneyValue - (total - discount));
        }

    }

    const handleChangeDiscount = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.trim();
        const discountValue = Number(value);

        if (!isNaN(discountValue)) {
            setDiscount(discountValue);
            setReturnMoney(inputMoney - (total - discountValue));
        }
    }

    const handlePayFill = () => {
        setReturnMoney(0);
        setDiscount(0);
        setInputMoney(total);
    }

    //-- Utility
    const getHeaders = () => {
        const headers = {
            'Authorization': 'Bearer ' + localStorage.getItem(Config.tokenKey)
        }
        return headers;
    }
    return (
        <div className="container">
            <h1 className="text-2xl font-bold">Sales</h1>
            <div className="flex justify-end">
                <span className="text-2xl font-bold bg-gray-950 px-4 py-2 rounded-md text-green-300 border border-green-300">
                    {total.toLocaleString('en-Us', { minimumFractionDigits: 2 })}
                </span>
            </div>

            <div className="flex flex-col gap-2">
                <div>
                    <input type="text" placeholder="Enter product code" className="form-input" />
                    <button className="button" onClick={openModalProductions}>
                        <i className="fa-solid fa-search mr-3"></i>
                        Search
                    </button>
                </div>

                <div className="flex justify-end">
                    <button className="button" onClick={openModalEndSale}>
                        <i className="fa-solid fa-check mr-3"></i>
                        Complete Sale
                    </button>
                </div>

                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Product ID</th>
                                <th>Product Name</th>
                                <th>Price</th>
                                <th>Qty</th>
                                <th>Total</th>
                                <th className="w-[60px]">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {saleTemps.map((saleTemp) => (
                                <tr key={saleTemp.id}>
                                    <td>{saleTemp.production.id}</td>
                                    <td>{saleTemp.production.name}</td>
                                    <td>{saleTemp.price.toLocaleString('en-US')}</td>
                                    <td>
                                        <div className="flex gap-2">
                                            <button className="table-edit-btn table-action-btn" onClick={() => handleDownQty(saleTemp.id)}>
                                                <i className="fa-solid fa-minus"></i>
                                            </button>
                                            <span className="font-bold">{saleTemp.qty}</span>
                                            <button className="table-edit-btn table-action-btn" onClick={() => handleUpQty(saleTemp.id)}>
                                                <i className="fa-solid fa-plus"></i>
                                            </button>
                                        </div>
                                    </td>
                                    <td>{(saleTemp.price * saleTemp.qty).toLocaleString()}</td>
                                    <td>
                                        <div className="flex gap-2">
                                            <button className="table-delete-btn table-action-btn" onClick={() => handleDeleteSaleTemp(saleTemp.id)} >
                                                <i className="fa-solid fa-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex gap-3">
                    <span>Total Items:</span>
                    <span className="font-bold">{saleTemps.length}</span>
                    <span>Total Quantity:</span>
                    <span className="font-bold">{quantity}</span>
                </div>
            </div>
            {
                showModalProductions && (
                    <Modal onClose={closeModalProductions} title="Products" size="xl">
                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Select</th>
                                        <th>Product ID</th>
                                        <th>Product Name</th>
                                        <th>Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productions.map((production) => (
                                        <tr key={production.id}>
                                            <td>
                                                <button className="button"
                                                    onClick={() => handleChooseProduction(production)}>
                                                    <i className="fa-solid fa-check mr-2"></i>
                                                    Select
                                                </button>
                                            </td>
                                            <td>{production.id}</td>
                                            <td>{production.name}</td>
                                            <td>{production.price.toLocaleString('en-US')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Modal>)
            }

            {
                showModalEndSale && (
                    <Modal onClose={closeModalEndSale} title="Finalize Sale" size="xl">
                        <div className="flex flex-col gap-2">
                            <div>
                                <div className="text-2xl font-bold text-right mb-2 text-gray-500">
                                    Total Amount
                                </div>
                                <input type="text" disabled value={total.toLocaleString('en-US')}
                                    className="text-right text-4xl font-bold" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-right mb-2 mt-5 text-gray-500">
                                    Amount Received
                                </div>
                                <input type="text" value={inputMoney}
                                    onChange={(e) => handleChangeInputMoney(e)}
                                    className="input-money" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-right mb-2 text-gray-500">
                                    Discount
                                </div>
                                <input type="text"
                                    value={discount}
                                    onChange={(e) => handleChangeDiscount(e)}
                                    className="input-discount" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-right mb-2 text-gray-500">
                                    Change Due
                                </div>
                                <input type="text" disabled value={returnMoney.toLocaleString('en-US')}
                                    className="return-money" />
                            </div>

                            <div className="flex justify-end mt-5 gap-3">
                                <button className="button text-2xl" onClick={handlePayFill}>
                                    <i className="fa-solid fa-check mr-3"></i>
                                    Pay Exact
                                </button>
                                <button className="button text-2xl" onClick={handleEndSale}>
                                    <i className="fa-solid fa-check mr-3"></i>
                                    Confirm Sale
                                </button>
                            </div>
                        </div>
                    </Modal>
                )}
        </div>
    )
}

