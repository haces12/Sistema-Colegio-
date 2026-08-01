import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
export default function Modal({ abierto, onClose, titulo, children }) {
    useEffect(() => {
        if (!abierto) return;

        function onKeyDown(e) {
            if (e.key === 'Escape') onClose();
        }
        document.addEventListener('keydown', onKeyDown);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.body.style.overflow = '';
        };
    }, [abierto, onClose]);

    if (!abierto) return null;

    return createPortal(
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{titulo}</h2>
                    <button type="button" className="modal-close" onClick={onClose} aria-label="Cerrar">
                        <X size={18} />
                    </button>
                </div>
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
}