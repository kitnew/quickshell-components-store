interface PageHeaderProps {
    title: string;
    subtitle?: string;
    action?: React.ReactNode;
}

export default function PageHeader({ title, subtitle, action }: PageHeaderProps) {
    return (
        <div className="page-header">
            <div className="page-header__row">
                <div>
                    <h1 className="page-header__title">{title}</h1>
                    {subtitle && <p className="page-header__subtitle">{subtitle}</p>}
                </div>
                {action && <div>{action}</div>}
            </div>
        </div>
    );
}
