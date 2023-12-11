import { Input, Tabs } from "react-daisyui";
import { usePathname } from "next/navigation";
import { useContext } from "react";

export default function Toolbar({
  disciplineId,
  sharedData,
}: {
  disciplineId: string;
  sharedData: any;
}) {

  const onDragStart = (
    event: {
      dataTransfer: {
        setData: (arg0: string, arg1: any) => void;
        effectAllowed: string;
      };
    },
    nodeType: any
  ) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const onDragEnd = (
    event: {
      dataTransfer: {
        setData: (arg0: string, arg1: any) => void;
        effectAllowed: string;
      };
    },
    nodeType: any
  ) => {
  };
  const router = usePathname();
  const isOnElementsPage = router.includes("/elements");

  let history = [];
 // Get treeInfoArrayContext from context
  // sharedData.map((item: any) => {
  //   console.log(item);
  // });
  console.log(sharedData);
  const newArr = Array.isArray(sharedData) ? sharedData.map((item: { depth: number; node: string; }) => {
    return `${' • '.repeat(item.depth)}${item.node}`;
  }) : [];
  
  console.log(newArr);
  const buttons = ["input", "Rewritable", "input", "input", "VideoN"];

  return (
    <div className="h-11/12 w-96 flex flex-col">
      <Tabs variant="bordered" size="md" className="w-full grid grid-cols-2 ">
        <Tabs.RadioTab name="my_tabs_1" label="Базовые" defaultChecked={true} className="checked:bg-base-100 border wrap">
          <ul className="menu rounded-box gap-2 items-center flex h-[calc(100vh-5rem)] [&>*>a]:border-2 [&>*>a]:border-dashed [&>*>a]:border-gray-100 px-0 [&>*>a]:hover:border-gray-300">
            <li className="w-full">
              <Input className="w-full"/>
            </li>
            {newArr.map(button => (
              <li className="w-full" key={button+Math.random()}>
                <a
                  className=""
                  onDragStart={(event) => onDragStart(event, button)}
                  onDragEnd={(event) => onDragEnd(event, button)}
                  draggable
                >
                  {button}
                </a>
              </li>
            ))}
          </ul>
        </Tabs.RadioTab>
        <Tabs.RadioTab name="my_tabs_1" label="Расширенные" className="checked:bg-base-100 border wrap">
          <ul className="menu rounded-box gap-2 items-center flex h-[calc(100vh-5rem)] [&>*>a]:border-2 [&>*>a]:border-dashed [&>*>a]:border-gray-100 px-0 [&>*>a]:hover:border-gray-300">
            <li className="w-full">
              <a
                className=" justify-center">
                elem 1
              </a>
            </li>
            <li className="w-full">
              <a
                className=" justify-center">
                elem 2
              </a>
            </li>
          </ul>
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
