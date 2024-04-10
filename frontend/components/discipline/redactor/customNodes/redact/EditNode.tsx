import React from "react";
import { Handle, Position } from "reactflow";
import { useDispatch } from "react-redux";
import { setSelectedNode } from "@/services/selectedNodeSlice";

type Props = {
  data: {
    id: string
    parentId: string;
    text: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onAddNode: (position: { x: number; y: number }, id: string, posEdge: boolean) => void;
    position: { x: number; y: number };
  };
  id: string;
};


const RewritableNode: React.FC<Props> = (({ data, id }) => {
  const dispatch = useDispatch();

  return (
    <div className="border-solid border-2 rounded border-black p-4 column text-center bg-white" style={{ width: 192 }}>
      <button
      className="editbtn btn-ghost bg-black text-white"
      >
        <div>
          <strong>{"Редактировать содержимое темы"}</strong>
        </div>
      </button>
      <Handle id="top" type="target" position={Position.Top} className="" />
    </div>
  );
});

RewritableNode.displayName = "RewritableNodeRedact";

export default RewritableNode;
