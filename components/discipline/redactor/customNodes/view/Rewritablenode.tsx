// Добавьте import React, { memo, useCallback } from "react";
import MySvg from "@/public/plus";
import React, { memo, useCallback, useState } from "react";
import { Textarea } from "react-daisyui";
import { Handle, Position } from "reactflow";

type Props = {
  data: {
    id: string
    parentId: string;
    text: string;
    inside: string;
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
  {/*<div className="border-solid border-2 rounded border-black p-2 column text-center bg-white">*/}
    return (
      <div className="border-solid border-2 rounded border-black p-4 column text-center bg-white" style={{ width: 320, height: 320 }}>
        <div>
          <strong>{data.text}</strong>
        </div>
        <Textarea
          defaultValue={data.inside}
          className="nodrag input input-bordered w-full max-w-xs mt-2 h-60 overflow-y-auto resize-none"
          readOnly={true}
        />

        <Handle id="top" type="target" position={Position.Top} className="" />
        <Handle id="left" type="target" position={Position.Left} className="" />
        <Handle id="right" type="source" position={Position.Right} className="" />
        <Handle id="bottom" type="source" position={Position.Bottom} className="" />
      </div>
    );
});

export default RewritableNode;
