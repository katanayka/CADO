import { Collapse } from 'react-daisyui';

const CollapseMenu = ({ node }: { node: any }) => {

    console.log("Node", node);

    return (
        <Collapse icon="arrow" checkbox={true}>
            <Collapse.Title className="text-s font-medium">
                {node.data.label}
                {node.data.text ? <p className="text-xs">{node.data.text}</p> : null}
            </Collapse.Title>
            <Collapse.Content>
                {node.data.inside ? <p>{node.data.inside}</p> : null}
                {node.children.map((child: any) => (
                    <CollapseMenu key={child.id} node={child} />
                ))}
            </Collapse.Content>
        </Collapse>
    );
};

export default CollapseMenu;
