// Добавьте import React, { memo, useCallback } from "react";
import React, { memo, useCallback } from "react";
import { Handle, Position } from "reactflow";

type Props = {
  data: {
    text: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onAddNode: () => void;  
  };
};

const RewritableNode: React.FC<Props> = memo(({ data }) => {
  const handleAddNode = useCallback(() => {
    console.log(data);
    data.onAddNode();
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
      />
      <button onClick={handleAddNode}>Add Node</button>
      <Handle type="target" position={Position.Right} />
      <Handle type="target" position={Position.Bottom} />
      <Handle type="target" position={Position.Right} />
      <Handle type="target" position={Position.Bottom} />
    </div>
  );
});

export default RewritableNode;
