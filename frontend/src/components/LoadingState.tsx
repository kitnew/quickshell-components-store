export default function LoadingState() {
    return (
        <div className="component-grid">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="skeleton skeleton-card" />
            ))}
        </div>
    );
}
