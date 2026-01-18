import { useEffect } from 'react';

export default function MessageModal({ isOpen, onClose, title, message, type = 'info' }) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000); // Auto close after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      default:
        return 'ℹ️';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-fade-in">
      <div className="bg-[#120f14] border border-white/20 text-white shadow-lg rounded-lg p-4 max-w-sm">
        <div className="flex items-start gap-3">
          <span className="text-xl">{getIcon()}</span>
          <div className="flex-1">
            <h4 className="font-semibold text-sm">{title}</h4>
            <p className="text-white/70 text-sm mt-1">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/50 hover:text-white text-xl leading-none"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
