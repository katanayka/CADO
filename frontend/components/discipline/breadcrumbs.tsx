import Link from 'next/link';

type BreadcrumbItem = {
    href?: string;
    label: string;
    icon?: JSX.Element;
};

type BreadcrumbsProps = {
    items: BreadcrumbItem[];
};

export default function Breadcrumbs({ items }: Readonly<BreadcrumbsProps>) {
    return (
        <div className="text-sm breadcrumbs ml-4">
            <ul>
                {items.map((item) => (
                    <li key={item.label}>
                        {item.href ? (
                            <Link href={item.href}>
                                {item.icon}
                                {item.label}
                            </Link>
                        ) : (
                            <span className="inline-flex gap-2 items-center">
                                {item.icon}
                                {item.label}
                            </span>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}