import React from 'react';
import Sidebar from "../components/Sidebar";
import { useSidebar } from '../utils/SidebarContext';

const Dashboard = () => {
    const { sidebarOpen } = useSidebar();

    return (
        <div className="flex">
            <Sidebar />
            <main className={`flex-1 bg-red p-8 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p>Bienvenue sur le tableau de bord de Data Copilot.</p>
                <div className="mt-4">
                    <p>Scrollez pour tester que le sidebar reste fixe.</p>
                    {[...Array(50)].map((_, i) => (
                        <p key={i} className="mt-2">Contenu de test ligne {i + 1}</p>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;