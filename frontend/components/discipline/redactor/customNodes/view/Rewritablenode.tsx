// Добавьте import React, { memo, useCallback } from "react";
import React, { memo } from "react";
import { Textarea } from "react-daisyui";
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
    return (
      <div className="border-solid border-2 rounded border-black p-4 column text-center bg-white" style={{ width: 192, height: 192 }}>
        <div>
          <strong>{data.text}</strong>
        </div>
        <Textarea
          defaultValue={data.inside}
          className="nodrag input input-bordered w-full max-w-xs mt-2 h-60 overflow-y-auto resize-none" style={{height:120}}
          readOnly={true}
        />
        <Handle id="top" type="target" position={Position.Top} className="" />
        <Handle id="left" type="target" position={Position.Left} className="" />
        <Handle id="right" type="source" position={Position.Right} className="" />
        <Handle id="bottom" type="source" position={Position.Bottom} className="" />
      </div>
    );
});

RewritableNode.displayName = "RewritableNode";

export default RewritableNode;
