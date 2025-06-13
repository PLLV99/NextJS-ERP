'use client'

import { useState, useEffect } from "react"
import Modal from "../components/Modal";
import axios from "axios";
import Swal from "sweetalert2";
import { MaterialInterface } from "@/app/interface/MaterialInterface";
import { Config } from "@/app/Config";

export default function MaterialPage() {
    // State for all materials
    const [materials, setMaterials] = useState<MaterialInterface[]>([])
    // State for modal visibility
    const [showModal, setShowModal] = useState<boolean>(false);
    // State for current editing material id
    const [id, setId] = useState<number>(0);
    // State for material name
    const [name, setName] = useState<string>('');
    // State for unit name
    const [unitName, setUnitName] = useState<string>('');
    // State for quantity
    const [qty, setQty] = useState<number>(0);

    // Fetch materials when component mounts
    useEffect(() => {
        fetchData();
    }, []);

    // Fetch all materials from backend
    const fetchData = async () => {
        try {
            const url = Config.apiUrl + '/api/materials'
            const response = await axios.get(url);

            if (response.status == 200) {
                setMaterials(response.data);
            }
        } catch (err: any) {
            Swal.fire({
                title: 'Error',
                text: err,
                icon: 'error'
            })
        }
    }

    // Save (add or edit) material
    const handleSave = async () => {
        try {
            let url = Config.apiUrl + '/api/materials'
            const payload = {
                name: name,
                unitName: unitName,
                qty: qty
            }
            let status = 0;

            if (id > 0) {
                // Edit existing material
                url = Config.apiUrl + '/api/materials/' + id;
                const response = await axios.put(url, payload)
                status = response.status;
                setId(0);
            } else {
                // Add new material
                const response = await axios.post(url, payload);
                status = response.status;
            }

            if (status == 200) {
                fetchData();
                setShowModal(false);
                Swal.fire({
                    title: 'Success',
                    text: 'Material saved successfully!',
                    icon: 'success',
                    timer: 1000
                })
            }
        } catch (err: any) {
            Swal.fire(
                {
                    title: 'Error',
                    text: err,
                    icon: 'error'
                })
        }
    }

    // Prepare data for editing
    const handleEdit = (id: number) => {
        const material = materials.find(m => m.id === id);

        if (material) {
            setId(material.id);
            setName(material.name);
            setUnitName(material.unitName);
            setQty(material.qty);
            setShowModal(true);
        }
    }

    // Delete material
    const handleDelete = async (id: number) => {
        try {
            const confirm = await Swal.fire({
                title: 'Are you sure?',
                text: 'Do you want to delete this material?',
                icon: 'warning',
                showCancelButton: true,
                showConfirmButton: true,
                confirmButtonText: 'Delete',
                cancelButtonText: 'Cancel'
            })
            if (confirm.isConfirmed) {
                const url = Config.apiUrl + '/api/materials/' + id;
                const response = await axios.delete(url);
                if (response.status == 200) {
                    fetchData();
                }
            }
        } catch (err: any) {
            Swal.fire({
                title: 'Error',
                text: err,
                icon: 'error'
            })
        }
    }

    // Render UI
    return (
        <div>
            {/* Page title */}
            <h1 className="text-2xl font-bold mb-5">Materials</h1>
            {/* Add material button */}
            <button onClick={() => {
                setShowModal(true);
                setName('');
                setUnitName('');
                setQty(0);
                setId(0);
            }} className="button">
                <i className="fa fa-plus mr-2"></i>
                Add Material
            </button>
            {/* Materials table */}
            <div className="table-container mt-5">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th className="w-[120px]">Unit</th>
                            <th className="w-[120px]">Quantity</th>
                            <th className="w-[120px]"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {materials.map(material => (
                            <tr key={material.id}>
                                <td>{material.name}</td>
                                <td>{material.unitName}</td>
                                <td>{material.qty}</td>
                                <td className="flex gap-2">
                                    {/* Edit button */}
                                    <button onClick={() => handleEdit(material.id)}
                                        className="table-edit-btn table-action-btn">
                                        <i className="fa fa-pencil"></i>
                                    </button>
                                    {/* Delete button */}
                                    <button onClick={() => handleDelete(material.id)}
                                        className="table-delete-btn table-action-btn">
                                        <i className="fa fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Modal for add/edit material */}
            {showModal && (
                <Modal title="Material" onClose={() => setShowModal(false)}>
                    <div className="flex flex-col gap-2">
                        <div>
                            <label>Material Name</label>
                            <input type="text" value={name}
                                onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div>
                            <label>Unit</label>
                            <input type="text" value={unitName}
                                onChange={(e) => setUnitName(e.target.value)} />
                        </div>
                        <div>
                            <label>Quantity</label>
                            <input type="text" value={qty}
                                onChange={(e) => setQty(Number(e.target.value || 0))} />
                        </div>
                        <div className="flex justify-end gap-2">
                            {/* Cancel button */}
                            <button type="button" onClick={() => setShowModal(false)}
                                className="modal-btn modal-btn-cancel">
                                <i className="fas fa-times mr-2"></i>
                                Cancel
                            </button>
                            {/* Save button */}
                            <button type="submit" onClick={handleSave}
                                className="modal-btn modal-btn-submit">
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