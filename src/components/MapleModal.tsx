import { useEffect, useId, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface MapleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
  shortcut?: string;
}

export function MapleModal({ isOpen, onClose, title, children, actions, className = '', shortcut }: MapleModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const backdropPointer = useRef(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !isOpen) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const header = document.querySelector<HTMLElement>('.maple-header');
    const footer = document.querySelector<HTMLElement>('.maple-footer');
    const updateBounds = () => {
      const top = header ? header.getBoundingClientRect().bottom + 12 : 12;
      const bottom = footer ? window.innerHeight - footer.getBoundingClientRect().top + 12 : 12;
      dialog.style.setProperty('--modal-top', `${top}px`);
      dialog.style.setProperty('--modal-bottom', `${bottom}px`);
    };
    const observer = new ResizeObserver(updateBounds);
    if (header) observer.observe(header);
    if (footer) observer.observe(footer);
    window.addEventListener('resize', updateBounds);
    window.visualViewport?.addEventListener('resize', updateBounds);
    updateBounds();
    if (!dialog.open) dialog.showModal();
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateBounds);
      window.visualViewport?.removeEventListener('resize', updateBounds);
      dialog.close();
      previousFocus?.focus();
    };
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      className={`maple-modal ${className}`}
      aria-labelledby={titleId}
      onCancel={event => { event.preventDefault(); onClose(); }}
      onPointerDown={event => { backdropPointer.current = event.target === event.currentTarget; }}
      onClick={event => {
        if (backdropPointer.current && event.target === event.currentTarget) onClose();
        backdropPointer.current = false;
      }}
      onKeyDown={event => {
        if (shortcut && event.key.toLowerCase() === shortcut && !event.repeat && !event.metaKey && !event.ctrlKey && !event.altKey) {
          event.preventDefault();
          event.stopPropagation();
          onClose();
        }
      }}
    >
      {isOpen && <div className="maple-modal-window">
        <header className="maple-modal-header">
          <h2 id={titleId} className="maple-modal-title">{title}</h2>
          {actions}
          <button type="button" onClick={onClose} className="maple-modal-close" aria-label={`Close ${title.toLowerCase()}`} autoFocus>
            <X size={20} aria-hidden="true" />
          </button>
        </header>
        <div className="maple-modal-body">{children}</div>
      </div>}
    </dialog>
  );
}
