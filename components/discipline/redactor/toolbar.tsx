export default function Toolbar({

}: {

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

  return (
    <div className="user h-full w-1/24">
      <ul className="menu rounded-box gap-2 items-center">
        <li>
          <a
            onDragStart={(event) => onDragStart(event, "input")}
            onDragEnd={(event) => onDragEnd(event, "input")}
            draggable
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </a>
        </li>
        <li>
            <a
            onDragStart={(event) => onDragStart(event, "Rewritable")}
            onDragEnd={(event) => onDragEnd(event, "Rewritable")}
            draggable>
                Rewritable
            </a>
        </li>
        <li>
            <a
            onDragStart={(event) => onDragStart(event, "input")}
            onDragEnd={(event) => onDragEnd(event, "input")}
            draggable>
                TODO
            </a>
        </li>
        <li>
            <a
            onDragStart={(event) => onDragStart(event, "input")}
            onDragEnd={(event) => onDragEnd(event, "input")}
            draggable>
                TODO
            </a>
        </li>
      </ul>
    </div>
  );
}
