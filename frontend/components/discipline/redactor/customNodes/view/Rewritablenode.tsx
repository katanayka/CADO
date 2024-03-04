// Добавьте import React, { memo, useCallback } from "react";
import React, { memo, useCallback } from "react";
import { Handle, Position } from "reactflow";

type Props = {
  data: {
    id: string
    parentId: string;
    text: string;
    inside: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onAddNode: (position: { x: number; y: number }, id: string, posEdge: boolean) => void;
    position: { x: number; y: number };
  };
};


const RewritableNode: React.FC<Props> = memo(({ data }) => {
  const handleShow = useCallback(() => {
    
  }, []);
  return (
    <button className="border-solid border-2 rounded border-black p-4 pb-8 column text-center bg-white overflow-hidden" style={{ width: 192, height: 32 }} onClick={() => handleShow()}>
      <div className="text-xs max-h-6 overflow-hidden flex justify-center items-center">
        <strong>{data.text}</strong>
      </div>
      {/* <Textarea
        defaultValue={data.inside}
        className="nodrag input input-bordered w-full mt-2 max-h-60 overflow-y-auto resize-none p-0"
        style={{ height: 120, overflow: 'auto' }}
        readOnly={true}
      /> */}
      <Handle id="top" type="target" position={Position.Top} className="" />
      <Handle id="left" type="target" position={Position.Left} className="" />
      <Handle id="right" type="source" position={Position.Right} className="" />
      <Handle id="bottom" type="source" position={Position.Bottom} className="" />
    </button>
  );
});

RewritableNode.displayName = "RewritableNode";

export default RewritableNode;