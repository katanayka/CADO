import { Tabs } from "react-daisyui";
import { usePathname } from "next/navigation";

export default function Toolbar({
  disciplineId,
}: {
  disciplineId: string;
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

  return (
    <div className="h-11/12 w-96 flex flex-col">
      <Tabs variant="bordered" size="md" className="w-full grid grid-cols-2 ">
        <Tabs.RadioTab name="my_tabs_1" label="Базовые" defaultChecked={true} className="checked:bg-base-100 border">
          <ul className="menu rounded-box gap-2 items-center flex h-[calc(100vh-5rem)] [&>*>a]:border-2 [&>*>a]:border-dashed [&>*>a]:border-gray-100 px-0 [&>*>a]:hover:border-gray-300">
            <li className="w-full">
              <a
                className=" justify-center"
                onDragStart={(event) => onDragStart(event, "input")}
                onDragEnd={(event) => onDragEnd(event, "input")}
                draggable
              >
                TODO
              </a>
            </li>
            <li className="w-full">
              <a
                className=" justify-center"
                onDragStart={(event) => onDragStart(event, "Rewritable")}
                onDragEnd={(event) => onDragEnd(event, "Rewritable")}
                draggable>
                Rewritable
              </a>
            </li>
            <li className="w-full">
              <a
                className=" justify-center"
                onDragStart={(event) => onDragStart(event, "input")}
                onDragEnd={(event) => onDragEnd(event, "input")}
                draggable>
                TODO
              </a>
            </li>
            <li className="w-full">
              <a
                className=" justify-center"
                onDragStart={(event) => onDragStart(event, "input")}
                onDragEnd={(event) => onDragEnd(event, "input")}
                draggable>
                TODO
              </a>
            </li>

          </ul>
        </Tabs.RadioTab>
        <Tabs.RadioTab name="my_tabs_1" label="Расширенные" className="checked:bg-base-100 border">
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
