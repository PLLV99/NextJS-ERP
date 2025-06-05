'use client'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { Config } from '@/app/Config';


export default function EditProfile() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const router = useRouter();

    useEffect(() => {
        fectUserData();
    }, []);

    const fectUserData = async () => {
        try {
            const token = localStorage.getItem(Config.tokenKey);
            const response = await axios.get(`${Config.apiUrl}/api/users/admin-info`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (response.status === 200) {
                setUsername(response.data.username);
                setEmail(response.data.email);
            }

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to fetch user data : ' + error
            });

        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (password !== confirmPassword) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Password and Confirm Password do not match'
                });
                return;
            }

            const token = localStorage.getItem(Config.tokenKey);
            const url = `${Config.apiUrl}/api/users/edit-profile`;
            const payload = {
                username,
                email,
                password
            }
            const headers = {
                'Authorization': `Bearer ${token}`
            }
            const response = await axios.put(url, payload, { headers });
            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Profile updated successfully'
                });
                router.push('/erp/dashboard');
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to update profile : ' + error
            });

        }
    }

    return (
        <div>
            <h1 className="login-title">Edit Profile</h1>
            <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                    <label className="form-label">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="form-input"
                        required
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-input"
                        required
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Confirm Password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="form-input"
                    />
                </div>
                <div className='from-group flex items-center'>
                    <button type="submit" className="button">
                        <i className="fas fa-save mr-2"></i>
                        Update Profile
                    </button>
                </div>
            </form>
        </div>
    )
}