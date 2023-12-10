// GraphRedactor.tsx
import React, { useCallback, useContext, useEffect, useState } from "react";
import ReactFlow, {
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  Node,
  NodeChange,
  EdgeChange,
  Edge,
  useNodesState,
  Position
} from "reactflow";
import { FC } from "react";
import RewritableNode from "./customNodes/Rewritablenode";
import { randomInt } from "crypto";
import axios from "axios";
import { DisciplineContext } from "@/app/disciplines/[disciplineId]/redactor/page";
import sizes_nodes from "@/public/sizes";


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
  const getBrothers = (node: Node<any>, nodesL: Node<any>[]) => {
    console.log("NODE - ", node);
    const parentId = node.data.parentId;
    console.log("PARENT",parentId);
    console.log("NODES", nodes)
    const brothers = nodes.filter(nd => nd.data.parentId == parentId);
    return brothers;
  }
  const handleAddNode = (position: { x: number; y: number }, parentId: string, posEdge: Boolean) => {
    const id = getId();
    console.log(id, parentId);
    const newNode = {
      id: id,
      type: 'Rewritable',
      data: {
        id: id,
        label: 'new node',
        parentId: parentId,
        onAddNode: handleAddNode,
        position
      },
      position: position,
    };
    console.log("BROTHERS", getBrothers(newNode, nodes));
    setNodes((nds) => nds.concat(newNode));
    let newEdge = {
      id: `${parentId}-${id}`,
      source: parentId,
      target: id,
      sourceHandle: '',
      targetHandle: '',
      type: "step",
      style: {
        strokeWidth: 3,
        stroke: 'black',
      },
    }
    if (posEdge) {
      newEdge.sourceHandle = 'right'
      newEdge.targetHandle = 'left'
    } else {
      newEdge.sourceHandle = 'bottom'
      newEdge.targetHandle = 'top'
    }
    console.log(newEdge);
    setEdges((eds) => eds.concat(newEdge));
  };

  const position = { x: 256, y: 0 };
  const initialNodes = [
    {
      id: "0_0",
      type: "Rewritable",
      data: {
        id: "0_0",
        label: "First node",
        parentId: "0_0",
        onAddNode: handleAddNode,
        position: position
      },
      position: position,
    },
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges] = useState<Edge<any>[]>([]);
  const disciplineId = useContext(DisciplineContext);
  let id = 0;
  const getId = () => `dndnode_${id++}`;

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
  const save = async () => {
    const data = {
      disciplineId: disciplineId,
      nodes: nodes,
      edges: edges
    }
    console.log(data)
    try {
      const response = await axios.post(`/api/discipline/save`, data)
      console.log(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const format_nodes = (nodes: Node<any>[], edges: Edge<any>[]) => {
    // Iterate over tree and get width of each level - then get max width
    let max_width = 0;
    let cur_nodes = nodes.filter(node => node.position.y == 0);
  }

  

  
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
      <a
        className="absolute bottom-3 z-20 left-1/2 transform -translate-x-1/2 px-12 py-1 border-solid border-2 border-sky-500 rounded-lg cursor-pointer"
        onClick={save}
      >
        Save
      </a>
    </ReactFlow>
  );
};

export default GraphRedactor;
