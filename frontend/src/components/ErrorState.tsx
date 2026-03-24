interface ErrorStateProps {
    message?: string;
    onRetry?: () => void;
}

export default function ErrorState({ message = 'Something went wrong', onRetry }: ErrorStateProps) {
    return (
        <div className="state-block">
            <h3 className="state-block__title">Error</h3>
            <p className="state-block__text">{message}</p>
            {onRetry && (
                <button className="btn btn--secondary" onClick={onRetry}>
                    Retry
                </button>
            )}
        </div>
    );
}
