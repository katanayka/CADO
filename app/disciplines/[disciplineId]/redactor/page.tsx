"use client";
import GraphRedactor from "@/components/discipline/redactor/graph_redactor";
import Toolbar from "@/components/discipline/redactor/toolbar";
import { useCallback, useState } from "react";
import "reactflow/dist/style.css";
import { ReactFlowProvider, useNodesState } from "reactflow";

interface paramProps {
  disciplineId: string;
}

const initialNodes = [
  {
    id: "1",
    type: "input",
    data: { label: "input node" },
    position: { x: 250, y: 5 },
  },
];

export default function Page({ params }: { params: paramProps }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges] = useState([]);

  //
  return (
    <div>
      <div className="content flex h-full min-h-screen w-screen">
        <Toolbar />
        <div className="about bg-orange-700 h-screen w-full">
          <div className="ourBlock h-full">
            <GraphRedactor nodes_i={nodes} edges_i={edges} />
          </div>
        </div>
      </div>
    </div>
  );
}
