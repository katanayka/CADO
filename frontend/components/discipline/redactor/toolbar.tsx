import { Input, Menu, Tabs } from "react-daisyui";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import "./style.css"
import Link from "next/link";
import nodeTypesRedact from "@/data/NodeTypesRedact";

let dragStart: any[] = []

export default function Toolbar({
  disciplineId,
  sharedData,
}: Readonly<{
  disciplineId: string;
  sharedData: any;
}>) {
  const router = usePathname();
  const isOnElementsPage = router.includes("/elements");
  let draggedNodeId: string | null = null;
  const onDragStart = (
    event: any,
    nodeType: any
  ) => {
    draggedNodeId = nodeType;
    dragStart.push(draggedNodeId)
    event.dataTransfer.setData("application/reactflow", dragStart[0]);
    event.dataTransfer.effectAllowed = "move";
    event.currentTarget.classList.add("dragged-element");
  };

  const onDragEnd = (
    event: any,
    nodeType: any
  ) => {
    event.currentTarget.classList.remove("dragged-element");
    draggedNodeId = null;
    dragStart = []
  };

  const generateMenu = (
    node: { 
      children: any[]; 
      id: React.Key | null | undefined; 
      data: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactPortal | PromiseLike<React.ReactNode> | Iterable<React.ReactNode> | null | undefined; 
    }) => {
    if (!node) {
      return null;
    }
    
    
    const hasChildren = (node.children || []).length > 0;

    return (
      <Menu.Item
        key={node.id}
        className={hasChildren ? 'pt-2 w-full text-white' : ''}  // Adjust the class based on your styling needs
        onDragStart={(event) => onDragStart(event, JSON.stringify(node))}
        onDragEnd={(event) => onDragEnd(event, JSON.stringify(node))}
        draggable
      >
        {hasChildren ? (
          <Menu.Details open={true} label={<>{node.id}</>}>
            {(node.children || []).map((childNode, index) => (
              generateMenu(childNode)
            ))}
          </Menu.Details>
        ) : (
          <span>{String(node.id)}</span>
        )}
      </Menu.Item>
    );
  };

  const generateMenuMin = (
    node: { 
      parent: any; 
      node: string; 
      description: string; 
      type: string; 
      minElement: boolean;
    }) => {
    if (!node) {
      return null;
    }
    return (
      <Menu.Item
        key={node.node}
        className="pt-2 w-full text-white"  // Adjust the class based on your styling needs
        onDragStart={(event) => onDragStart(event, JSON.stringify(node))}
        onDragEnd={(event) => onDragEnd(event, JSON.stringify(node))}
        draggable
      >
        <span>{String(node.node)}</span>
      </Menu.Item>
    );
  };

  const menuItems = useMemo(() => {
    return generateMenu(sharedData?.root);
  }, [sharedData]);
  let keys = Object.keys(nodeTypesRedact)
  let nodes = keys.map((key) => {
    return { parent: null, node: key, description: `Description for ${key}`, type: key, minElement: true }
  })
  const menuItemsNodes = useMemo(() => {
    return nodes.map((node, index) => {
      return generateMenuMin(node)
    });
  }, [nodes]);

  return (
    <div className="w-96 flex flex-col overflow-auto bg-blue-500">
      <Tabs variant="bordered" size="md" className="w-full grid grid-cols-2 ">
        <Tabs.RadioTab name="my_tabs_1" label="Базовые" defaultChecked={true} className="checked:bg-base-100 border wrap">
          <ul className="menu rounded-box gap-2 items-center  flex h-[calc(100vh-5rem)] [&>*>a]:border-2 [&>*>a]:border-dashed [&>*>a]:border-gray-100 [&>*>a]:hover:border-gray-300">

            {isOnElementsPage && (
              <li className="w-full">
                <Input className="w-full no-animation" />
              </li>
            )}
            {menuItemsNodes}
          </ul>
        </Tabs.RadioTab>
        <Tabs.RadioTab name="my_tabs_1" label="Расширенные" className="checked:bg-base-100 border wrap">
          <Menu size="md" className="menu gap-2 flex h-[calc(100vh-5rem)] no-animation w-full max-w-xs">
            {menuItems}
          </Menu>
          <div className="h-10/12 w-full flex flex-col">
            {!isOnElementsPage && (
              <Link className="text-center w-full h-8" href={`/disciplines/${disciplineId}/redactor/elements`}>
                Редактор элементов
              </Link>
            )}
          </div>
        </Tabs.RadioTab>
      </Tabs>
    </div>
  );
}
