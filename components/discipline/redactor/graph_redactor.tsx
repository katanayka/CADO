import React, { useCallback, useState } from "react";
import ReactFlow, {
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  Node,
  NodeChange,
  EdgeChange,
  Edge,
} from "reactflow";
import { FC } from "react";

import "reactflow/dist/style.css";
import RewritableNode from "./customNodes/Rewritablenode";

interface ReactFlowInstance {
  screenToFlowPosition: (position: { x: number; y: number }) => {
    x: number;
    y: number;
  };
}

interface GraphRedactorProps {
  nodes_i: Node[];
  edges_i: Edge[];
}

const nodeTypes = {
	Rewritable: RewritableNode,
};

const GraphRedactor: FC<GraphRedactorProps> = ({ nodes_i, edges_i }) => {
  const [nodes, setNodes] = useState(nodes_i);
  const [edges, setEdges] = useState(edges_i);
  let id = 0;
  const getId = () => `dndnode_${id++}`;

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds: Node<any>[]) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds: Edge<any>[]) => applyEdgeChanges(changes, eds)),
    []
  );
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);

  const onDragOver = useCallback(
    (event: {
      preventDefault: () => void;
      dataTransfer: { dropEffect: string };
    }) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
    },
    []
  );

  const onDrop = useCallback(
    (event: {
      preventDefault: () => void;
      dataTransfer: { getData: (arg0: string) => any };
      clientX: any;
      clientY: any;
    }) => {
      event.preventDefault();
      const type = event.dataTransfer.getData("application/reactflow");
      if (typeof type === "undefined" || !type || reactFlowInstance === null) {
        console.log("RETURN");
        console.log(typeof type);
        console.log(reactFlowInstance);
        return;
      }
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${type} node` },
      };

      console.log(position);
      console.log(newNode);
      // Append new node
      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );
  return (
    <ReactFlow
      nodes={nodes}
      onNodesChange={onNodesChange}
      edges={edges}
      onEdgesChange={onEdgesChange}
      className="z-10"
      snapToGrid={true}
      snapGrid={[32, 32]}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onInit={setReactFlowInstance}
	  nodeTypes={nodeTypes}
    >
      <Background />
      <Controls />
    </ReactFlow>
  );
};

export default GraphRedactor;
