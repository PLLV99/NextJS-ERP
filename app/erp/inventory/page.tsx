'use client'
import React, { useEffect, useState } from "react"
import Modal from "../components/Modal"
import { Config } from "@/app/Config";
import Swal from "sweetalert2";
import axios from "axios";
import { StoreInterface } from "@/app/interface/StoreInterface";
import { ProductionInterface } from "@/app/interface/ProductionInterface";



export default function InventoryPage() {
    const [stores, setStores] = useState<StoreInterface[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [id, setId] = useState<number>(0);
    const [name, setName] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [remark, setRemark] = useState<string>('');
    const [productions, setProductions] = useState<ProductionInterface[]>([]);
    const [productionId, setProductionId] = useState<number>(0);


    useEffect(() => {
        fetchStores();
    }, [])

    const fetchStores = async () => {
        const url = Config.apiUrl + '/api/store';
        try {
            const response = await axios.get(url);
            if (response.status === 200) {
                setStores(response.data);
            }
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Failed to fetch stores'
            })

        }
    }

    const openModal = () => {
        setShowModal(true);
    }

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const data = {
                name: name,
                address: address,
                remark: remark
            }
            let status = 0;
            let url = Config.apiUrl + '/api/store';
            if (id > 0) {
                // Update existing store
                url += `/${id}`; // url = url + '/' + id;
                const response = await axios.put(url, data);
                status = response.status;
                setId(0);
            } else {
                const response = await axios.post(url, data);
                status = response.status;
            }

            if (status === 200) {
                setShowModal(false);
                fetchStores();
            }

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: (error as Error).message || 'Failed to save store'
            })
        }
    }

    const handleDelete = async (id: number) => {
        const button = await Swal.fire({
            title: 'Delete Confirmation',
            text: 'Are you sure you want to delete this record?',
            icon: 'question',
            showCancelButton: true,
            showConfirmButton: true
        });
        if (button.isConfirmed) {
            const url = Config.apiUrl + '/api/store/' + id;
            try {
                const response = await axios.delete(url);
                if (response.status === 200) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'Record deleted successfully'
                    });
                    fetchStores();
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: (error as Error).message || 'Failed to delete record'
                });
            }
        }
    }

    const handleEdit = (store: StoreInterface) => {
        setId(store.id);
        setName(store.name);
        setAddress(store.address);
        setRemark(store.remark);
        setShowModal(true);
    }


    return (
        <div>
            <h1 className="text-2xl font-bold">Inventory</h1>
            <div className="flex flex-col gap-2 mt-3">
                <div className="flex gap-2">
                    <button className="button-add" onClick={openModal}>
                        <i className="fa-solid fa-plus me-2"></i>
                        Add Inventory
                    </button>
                    {/* <button className="button-add" onClick={openModalHistoryTransfer}>
                        <i className="fa-solid fa-exchange-alt me-2"></i>
                        Transfer History
                    </button> */}
                </div>

                <div className="table-container mt-3">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Inventory Name</th>
                                <th>Address</th>
                                <th>Remark</th>
                                <th className="w-[120px]"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {stores.map((store) => (
                                <tr key={store.id}>
                                    <td>{store.name}</td>
                                    <td>{store.address}</td>
                                    <td>{store.remark}</td>
                                    <td>
                                        <div className="flex gap-1 justify-center">
                                            {/* <button className="table-edit-btn table-action-btn"
                                                onClick={() => openModalTransfer(store.name, store.id)}>
                                                <i className="fa fa-exchange-alt mr-2"></i>
                                                Transfer
                                            </button>
                                            <button onClick={() => openModalImport(store.id)}
                                                className="table-edit-btn table-action-btn">
                                                <i className="fa fa-plus mr-2"></i>
                                                Import
                                            </button>
                                            <button className="table-edit-btn table-action-btn"
                                                onClick={() => openModalHistory(store.id)}>
                                                <i className="fa fa-history mr-2"></i>
                                                Import History
                                            </button> */}
                                            <button onClick={() => handleEdit(store)}
                                                className="table-edit-btn table-action-btn">
                                                <i className="fa fa-pencil"></i>
                                            </button>
                                            <button onClick={() => handleDelete(store.id)}
                                                className="table-delete-btn table-action-btn">
                                                <i className="fa fa-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {showModal && (
                    <Modal title='Add Inventory' onClose={() => setShowModal(false)}>
                        <form onSubmit={(e) => handleSave(e)}>
                            <div className="flex flex-col gap-2">
                                <div>
                                    <label>Inventory Name</label>
                                    <input type="text" className="input-field" value={name}
                                        onChange={(e) => setName(e.target.value)} />
                                </div>

                                <div>
                                    <label>Address</label>
                                    <input type="text" className="input-field" value={address}
                                        onChange={(e) => setAddress(e.target.value)} />
                                </div>

                                <div>
                                    <label>Remark</label>
                                    <input type="text" className="input-field" value={remark}
                                        onChange={(e) => setRemark(e.target.value)} />
                                </div>

                                <div className="flex justify-end gap-2">
                                    <button type="button" onClick={() => setShowModal(false)}
                                        className="modal-btn modal-btn-cancel">
                                        <i className="fas fa-times mr-2"></i>
                                        Cancel
                                    </button>
                                    <button type="submit" className="modal-btn modal-btn-submit">
                                        <i className="fas fa-check mr-2"></i>
                                        Save
                                    </button>
                                </div>
                            </div>
                        </form>
                    </Modal>
                )}

                {/* {showModalImport && (
                    <Modal title='Import to Inventory' onClose={closeModalImport}>
                        <form onSubmit={(e) => handleImport(e)}>
                            <div className="flex flex-col gap-2">
                                <div>
                                    <label>Product</label>
                                    <select className="input-field" value={productionId}
                                        onChange={(e) => changeProduction(Number(e.target.value))}>
                                        {productions.map((production) => (
                                            <option key={production.id} value={production.id}>
                                                {production.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label>Total Produced</label>
                                    <input type="number" value={totalProductionLog} className="input-field" readOnly disabled />
                                </div>

                                <div>
                                    <label>Loss</label>
                                    <input type="number" value={totalProductionLoss} className="input-field" readOnly disabled />
                                </div>

                                <div>
                                    <label>Available</label>
                                    <input type="number" value={totalProductionFree} className="input-field" readOnly disabled />
                                </div>

                                <div>
                                    <label>Import Quantity</label>
                                    <input type="number" className="input-field"
                                        value={qtyImport}
                                        onChange={(e) => setQtyImport(Number(e.target.value))} />
                                </div>

                                <div>
                                    <label>Remark</label>
                                    <input type="text" className="input-field" value={remarkImport}
                                        onChange={(e) => setRemarkImport(e.target.value)} />
                                </div>

                                <div className="flex justify-end gap-2">
                                    <button type="button" className="modal-btn modal-btn-cancel"
                                        onClick={closeModalImport}>
                                        <i className="fas fa-times mr-2"></i>
                                        Cancel
                                    </button>
                                    <button type="submit" className="modal-btn modal-btn-submit">
                                        <i className="fas fa-check mr-2"></i>
                                        Save
                                    </button>
                                </div>
                            </div>
                        </form>
                    </Modal>
                )}

                {showModalHistory && (
                    <Modal title='Import History' onClose={closeModalHistory} size="2xl">
                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Quantity</th>
                                        <th>Remark</th>
                                        <th>Date</th>
                                        <th className="w-[60px]"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {storeImports.map((storeImport) => (
                                        <tr key={storeImport.id}>
                                            <td>{storeImport.production.name}</td>
                                            <td>{storeImport.qty}</td>
                                            <td>{storeImport.remark}</td>
                                            <td>{new Date(storeImport.importDate).toLocaleDateString()}</td>
                                            <td>
                                                <button onClick={() => handleDeleteImport(storeImport.id, storeImport.store.id)}
                                                    className="table-delete-btn table-action-btn">
                                                    <i className="fa fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Modal>
                )}

                {showModalTransfer && (
                    <Modal title='Transfer Product' onClose={closeModalTransfer} size='xl'>
                        <form className="flex flex-col gap-2"
                            onSubmit={(e) => handleTransferStock(e)}>
                            <div>
                                <label>From</label>
                                <input disabled type="text" value={fromStoreName} />
                            </div>
                            <div>
                                <label>To</label>
                                <select onChange={(e) => setToStoreId(Number(e.target.value))}>
                                    {stores.map((store) => (
                                        <option key={store.id} value={store.id}>
                                            {store.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label>Product</label>
                                <select onChange={(e) => setProductionTransfer(Number(e.target.value))}>
                                    {productions.map((production) => (
                                        <option key={production.id} value={production.id}>
                                            {production.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label>Quantity</label>
                                <input type="number" onChange={(e) => setQtyTransfer(Number(e.target.value))} />
                            </div>
                            <div>
                                <label>Remark</label>
                                <input type="text" onChange={(e) => setRemarkTransfer(e.target.value)} />
                            </div>
                            <div>
                                <label>Transfer Date</label>
                                <input type="date" onChange={(e) => setTransferCreatedAt(new Date(e.target.value))} />
                            </div>
                            <div className="flex justify-end gap-2 mt-3">
                                <button type="button" className="modal-btn modal-btn-cancel"
                                    onClick={closeModalTransfer}>
                                    <i className="fas fa-times mr-2"></i>
                                    Cancel
                                </button>
                                <button type="submit" className="modal-btn modal-btn-submit">
                                    <i className="fas fa-check mr-2"></i>
                                    Save
                                </button>
                            </div>
                        </form>
                    </Modal>
                )}

                {showModalHistoryTransfer && (
                    <Modal title='Transfer History' onClose={closeModalHistoryTransfer} size='3xl'>
                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>From</th>
                                        <th>To</th>
                                        <th>Product</th>
                                        <th>Quantity</th>
                                        <th>Remark</th>
                                        <th>Date</th>
                                        <th className="w-[60px]"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transferStores.map((transferStore) => (
                                        <tr key={transferStore.id}>
                                            <td>{transferStore.fromStore.name}</td>
                                            <td>{transferStore.toStore.name}</td>
                                            <td>{transferStore.production.name}</td>
                                            <td>{transferStore.quantity}</td>
                                            <td>{transferStore.remark}</td>
                                            <td>{new Date(transferStore.createdAt).toLocaleDateString()}</td>
                                            <td>
                                                <button onClick={() => handleDeleteTransfer(transferStore.id)}
                                                    className="table-delete-btn table-action-btn">
                                                    <i className="fa fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Modal>
                )} */}
            </div>
        </div>
    )
}