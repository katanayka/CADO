import React from "react";
import { Handle, Position } from "reactflow";
import { useDispatch } from "react-redux";
import { setSelectedNode } from "@/services/selectedNodeSlice";
import { setSelectedNodeToHide } from "@/services/selectedNodeToHide";

type Props = {
  data: {
    id: string
    parentId: string;
    text: string;
    inside: string;
    hide: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onAddNode: (position: { x: number; y: number }, id: string, posEdge: boolean) => void;
    position: { x: number; y: number };
  };
  id: string;
};


const RewritableNode: React.FC<Props> = (({ data, id }) => {
  const dispatch = useDispatch();
  data.hide = false;
  return (
    <div className="border-solid border-2 rounded border-black p-4 column text-center bg-white" style={{ width: 192 }}>
      <div>
        <strong>{data.text}</strong>
      </div>
      <button
        className="btn btn-ghost bg-black text-white"
        onClick={() => {
          if (!data.id) {
            data.id = id
          }
          dispatch(setSelectedNode(data))
        }}
      >
        <div>
          <strong>{"Редактировать"}</strong>
        </div>
      </button>
      <button
        className="btn btn-ghost bg-black text-white"
        onClick={() => {
          const updatedData = { ...data };
          if (!updatedData.id) {
            updatedData.id = id;
          }
          updatedData.hide = !updatedData.hide;
          dispatch(setSelectedNodeToHide(updatedData));
        
        }}
      >
        <div>
          <strong>{"Скрыть/показать потомков"}</strong>
        </div>
      </button>

      <Handle id="top" type="target" position={Position.Top} className="" />
      <div
        className="absolute -bottom-3 z-20 left-1/2 transform -translate-x-1/2 w-6 h-6"
      >
      </div>
      <div
        className="absolute top-1/2 -right-3 z-20 transform -translate-y-1/2"
      >
      </div>
      <Handle id="top" type="target" position={Position.Top} className="" />
      <Handle id="bottom" type="source" position={Position.Bottom} className="" />
    </div>
  );
});

RewritableNode.displayName = "RewritableNodeRedact";

export default RewritableNode;
