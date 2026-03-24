interface EmptyStateProps {
    title: string;
    text?: string;
    action?: React.ReactNode;
}

export default function EmptyState({ title, text, action }: EmptyStateProps) {
    return (
        <div className="state-block">
            <h3 className="state-block__title">{title}</h3>
            {text && <p className="state-block__text">{text}</p>}
            {action && <div>{action}</div>}
        </div>
    );
}
