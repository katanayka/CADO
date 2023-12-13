import React, { memo } from "react";
import { Handle, Position } from "reactflow";
import { Textarea } from "react-daisyui";

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
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    data.text = newText;
  }

  const handleInsideChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    data.inside = newText;
  }

  return (
    <div className="border-solid border-2 rounded border-black p-4 column text-center bg-white" style={{ width: 192, height: 192 }}>
      <div>
        <strong>{data.text}</strong>
      </div>
      <input
        type="text"
        onChange={handleTextChange}
        className="nodrag input input-bordered w-full max-w-xs"
      />
      <Textarea
        onChange={handleInsideChange}
        className="nodrag input input-bordered w-full max-w-xs mt-2 h-5 overflow-y-auto resize-none"
      />
      <div
        className="absolute -bottom-3 z-20 left-1/2 transform -translate-x-1/2 w-6 h-6"
      >
      </div>
      <div
        className="absolute top-1/2 -right-3 z-20 transform -translate-y-1/2"
      >
      </div>
      <Handle id="top" type="target" position={Position.Top} className="" />
      <Handle id="left" type="target" position={Position.Left} className="" />
      <Handle id="right" type="source" position={Position.Right} className="" />
      <Handle id="bottom" type="source" position={Position.Bottom} className="" />
    </div>
  );
});

RewritableNode.displayName = "RewritableNodeRedact";

export default RewritableNode;
