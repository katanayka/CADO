"use client";
import GraphRedactor from "@/components/discipline/redactor/graph_redactor";
import Toolbar from "@/components/discipline/redactor/toolbar";
import { useCallback, useState } from "react";
import "reactflow/dist/style.css";
import { ReactFlowProvider, useNodesState } from "reactflow";

interface paramProps {
  disciplineId: string;
}

export default function Page({ params }: { params: paramProps }) {

  //
  return (
    <div>
      <div className="content flex h-full min-h-screen w-screen">
        <Toolbar />
        <div className="about bg-orange-700 h-screen w-full">
          <div className="ourBlock h-full">
            <GraphRedactor />
          </div>
        </div>
      </div>
    </div>
  );
}
