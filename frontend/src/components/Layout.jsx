import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';

export default function Layout() {
    const [colapsado, setColapsado] = useState(false);

    return (
        <div className="app-shell">
            <Sidebar colapsado={colapsado} onToggle={() => setColapsado(v => !v)} />
            <main className="app-content">
                <Outlet />
            </main>
        </div>
    );
}
