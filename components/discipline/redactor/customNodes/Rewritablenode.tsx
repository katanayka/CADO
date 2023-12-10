// Добавьте import React, { memo, useCallback } from "react";
import MySvg from "@/public/plus";
import React, { memo, useCallback, useState } from "react";
import { Handle, Position } from "reactflow";
import sizes_nodes from "@/public/sizes";

type Props = {
  data: {
    id: string
    parentId: string;
    text: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onAddNode: (position: { x: number; y: number }, id: string, posEdge: Boolean) => void;
    position: { x: number; y: number };
  };
};


const RewritableNode: React.FC<Props> = memo(({ data }) => {
  const [BottomPressed, setBottomPressed] = useState(false);
  const [RightPressed, setRightPressed] = useState(false);
  const handleAddNode = useCallback((offsetX: number, offsetY: number) => {
    console.log(data);
    const newPosition = { x: data.position.x + offsetX, y: data.position.y + offsetY };
    data.onAddNode(newPosition, data.id, offsetX > offsetY);
  }, [data]);

  return (
    <div className="border-solid border-2 rounded border-black p-4 column text-center bg-white" style={{ width: sizes_nodes.Rewritable.width, height: sizes_nodes.Rewritable.height }}>
      <div>
        Custom Rewritable Node: <strong>{data.text}</strong>
      </div>
      <input
        type="text"
        onChange={data.onChange}
        defaultValue={data.text}
        className="nodrag input input-bordered w-full max-w-xs"
      />
      <div
        className="absolute -bottom-3 z-20 left-1/2 transform -translate-x-1/2 w-6 h-6"
      >
        <button
          onClick={() => { 
            handleAddNode(0, 192); 
            setBottomPressed(prevState => !prevState); 
          }}
          className="" 
        >
          <MySvg />
        </button>
      </div>
      <div
        className="absolute top-1/2 -right-3 z-20 transform -translate-y-1/2"
      >
        <button
          onClick={() => { 
            handleAddNode(512, 0); 
            setRightPressed(prevState => !prevState); 
          }}
          className={RightPressed ? "hidden" : ""}
        >
          <MySvg />
        </button>
      </div>
      <Handle id="top" type="target" position={Position.Top} className="" />
      <Handle id="left" type="target" position={Position.Left} className="" />
      <Handle id="right" type="source" position={Position.Right} className="" />
      <Handle id="bottom" type="source" position={Position.Bottom} className="" />
    </div>
  );
});

export default RewritableNode;
