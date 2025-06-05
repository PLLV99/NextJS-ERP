'use client'

// นำเข้าไลบรารีที่จำเป็น
// Import required libraries
import { useState, useEffect } from "react"
import Swal from "sweetalert2" // สำหรับ popup แจ้งเตือน / For alert popups
import { Config } from "@/app/Config" // ไฟล์คอนฟิกสำหรับ API URL และ Token Key
import Modal from "../components/Modal" // คอมโพเนนต์ Modal สำหรับแสดงกล่อง popup
import axios from "axios" // ไลบรารีสำหรับทำ HTTP requests

// กำหนดโครงสร้างข้อมูลผู้ใช้
// Define user data structure
interface User {
    id: number,
    email: string,
    username: string
}

export default function Page() {
    // State สำหรับเก็บข้อมูลต่างๆ / States for storing data
    const [users, setUsers] = useState<User[]>([]); // รายชื่อผู้ใช้ทั้งหมด / All users
    const [showModal, setShowModal] = useState(false); // แสดง/ซ่อน modal / Show/hide modal
    const [editingUser, setEditingUser] = useState<User | null>(null); // ผู้ใช้ที่กำลังแก้ไข / User being edited
    const [email, setEmail] = useState(''); // อีเมลในฟอร์ม / Email in form
    const [username, setUsername] = useState(''); // ชื่อผู้ใช้ในฟอร์ม / Username in form
    const [password, setPassword] = useState(''); // รหัสผ่านในฟอร์ม / Password in form
    const [passwordConfirm, setPasswordConfirm] = useState(''); // รหัสผ่านยืนยันในฟอร์ม / Confirm password in form
    // โหลดข้อมูลผู้ใช้เมื่อเปิดหน้า / Load users when page opens
    useEffect(() => {
        fetchUsers();
    }, []);

    // ดึงข้อมูลผู้ใช้จาก API / Fetch users from API
    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${Config.apiUrl}/api/users`); // เรียก API เพื่อดึงข้อมูลผู้ใช้ / Call API to fetch users
            // ถ้าสำเร็จ (status 200) ให้เก็บข้อมูลผู้ใช้ / If successful (status 200), store users data

            if (response.status == 200) {
                setUsers(response.data);
            }
            // ถ้าไม่สำเร็จ ให้แสดงข้อความผิดพลาด / If not successful, show error message
        } catch (error: any) {
            Swal.fire({
                title: 'Error',
                text: error.message,
                icon: 'error'
            })
        }
    }

    // จัดการการ submit ฟอร์ม (เพิ่ม/แก้ไขผู้ใช้) / Handle form submit (add/edit user)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // ตรวจสอบ password และ confirm password (ถ้ามี)
        if (password !== passwordConfirm) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Password and Confirm Password do not match'
            });
            return;
        }

        try {
            let url = '';
            let response;
            const payload = {
                email,
                username,
                password: password || ''
            };
            const headers = {
                'Authorization': 'Bearer ' + localStorage.getItem(Config.tokenKey)
            };

            if (editingUser) {
                // กรณีแก้ไข user อื่น (admin เท่านั้น)
                url = `${Config.apiUrl}/api/users/admin-edit-profile/${editingUser.id}`;
                response = await axios.put(url, payload, { headers });
            } else {
                // กรณีเพิ่ม user ใหม่
                url = `${Config.apiUrl}/api/users/admin-create`;
                response = await axios.post(url, payload, { headers });
            }

            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'success',
                    text: `User ${editingUser ? 'updated' : 'created'} successfully`,
                    timer: 1000
                });

                setShowModal(false);
                setEditingUser(null);
                setEmail('');
                setUsername('');
                setPassword('');
                setPasswordConfirm('');
                fetchUsers();
            }
        } catch (error: any) {
            Swal.fire({
                title: 'Error',
                text: error.message,
                icon: 'error'
            });
        }
    }

    // จัดการการลบผู้ใช้ / Handle user deletion
    const handleDelete = async (user: User) => {
        try {
            // แสดง popup ยืนยันก่อนลบ / Show confirmation popup before deleting
            const result = await Swal.fire({
                icon: 'warning',
                title: 'Are you sure?',
                text: `Do you want to delete user ${user.username}`,
                showCancelButton: true,
                showConfirmButton: true
            })
            // ถ้ายืนยันการลบ / If confirmed deletion
            if (result.isConfirmed) {
                const headers = {
                    'Authorization': 'Bearer ' + localStorage.getItem(Config.tokenKey) // ใช้ API Key จาก localStorage / Use API Key from localStorage
                }
                const url = `${Config.apiUrl}/api/users/admin-delete/${user.id}`; // URL สำหรับลบผู้ใช้ / URL for deleting user
                // ส่งคำขอลบผู้ใช้ไปยัง API / Send delete request to API
                const response = await axios.delete(url, { headers })

                if (response.status === 200) {
                    // แจ้งเตือนลบสำเร็จ / Show success message
                    Swal.fire({
                        icon: 'success',
                        title: 'success',
                        text: 'User deleted successfully',
                        timer: 1000
                    })

                    // โหลดข้อมูลใหม่ / Refresh data
                    fetchUsers();
                }
            }
        } catch (error: any) {
            Swal.fire({
                title: 'Error',
                text: error.message,
                icon: 'error'
            })
        }
    }

    // จัดการการแก้ไขผู้ใช้ / Handle user editing
    const handleEdit = (user: User) => {
        // เตรียมข้อมูลสำหรับแก้ไข / Prepare data for editing
        setEditingUser(user);
        setEmail(user.email);
        setUsername(user.username);
        setPassword('');
        setShowModal(true); // แสดง modal สำหรับแก้ไข / Show modal for editing
        // ปิด modal ถ้าไม่มีผู้ใช้ที่เลือก / Close modal if no user selected

    }

    // ส่วนแสดงผล UI / UI rendering
    return (
        <div className="container mx-auto p-4">
            {/* หัวข้อหน้า / Page title */}
            <h1 className="text-2xl font-bold mb-5">User Management</h1>

            {/* ปุ่มเพิ่มผู้ใช้ / Add user button */}
            <div className="flex justify-between items-center mb-6">
                <button className="button-add"
                    onClick={() => {
                        setEditingUser(null)
                        setEmail('')
                        setUsername('')
                        setPassword('')
                        setShowModal(true)
                    }}
                >
                    <i className="fas fa-plus mr-2"></i>
                    Add User
                </button>
            </div>

            {/* ตารางแสดงรายชื่อผู้ใช้ / User list table */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="w-full table">
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th className="w-[120px]">Username</th>
                            <th className="text-right" style={{ width: '100px' }}>&nbsp;</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* แสดงรายชื่อผู้ใช้ / Display user list */}
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.email}</td>
                                <td>{user.username}</td>
                                <td className="text-right">
                                    {/* ปุ่มแก้ไข / Edit button */}
                                    <button className="table-action-btn table-edit-btn mr-2"
                                        onClick={() => handleEdit(user)}
                                    >
                                        <i className="fas fa-edit"></i>
                                    </button>
                                    {/* ปุ่มลบ / Delete button */}
                                    <button className="table-action-btn table-delete-btn"
                                        onClick={() => handleDelete(user)}
                                    >
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* แสดง modal สำหรับเพิ่ม/แก้ไขผู้ใช้ / Show modal for adding/editing user */}
            {showModal && (

                <Modal id="user-modal" title="User Information" onClose={() => setShowModal(false)} size="md">
                    <form onSubmit={handleSubmit}>
                        {/* ฟอร์มอีเมล / Email form */}
                        <div className="mb-4">
                            <label className="block mb-2">Email</label>
                            <input type="email" className="form-input" value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        {/* ฟอร์มชื่อผู้ใช้ / Username form */}
                        <div className="mb-4">
                            <label className="block mb-2">Username</label>
                            <input type="text" className="form-input" value={username}
                                onChange={e => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        {/* ฟอร์มรหัสผ่าน / Password form */}
                        <div className="mb-4">
                            <label className="block mb-2">Password</label>
                            <input type="password" className="form-input"
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>
                        {/* ฟอร์มยืนยันรหัสผ่าน / Confirm Password form */}
                        <div className="mb-4">
                            <label className="block mb-2">Confirm Password</label>
                            <input type="password" className="form-input"
                                onChange={e => setPasswordConfirm(e.target.value)}
                            />
                        </div>
                        {/* ปุ่มดำเนินการ / Action buttons */}
                        <div className="flex justify-end gap-2 ">
                            <button type="button" onClick={() => setShowModal(false)}
                                className="modal-btn modal-btn-cancel">
                                <i className="fas fa-times mr-2 "></i>
                                Cancel
                            </button>
                            <button type="submit" className="modal-btn modal-btn-submit">
                                <i className="fas fa-check mr-2"></i>
                                Save
                            </button>
                        </div>
                    </form>
                </Modal>
            )}                  </div>
    )
}










