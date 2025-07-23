'use client'

import React, { useState } from 'react';
import { Config } from './Config';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      const url = `${Config.apiUrl}/api/users/admin-signin`;
      const payload = {
        username: username,
        password: password
      }
      const response = await axios.post(url, payload);

      if (response.status === 200) {
        // เก็บ token ลง cookie (ถ้าต้องการ)
        document.cookie = Config.tokenKey + '=' + response.data.token;

        // เก็บ token ลง localStorage (สำคัญ!)
        localStorage.setItem(Config.tokenKey, response.data.token);

        // เก็บ role ลง localStorage ด้วยก็ได้ (ถ้าต้องใช้ใน client)
        localStorage.setItem('userRole', response.data.role);

        if (response.data.role == 'admin') {
          router.push('/erp/dashboard');
        } else {
          router.push('/erp/sale');
        }
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Invalid username or password ' + (err as Error).message
      })
    }
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSignIn();
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">
          <i className="fas fa-leaf"></i> Spring-ERP 2025
        </h1>
        <h2 className="login-subtitle">
          Enterprise Resource Planning System
        </h2>
        <form className="login-form" onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label className="form-label">
              <i className="fas fa-user mr-2"></i>
              Username
            </label>
            <input type="text" className="form-input"
              placeholder="Enter your Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">
              <i className="fas fa-lock mr-2"></i>
              Password
            </label>
            <input type="password" className="form-input"
              placeholder="Enter your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="login-button">
            <i className="fas fa-sign-in-alt mr-2"></i>
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
