'use client'

import { Config } from "@/app/Config";
import Modal from "@/app/erp/components/Modal"
import { ProductionInterface } from "@/app/interface/ProductionInterface";
import { ProductionLossInterface } from "@/app/interface/ProductionLossInterface";
import axios from "axios";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";


export default function ProductionLoss() {
    const [production, setProduction] = useState<ProductionInterface | null>(null);
    const [productionLoss, setProductionLoss] = useState<ProductionLossInterface[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [remark, setRemark] = useState('');
    const [qty, setQty] = useState(0);
    const [createdAt, setCreatedAt] = useState(new Date());
    const [productionLossId, setProductionLossId] = useState(0);
    const { id } = useParams();
    const router = useRouter();

    useEffect(() => {
        fetchProduction();
        fetchProductionLoss();
    }, []);

    const fetchProductionLoss = async () => {
        const url = Config.apiUrl + '/api/production-loss/' + id;

        try {
            const response = await axios.get(url);
            setProductionLoss(response.data);
        } catch (error: any) {
            Swal.fire({
                title: 'Error',
                text: (error as Error).message,
                icon: 'error'
            })

        }
    }

    const fetchProduction = async () => {
        const url = Config.apiUrl + '/api/productions/' + id;
        try {
            const response = await axios.get(url);
            if (response.status === 200) {
                setProduction(response.data);
            }
        } catch (error: any) {
            Swal.fire({
                title: 'error',
                icon: 'error',
                text: error.message
            })
        }
    }

    const openModal = () => {
        setShowModal(true);
    }

    const closeModal = () => {
        setShowModal(false);
        setCreatedAt(new Date());
        setQty(0);
        setRemark('');
        setProductionLossId(0);
    }

    const handleSave = async () => {
        let url = Config.apiUrl + '/api/production-loss';

        try {
            const payload = {
                createdAt: createdAt.toISOString(),
                qty: qty,
                remark: remark,
                production: {
                    id: id
                }
            }

            let status;

            if (productionLossId > 0) {
                const response = await axios.put(url + '/' + productionLossId, payload);
                status = response.status;
                setProductionLossId(0);
            } else {
                const response = await axios.post(url, payload);
                status = response.status;
            }

            if (status === 200) {
                closeModal();
                fetchProductionLoss();
            }

        } catch (error: any) {
            Swal.fire({
                title: 'error',
                icon: 'error',
                text: error.message
            })
        }
    }

    const handleDelete = async (id: number) => {
        const confirm = await Swal.fire({
            title: 'Are you sure?',
            icon: 'warning',
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonColor: '#b91c1c',  // red-700
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel'
        });

        if (confirm.isConfirmed) {
            const url = Config.apiUrl + '/api/production-loss/' + id;
            try {
                const response = await axios.delete(url);
                if (response.status === 200) {
                    Swal.fire({
                        title: 'Deleted',
                        text: 'Production loss record has been deleted.',
                        icon: 'success'
                    });
                    fetchProductionLoss();
                }
            } catch (error: any) {
                Swal.fire({
                    title: 'Error',
                    text: error.message,
                    icon: 'error'
                });
            }
        }
    }

    const handleEdit = (productionLoss: ProductionLossInterface) => {
        setShowModal(true);
        setCreatedAt(new Date(productionLoss.createdAt));
        setQty(productionLoss.qty);
        setRemark(productionLoss.remark);
        setProductionLossId(productionLoss.id);
    }
    return (
        <div>
            <div className="mb-4">
                <button
                    className="button-back"
                    onClick={() => router.push('/erp/production')}
                >
                    <i className="fa fa-arrow-left mr-2"></i>
                    Back
                </button>
            </div>
            <h1>Production Loss: {production?.name}</h1>
            <div className="flex flex-col mt-3 gap-3">
                <div>
                    <button className="button-add" onClick={openModal}>
                        <i className="fa-solid fa-plus mr-2"></i>
                        Add Record
                    </button>
                </div>

                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th style={{ textAlign: 'right' }}>Quantity</th>
                                <th>Remark</th>
                                <th className="w-[120px]"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {productionLoss.map((productionLoss) => (
                                <tr key={productionLoss.id}>
                                    <td>{new Date(productionLoss.createdAt).toLocaleDateString()}</td>
                                    <td className="text-right">{productionLoss.qty}</td>
                                    <td>{productionLoss.remark}</td>
                                    <td className="flex gap-2 justify-center">
                                        <button onClick={() => handleEdit(productionLoss)}
                                            className="table-edit-btn table-action-btn">
                                            <i className="fa fa-pencil"></i>
                                        </button>
                                        <button onClick={() => handleDelete(productionLoss.id)}
                                            className="table-delete-btn table-action-btn">
                                            <i className="fa fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </div>
            </div>

            {showModal && (
                <Modal title="Production Loss Entry" onClose={closeModal}>
                    <div className="flex flex-col gap-3">
                        <div>
                            <label>Date</label>
                            <input type="date"
                                value={createdAt.toISOString().split('T')[0]}
                                onChange={(e) => setCreatedAt(new Date(e.target.value))}
                            />
                        </div>
                        <div>
                            <label>Quantity</label>
                            <input type="text"
                                value={qty}
                                onChange={(e) => setQty(Number(e.target.value))} />
                        </div>
                        <div>
                            <label>Remark</label>
                            <input type="text"
                                value={remark}
                                onChange={(e) => setRemark(e.target.value)} />
                        </div>
                        <div className="flex justify-end gap-2">
                            <button type="button" onClick={closeModal} className="modal-btn modal-btn-cancel">
                                <i className="fas fa-times mr-2"></i>
                                Cancel
                            </button>
                            <button type="submit" onClick={handleSave} className="modal-btn modal-btn-submit">
                                <i className="fas fa-check mr-2"></i>
                                Save
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    )
}