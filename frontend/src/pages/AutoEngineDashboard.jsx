import React, { useState, useEffect } from 'react';

const AutoEngineDashboard = () => {
    // State untuk menyimpan pesan dari backend
    const [pesanBackend, setPesanBackend] = useState('Sedang memuat data...');

    useEffect(() => {
        // Melakukan request ke Backend lo
        fetch('http://localhost:5000/api/test')
            .then((response) => response.json())
            .then((data) => {
                setPesanBackend(data.message); // Menyimpan pesan ke state
            })
            .catch((error) => {
                console.error('Waduh, ada error nih:', error);
                setPesanBackend('Gagal terhubung ke server.');
            });
    }, []);

    return (
        <div className="p-10 bg-gray-900 text-white min-h-screen">
            <h1 className="text-3xl font-bold text-blue-500 mb-4">
                Auto Engine - Sistem Manajemen Bengkel
            </h1>
            
            <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                <p className="text-lg">Status Sistem:</p>
                {/* Menampilkan pesan hasil tarikan dari backend */}
                <p className="text-green-400 font-mono mt-2">&gt; {pesanBackend}</p>
            </div>
        </div>
    );
};

export default AutoEngineDashboard;
