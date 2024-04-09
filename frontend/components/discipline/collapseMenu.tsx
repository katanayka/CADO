import { Collapse } from 'react-daisyui';

const CollapseMenu = ({ node }: { node: any }) => {
    return (
        <Collapse icon="arrow" checkbox={true}>
            <Collapse.Title className="text-s font-medium">

                {node.data.text ? node.data.text : null}
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
