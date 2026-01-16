import React from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { LoginForm } from '../../components/auth/LoginForm';

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-grafite via-[#3d2d37] to-[#4a3a44] flex items-center justify-center p-6 pt-24">
            <Navbar />
            <LoginForm />
        </div>
    );
}
