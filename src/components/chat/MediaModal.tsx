import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Download } from 'lucide-react';
import { IconButton } from '../ui/IconButton';

interface MediaModalProps {
    isOpen: boolean;
    onClose: () => void;
    src: string;
    type: 'image' | 'video';
    alt?: string;
}

export const MediaModal: React.FC<MediaModalProps> = ({ isOpen, onClose, src, type, alt }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleDownload = async () => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL;
            const token = localStorage.getItem('authToken');

            // Use backend proxy to avoid CORS and force download
            const proxyUrl = `${apiUrl}/messages/media/download?url=${encodeURIComponent(src)}`;

            const response = await fetch(proxyUrl, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Download failed');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            // Use backend filename if available or fallback
            a.download = alt || `download.${type === 'image' ? 'png' : 'mp4'}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Download failed:', error);
            // Fallback
            alert('Error al descargar la imagen. Intenta abrirla en una pestaña nueva.');
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-grafite border border-smoke rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-smoke bg-grafite z-10">
                    <h3 className="text-swirl font-medium truncate flex-1 pr-4">
                        {alt || 'Archivo multimedia'}
                    </h3>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleDownload}
                            className="p-2 hover:bg-smoke rounded-lg text-swirl transition-colors"
                            title="Descargar"
                        >
                            <Download size={20} />
                        </button>
                        <IconButton
                            icon={<X size={20} />}
                            onClick={onClose}
                            label="Cerrar"
                            className="text-swirl hover:bg-smoke"
                        />
                    </div>
                </div>

                {/* Media Container */}
                <div className="flex-1 overflow-auto bg-black/20 flex items-center justify-center p-4">
                    {type === 'image' ? (
                        <img
                            src={src}
                            alt={alt || "Media preview"}
                            className="max-w-full max-h-[75vh] object-contain rounded-md shadow-lg"
                        />
                    ) : (
                        <video
                            src={src}
                            controls
                            autoPlay
                            className="max-w-full max-h-[75vh] rounded-md shadow-lg"
                        >
                            Tu navegador no soporta la reproducción de video.
                        </video>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
};
