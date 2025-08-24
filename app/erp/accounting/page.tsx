'use client'

import { ErrorInterface } from "@/app/interface/ErrorInterface";
import { ProductionInterface } from "../../interface/ProductionInterface";
import { useEffect, useState, useCallback } from "react"
import Swal from "sweetalert2";
import Modal from "../components/Modal";
import { Config } from "@/app/Config";
import axios from "axios";

export default function AccountingPage() {
    const [productions, setProductions] = useState<ProductionInterface[]>([]);
    const [id, setId] = useState<number>(0);
    const [price, setPrice] = useState<number>(0);
    const [name, setName] = useState<string>('');
    const [showModal, setShowModal] = useState<boolean>(false)

    const fetchProductions = useCallback(async () => {
        try {
            const url = `${Config.apiUrl}/api/productions`;
            const response = await axios.get(url);

            if (response.status === 200) {
                setProductions(response.data);
            }
        } catch (err: unknown) {
            Swal.fire({
                title: 'Error',
                text: (err as ErrorInterface).message,
                icon: 'error'
            });
        }
    }, []);

    useEffect(() => {
        fetchProductions();
    }, [fetchProductions]);

    const handleUpdatePrice = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const payload = { price };
            const url = `${Config.apiUrl}/api/productions/updatePrice/${id}`;
            const response = await axios.put(url, payload);

            if (response.status === 200) {
                fetchProductions();
                closeModal();
            }
        }
        catch (err: unknown) {
            Swal.fire({
                title: 'error',
                text: (err as ErrorInterface).message,
                icon: 'error'
            })
        }
    }

    const handleChangePrice = (value: string) => {
        if (value !== null) {
            setPrice(parseFloat(value));
        }
    }

    const openModal = (id: number) => {
        const production = productions.find(item => item.id === id);
        if (production) {
            setId(id);
            setPrice(production.price);
            setName(production.name);
            setShowModal(true);
        }
    }

    const closeModal = () => {
        setShowModal(false);
    }

    return (
        <>
            <div className="text-xl font-bold mb-4">Accounting</div>
            <section>
                <h2 className="text-lg font-semibold">Product Pricing</h2>

                <div className="table-container mt-4">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Product Name</th>
                                <th className="w-[100px] text-right">Price</th>
                                <th className="w-[140px] text-center">Edit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productions.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.name}</td>
                                    <td className="text-right">{item.price ?? 0}</td>
                                    <td className="flex justify-center">
                                        <button
                                            className="table-edit-btn table-action-btn"
                                            onClick={() => openModal(item.id)}>
                                            <i className="fa fa-pencil" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {showModal && (
                <Modal title="Set Selling Price" onClose={closeModal}>
                    <form className="flex flex-col gap-4" onSubmit={handleUpdatePrice}>
                        <div>
                            <label className="block text-sm font-medium mb-1">Product Name</label>
                            <input value={name} disabled className="input-field input-disabled w-full" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Selling Price</label>
                            <input type="number"
                                value={price ?? 0}
                                onChange={(e) => handleChangePrice(e.target.value)}
                                className="input-field w-full"
                            />
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="modal-btn modal-btn-cancel"
                            >
                                <i className="fas fa-times mr-2" />
                                Cancel
                            </button>
                            <button type="submit" className="modal-btn modal-btn-submit">
                                <i className="fas fa-check mr-2" />
                                Save
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </>
    );
}