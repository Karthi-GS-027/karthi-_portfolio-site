import React from 'react';
import type { Customization } from '../types';

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
  colors: Customization;
}

const hexToRgba = (hex: string, alpha: number): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const Modal: React.FC<ModalProps> = ({ onClose, children, colors }) => {
  const modalShadow = { boxShadow: `0 0 25px ${hexToRgba(colors.outline, 0.5)}` };

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-gray-900 rounded-lg relative"
        style={{ ...modalShadow, borderColor: colors.outline, borderWidth: 2, color: colors.text }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-3 hover:text-white text-3xl font-bold"
          style={{ color: colors.text }}
          aria-label="Close modal"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
