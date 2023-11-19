// GraphRedactor.tsx
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
  useNodesState
} from "reactflow";
import { FC } from "react";
import RewritableNode from "./customNodes/Rewritablenode";
import { randomInt } from "crypto";


interface ReactFlowInstance {
  screenToFlowPosition: (position: { x: number; y: number }) => {
    x: number;
    y: number;
  };
}


const nodeTypes = {
  Rewritable: RewritableNode, 
};

const GraphRedactor = () => {
  const handleAddNode = () => {
    console.log("Add Node clicked");

    const newNode = {
      id: getId(),
      type: 'Rewritable', // тип вашей ноды
      data: { 
        label: 'New Node', 
        onAddNode: handleAddNode
      },
      position: { x: 0, y: 0 },
    };
    
    setNodes((nds) => nds.concat(newNode));
  };

  const initialNodes = [
    {
      id: "1",
      type: "Rewritable",
      data: { 
        label: "First node",
        onAddNode: handleAddNode
       },
      position: { x: 250, y: 5 },
    },
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges] = useState<Edge<any>[]>([]);
  let id = 0;
  const getId = () => `dndnode_${id++}`;
  const [elements, setElements] = useState([...nodes, ...edges]);

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
        data: { 
          label: `${type} __node`,
          onAddNode: handleAddNode
        },
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
