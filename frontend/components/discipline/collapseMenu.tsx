import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Collapse } from 'react-daisyui';
import { HiPencil } from 'react-icons/hi';

const CollapseMenu = ({ node }: { node: any }) => {
    // Get disciplineId from the URL
    const router = usePathname();
    const disciplineId = router.split('/')[2];
    return (
        <Collapse icon="arrow" checkbox={true}>
            <Collapse.Title className="text-s font-medium flex justify-between items-center">
                {node.data.text ? node.data.text : null}
                <Link
                    href={`/disciplines/[disciplineId]/edit/[nodeId]`}
                    as={`/disciplines/${disciplineId}/edit/${node.id}`}
                    className="text-blue-500 hover:text-blue-700 btn-ghost rounded-full p-1 z-10 transition-colors"
                >
                    <HiPencil />
                </Link>
            </Collapse.Title>
            <Collapse.Content className='right-0 p-0 pl-4'>

                {node.data.inside ? <p>{node.data.inside}</p> : null}
                {node.children.map((child: any) => (
                    <CollapseMenu key={child.id} node={child} />
                ))}
            </Collapse.Content>
        </Collapse>
    );
};

export default CollapseMenu;
