// Добавьте import React, { memo, useCallback } from "react";
import React, { memo, useCallback } from "react";
import { Handle, Position } from "reactflow";
import { useDispatch } from 'react-redux';
import { setSelectNodeInfo } from "@/services/selectedNodeInfo";

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
  const dispatch = useDispatch();
  const handleShow = useCallback(() => {
    dispatch(setSelectNodeInfo(data));
    console.log(data);
  }, []);
  return (
    <button className="border-solid border-2 rounded border-black p-4 pb-8 column text-center bg-white overflow-hidden" style={{ width: 192 }} onClick={() => handleShow()}>
      <div>
        <strong>{data.text}</strong>
      </div>
      <Handle id="top" type="target" position={Position.Top} className="" />
      <Handle id="left" type="target" position={Position.Left} className="" />
      <Handle id="right" type="source" position={Position.Right} className="" />
      <Handle id="bottom" type="source" position={Position.Bottom} className="" />
    </button>
  );
});

RewritableNode.displayName = "RewritableNode";

export default RewritableNode;