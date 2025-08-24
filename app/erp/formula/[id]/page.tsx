'use client'

import { useState, useEffect, useCallback } from "react"
import { FormulaInterface } from "@/interface/FormulaInterface"
import { ProductionInterface } from "@/interface/ProductionInterface"
import axios from "axios"
import Swal from "sweetalert2"
import { Config } from "@/Config"
import { useParams } from "next/navigation"
import Modal from "../../components/Modal"
import { MaterialInterface } from "@/interface/MaterialInterface"

export default function Formula() {
    const [formulas, setFormulas] = useState<FormulaInterface[]>([]);
    const [production, setProduction] = useState<ProductionInterface | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [materials, setMaterials] = useState<MaterialInterface[]>([]);
    const [materialId, setMaterialId] = useState<number>(0);
    const [qty, setQty] = useState<number>(0);
    const [unit, setUnit] = useState<string>('');
    const { id } = useParams();

    const fetchProduction = useCallback(async () => {
        try {
            const url = Config.apiUrl + '/api/productions/' + id;
            const response = await axios.get(url);

            if (response.status == 200) {
                setProduction(response.data);
            }

        } catch (err: unknown) {
            let message = 'Unknown error';
            if (err instanceof Error) {
                message = err.message;
            } else if (typeof err === 'string') {
                message = err;
            }
            Swal.fire({
                title: 'error',
                text: message,
                icon: 'error'
            })
        }
    }, [id]);

    const fetchMaterials = useCallback(async () => {
        try {
            const url = Config.apiUrl + '/api/materials';
            const response = await axios.get(url);

            if (response.status == 200) {
                setMaterials(response.data);
                setMaterialId(response.data[0].id);
            }

        } catch (err: unknown) {
            let message = 'Unknown error';
            if (err instanceof Error) {
                message = err.message;
            } else if (typeof err === 'string') {
                message = err;
            }
            Swal.fire({
                title: 'error',
                text: message,
                icon: 'error'
            })
        }
    }, []);

    const fetchFormulas = useCallback(async () => {
        try {
            const url = Config.apiUrl + '/api/formulas/' + id;
            const response = await axios.get(url);

            if (response.status == 200) {
                setFormulas(response.data);
            }

        } catch (err: unknown) {
            let message = 'Unknown error';
            if (err instanceof Error) {
                message = err.message;
            } else if (typeof err === 'string') {
                message = err;
            }
            Swal.fire({
                title: 'error',
                text: message,
                icon: 'error'
            })
        }
    }, [id]);

    useEffect(() => {
        fetchProduction();
        fetchMaterials();
        fetchFormulas();
    }, [fetchProduction, fetchMaterials, fetchFormulas])

    const openModal = () => {
        setShowModal(true);
    }

    const closeModal = () => {
        setShowModal(false);

        setQty(0);
        setUnit('');
    }

    const handleSave = async () => {
        try {
            const url = Config.apiUrl + '/api/formulas'
            const payload = {
                production: {
                    id: production?.id
                }, //ใส่ ? เพื่อป้องกัน error ถ้า production ยังไม่มีข้อมูล (null/undefined)
                material: {
                    id: materialId
                },
                qty: qty,
                unit: unit
            }
            const response = await axios.post(url, payload);

            if (response.status == 200) {
                closeModal();
                fetchFormulas();
            }
        } catch (err: unknown) {
            let message = 'Unknown error';
            if (err instanceof Error) {
                message = err.message;
            } else if (typeof err === 'string') {
                message = err;
            }
            Swal.fire({
                title: 'error',
                text: message,
                icon: 'error'
            })
        }
    }

    const handleDelete = async (id: number) => {
        try {
            const confirm = await Swal.fire({
                title: 'Delete',
                text: 'Are you sure you want to delete?',
                icon: 'question',
                showCancelButton: true,
                showConfirmButton: true
            })

            if (confirm.isConfirmed) {
                const url = Config.apiUrl + '/api/formulas/' + id;
                const response = await axios.delete(url);

                if (response.status == 200) {
                    fetchFormulas();
                }
            }

        } catch (err: unknown) {
            let message = 'Unknown error';
            if (err instanceof Error) {
                message = err.message;
            } else if (typeof err === 'string') {
                message = err;
            }
            Swal.fire({
                title: 'error',
                text: message,
                icon: 'error'
            })
        }
    }

    return (
        <div>
            <h1 className="text-2xl font-bold">Bill of Materials: {production?.name}</h1>
            <div className="flex flex-col gap-2 mt-3">
                <div>
                    <button className="button-add" onClick={openModal}>
                        <i className="fas fa-plus mr-2"></i>
                        Add material
                    </button>
                </div>

                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Material</th>
                                <th className="w-[100px] style={{textAlign:'right'}}">Quantity</th>
                                <th className="w-[100px]">Unit</th>
                                <th className="w-[50px]"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {formulas.map((formula) => (
                                <tr key={formula.id}>
                                    <td>{formula.material.name}</td>
                                    <td className="text-right">{formula.qty}</td>
                                    <td>{formula.unit}</td>
                                    <td className="text-center">
                                        <button className="table-action-btn table-delete-btn"
                                            onClick={() => handleDelete(formula.id)}>
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {showModal && (
                    <Modal title="Add material" onClose={closeModal}>
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-1">
                                <label htmlFor="material">Material</label>
                                <select id="material" value={materialId} className="input-field"
                                    onChange={(e) => setMaterialId(Number(e.target.value))}>
                                    {materials.map((material) => (
                                        <option key={material.id} value={material.id}>
                                            {material.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label htmlFor="qty">Quantity</label>
                                <input type="text" id="qty" value={qty} className="input-field"
                                    onChange={(e) => setQty(Number(e.target.value))} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label htmlFor="unit">Unit</label>
                                <input type="unit" id="unit" value={unit} className="input-field"
                                    onChange={(e) => setUnit(e.target.value)} />
                            </div>
                            <div className="flex justify-end">
                                <button className="modal-btn modal-btn-submit" onClick={handleSave}>
                                    <i className="fa fa-check mr-2"></i>
                                    Save
                                </button>
                            </div>
                        </div>
                    </Modal>
                )}
            </div>
        </div>
    )
} 