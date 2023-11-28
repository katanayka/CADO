// Добавьте import React, { memo, useCallback } from "react";
import MySvg from "@/public/plus";
import React, { memo, useCallback, useState } from "react";
import { Handle, Position } from "reactflow";

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
    <div className="border-solid border-2 rounded border-black p-4 column text-center bg-white">
      <div>
        Custom Rewritable Node: <strong>{data.text}</strong>
      </div>
      <input
        type="text"
        onChange={data.onChange}
        defaultValue={data.text}
        className="nodrag input input-bordered w-full max-w-xs"
        disabled={true}
      />
      <Handle id="top" type="target" position={Position.Top} className="" />
      <Handle id="left" type="target" position={Position.Left} className="" />
      <Handle id="right" type="source" position={Position.Right} className="" />
      <Handle id="bottom" type="source" position={Position.Bottom} className="" />
    </div>
  );
});

export default RewritableNode;
