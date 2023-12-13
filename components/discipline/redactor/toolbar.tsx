import { Input, Menu, Tabs } from "react-daisyui";
import { usePathname } from "next/navigation";
import { useContext, useEffect } from "react";
import "./style.css"
import axios from "axios";

let oldValue = "";
let dragStart: any[] = []

export default function Toolbar({
  disciplineId,
  sharedData,
}: {
  disciplineId: string;
  sharedData: any;
}) {
  const router = usePathname();
  const isOnElementsPage = router.includes("/elements");
  let draggedNodeId: string | null = null;

  useEffect(()=> {
    async function fetchData() {
      try {
        const res = await axios.get(
          `/api/elements/data`
        );
        if (res.status === 200) {
          const data = await res.data;
          console.log("Data fetched:", data);
        }
      } catch (error) {
        console.log(error)
      }
		}
    fetchData()
  },[])

  const onDragStart = (
    event: any,
    nodeType: any
  ) => {
    draggedNodeId = nodeType;
    console.log("DRAG NODE IS - ", draggedNodeId);
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

  let history = [];

  const newArr = Array.isArray(sharedData) ? sharedData.map((item: { depth: number; node: string; }) => {
    return item.node;
  }) : [];

  const generateMenu = (data: any[], parent = null) => {
    if (!data) {
      return null;
    }

    const filteredData = parent
      ? data.filter((item) => item.parent === parent)
      : data.filter((item) => !item.parent);

    return filteredData.map((item) => {
      const hasChildren = data.some((child) => child.parent === item.node);
      console.log(item);
      return (
        <Menu.Item
          key={item.node}
          className={hasChildren ? 'pt-2 w-full' : ''}  // Adjust the class based on your styling needs
          onDragStart={(event) => onDragStart(event, JSON.stringify(item))}
          onDragEnd={(event) => onDragEnd(event, JSON.stringify(item))}
          draggable
        >
          {hasChildren ? (
            <Menu.Details open={true} label={<>{item.node}</>}>
              {generateMenu(data, item.node)}
            </Menu.Details>
          ) : (
            <span>{item.node}</span>
          )}
        </Menu.Item>
      );
    });
  };

  const menuItems = generateMenu(sharedData);
  const buttons = ["input", "Rewritable", "VideoN"];
  let nodes = JSON.parse(JSON.stringify(sharedData)); 
  nodes = [
    {parent: null, node: 'Rewritable', description: 'Description for Rewritable', depth: -1, type: 'Rewritable'},
    {parent: null, node: 'VideoN', description: 'Description for VideoN', depth: -1, type: 'VideoN'}
  ]
  
  const baseItems = generateMenu(nodes);
  return (
    <div className="h-11/12 w-96 flex flex-col">
      <Tabs variant="bordered" size="md" className="w-full grid grid-cols-2 ">
        <Tabs.RadioTab name="my_tabs_1" label="Базовые" defaultChecked={true} className="checked:bg-base-100 border wrap">
          <ul className="menu rounded-box gap-2 items-center  flex h-[calc(100vh-5rem)] [&>*>a]:border-2 [&>*>a]:border-dashed [&>*>a]:border-gray-100 [&>*>a]:hover:border-gray-300">
            {isOnElementsPage && (
              <li className="w-full">
                <Input className="w-full no-animation" />
              </li>
            )}
            {nodes.map((node: any) => (
              <li className="w-full" key={node + Math.random()}>
                <a
                  className=""
                  onDragStart={(event) => onDragStart(event, JSON.stringify(node))}
                  onDragEnd={(event) => onDragEnd(event, JSON.stringify(node))}
                  draggable
                >
                  {node.node}
                </a>
              </li>
            ))}
          </ul>
        </Tabs.RadioTab>
        <Tabs.RadioTab name="my_tabs_1" label="Расширенные" className="checked:bg-base-100 border wrap">
          <Menu size="md" className="menu gap-2 flex h-[calc(100vh-5rem)] no-animation w-full max-w-xs">
            {menuItems}
          </Menu>
          <div className="h-10/12 w-full flex flex-col">
            {!isOnElementsPage && (
              <a className="text-center w-full h-8" href={`/disciplines/${disciplineId}/redactor/elements`}>
                Редактор элементов
              </a>
            )}
          </div>
        </Tabs.RadioTab>
      </Tabs>
    </div>
  );
}
