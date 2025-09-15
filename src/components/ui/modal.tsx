/**
 * Modal Component
 * Modal profesional con backdrop, animaciones y configuración completa
 */
'use client';

import { cn } from '@/lib/utils';
import React, { useCallback, useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  backdrop?: 'blur' | 'dark' | 'light';
  backdropOpacity?: 'light' | 'medium' | 'dark';
  position?: 'center' | 'top' | 'bottom';
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  className,
  size = 'md',
  showCloseButton = true,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  backdrop = 'blur',
  backdropOpacity = 'medium',
  position = 'center',
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  // Handle ESC key
  useEffect(() => {
    if (!closeOnEscape) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        event.preventDefault();
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeOnEscape, handleClose]);

  // Handle dialog open/close
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Focus the modal content
      const modalContent = dialogRef.current;
      if (modalContent) {
        modalContent.focus();
      }
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (!closeOnBackdropClick) return;
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[95vw]',
  };

  const backdropClasses = {
    blur: 'backdrop-blur-sm',
    dark: '',
    light: '',
  };

  const backdropOpacityClasses = {
    light: 'bg-black/30',
    medium: 'bg-black/50',
    dark: 'bg-black/70',
  };

  // Posición aplicada al contenedor wrapper
  const positionClasses = {
    center: 'flex items-center justify-center',
    top: 'flex items-start justify-center pt-10',
    bottom: 'flex items-end justify-center pb-10',
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        className={cn(
          'fixed inset-0 z-40 transition-all duration-300 ease-out',
          backdropClasses[backdrop],
          backdropOpacityClasses[backdropOpacity]
        )}
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Modal Container - Aquí se aplica el posicionamiento */}
      <div
        className={cn(
          'fixed inset-0 z-50',
          positionClasses[position] // flex y centrado aplicado aquí
        )}
        onClick={handleBackdropClick}
      >
        {/* Modal Content */}
        <div
          ref={dialogRef}
          className={cn(
            'bg-card border-border rounded-lg border shadow-2xl',
            'mx-2 w-full',
            'max-h-[95vh] overflow-hidden',
            sizeClasses[size],
            'transform transition-all duration-300 ease-out',
            isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0',
            'focus:outline-none',
            className
          )}
          onClick={e => e.stopPropagation()}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'modal-title' : undefined}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="border-border flex items-center justify-between border-b px-4 py-3">
              {title && (
                <h2 id="modal-title" className="text-foreground text-lg font-semibold">
                  {title}
                </h2>
              )}
              {showCloseButton && (
                <button
                  onClick={handleClose}
                  className={cn(
                    'text-muted-foreground hover:text-foreground',
                    'rounded-sm p-1 transition-colors',
                    'focus:ring-ring focus:outline-none focus:ring-2 focus:ring-offset-2',
                    !title && 'ml-auto'
                  )}
                  aria-label="Cerrar modal"
                  type="button"
                >
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                  </svg>
                </button>
              )}
            </div>
          )}

          {/* Content */}
          <div className="max-h-[calc(95vh-6rem)] overflow-y-auto p-4">{children}</div>
        </div>
      </div>
    </>
  );
}
