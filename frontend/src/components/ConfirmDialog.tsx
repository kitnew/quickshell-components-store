import { useState } from 'react';

interface ConfirmDialogProps {
    title: string;
    text: string;
    confirmLabel?: string;
    onConfirm: () => void | Promise<void>;
    onCancel: () => void;
}

export default function ConfirmDialog({
    title,
    text,
    confirmLabel = 'Delete',
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        setLoading(true);
        try {
            await onConfirm();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="confirm-overlay" onClick={onCancel}>
            <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
                <h3 className="confirm-dialog__title">{title}</h3>
                <p className="confirm-dialog__text">{text}</p>
                <div className="confirm-dialog__actions">
                    <button className="btn btn--secondary" onClick={onCancel} disabled={loading}>
                        Cancel
                    </button>
                    <button className="btn btn--danger" onClick={handleConfirm} disabled={loading}>
                        {loading ? 'Deleting...' : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
