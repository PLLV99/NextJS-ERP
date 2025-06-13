'use client';

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Config } from "@/app/Config";
import Swal from "sweetalert2";
import Modal from "../components/Modal";
import { ProductionInterface } from "@/app/interface/ProductionInterface";
import Link from 'next/link';

// This is a React functional component used for managing production data.
export default function Production() {
  // State holds the list of production items fetched from the API.
  const [productions, setProductions] = useState<ProductionInterface[]>([]);
  // State to control the visibility of the modal (pop-up form).
  const [showModal, setShowModal] = useState(false);
  // State that holds the production item being edited. If null, we are adding a new item.
  const [editingProduction, setEditingProduction] = useState<ProductionInterface | null>(null);
  // States for storing input data for the production item (name and detail).
  const [name, setName] = useState('');
  const [detail, setDetail] = useState('');

  // useEffect hook runs once when the component mounts.
  useEffect(() => {
    fetchData();
  }, []);

  // This function fetches production data from the API.
  const fetchData = async () => {
    try {
      // Get the token from local storage.
      const token = localStorage.getItem(Config.tokenKey);
      // Set up the Authorization header.
      const headers = {
        'Authorization': 'Bearer ' + token
      };
      // Make a GET request to the API to get the list of productions.
      const response = await axios.get(`${Config.apiUrl}/api/productions`, { headers });

      // If the request is successful, update the state with the fetched data.
      if (response.status === 200) {
        setProductions(response.data);
      }
    } catch (err: any) {
      // Show an error alert if something goes wrong.
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message
      });
    }
  };

  // Handler to show the modal for adding a new production item.
  const handleAdd = () => {
    // Reset any editing state.
    setEditingProduction(null);
    // Clear the input values.
    setName('');
    setDetail('');
    // Open the modal.
    setShowModal(true);
  };

  // Handler to show the modal for editing an existing production item.
  const handleEdit = (production: ProductionInterface) => {
    // Set the item to be edited.
    setEditingProduction(production);
    // Set the input fields with the existing data.
    setName(production.name);
    setDetail(production.detail);
    // Open the modal.
    setShowModal(true);
  };

  // Handler for deleting a production item.
  const handleDelete = async (production: ProductionInterface) => {
    try {
      // Ask for confirmation with a SweetAlert2 prompt.
      const result = await Swal.fire({
        icon: 'question',
        title: 'Delete',
        text: 'Are you sure you want to delete?',
        showCancelButton: true,
        showConfirmButton: true
      });

      // If the user confirms deletion, proceed.
      if (result.isConfirmed) {
        // Retrieve the token from local storage.
        const token = localStorage.getItem(Config.tokenKey);
        // Make a DELETE request to the API using the production item's id.
        await axios.delete(`${Config.apiUrl}/api/productions/${production.id}`, {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        });

        // Refresh the production list after deletion.
        fetchData();
        // Show a success alert.
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Deleted Successfully',
          timer: 1000
        });
      }
    } catch (err) {
      // Show an error alert if deletion fails.
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Unable to delete data: ' + err
      });
    }
  };

  // Handler for form submission (both add and edit)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // Prevent the default form submission behavior.
    e.preventDefault();

    try {
      // Retrieve the token from local storage.
      const token = localStorage.getItem(Config.tokenKey);
      // Build an object with the production data from the form.
      const data = {
        name: name,
        detail: detail
      };
      // Set up the request headers with the Authorization.
      const headers = {
        'Authorization': 'Bearer ' + token
      };

      if (editingProduction) {
        // If editingProduction is set, update the production item using PUT.
        const url = `${Config.apiUrl}/api/productions/${editingProduction.id}`;
        await axios.put(url, data, { headers });
      } else {
        // Otherwise, create a new production item using POST.
        const url = `${Config.apiUrl}/api/productions`;
        await axios.post(url, data, { headers });
      }

      // Close the modal upon success.
      setShowModal(false);
      // Refresh the list of productions.
      fetchData();

      // Display a success notification.
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Production data saved successfully',
        timer: 1000
      });
    } catch (err) {
      // Alert on any error during submission.
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error: ' + err
      });
    }
  };

  return (
    <div className="container">
      {/* Heading for the production management page */}
      <h1 className="text-2xl font-bold mb-5">Manage Production Data</h1>
      <div className="flex mb-6 gap-2">
        {/* Button to open the add-production modal */}
        <button className="button-add" onClick={handleAdd}>
          <i className="fas fa-plus mr-2"></i>
          Add Product
        </button>
        {/* Link to navigate to the materials page */}
        <Link href="/erp/material" className="button">
          <i className="fas fa-box mr-2"></i>
          Materials
        </Link>
      </div>

      <div className="table-container">
        {/* Table to display production items */}
        <table className="table">
          <thead>
            <tr>
              <th className="w-[200px]">Product Name</th>
              <th>Description</th>
              <th className="w-[120px]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Loop through the productions state and display each item */}
            {productions.map((production) => (
              <tr key={production.id}>
                <td>{production.name}</td>
                <td>{production.detail}</td>
                <td className="flex gap-2">
                  {/* Link to the production formula page */}
                  <Link href={`/erp/formula/${production.id}`} className="button">
                    <i className="fas fa-file-alt mr-2"></i>
                    Formula
                  </Link>
                  {/* Link to the production log page */}
                  <Link href={`/erp/production/log/${production.id}`} className="button">
                    <i className="fas fa-check mr-2"></i>
                    Production Log
                  </Link>
                  {/* Link to the production loss page */}
                  <Link href={`/erp/production/loss/${production.id}`} className="button">
                    <i className="fas fa-file-alt mr-2"></i>
                    Log Loss
                  </Link>
                  {/* Button to trigger the edit mode */}
                  <button className="table-action-btn table-edit-btn"
                    onClick={() => handleEdit(production)}
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  {/* Button to delete the production item */}
                  <button className="table-action-btn table-delete-btn"
                    onClick={() => handleDelete(production)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Conditionally render the modal if showModal is true */}
      {showModal && (
        <Modal id="production-modal" title="Production Data" onClose={() => setShowModal(false)} size="md">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-2">Product Name</label>
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Description</label>
              <input
                type="text"
                className="form-input"
                value={detail}
                onChange={e => setDetail(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2">
              {/* Button to cancel and close the modal */}
              <button type="button" onClick={() => setShowModal(false)}
                className="modal-btn modal-btn-cancel">
                <i className="fas fa-times mr-2"></i>
                Cancel
              </button>
              {/* Button to submit the form (save data) */}
              <button type="submit" className="modal-btn modal-btn-submit">
                <i className="fas fa-check mr-2"></i>
                Save
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
