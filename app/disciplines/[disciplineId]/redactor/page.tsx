"use client";
import GraphRedactor from "@/components/discipline/redactor/graph_redactor";
import Toolbar from "@/components/discipline/redactor/toolbar";
import { createContext, useCallback, useState } from "react";
import "reactflow/dist/style.css";
import { ReactFlowProvider, useNodesState } from "reactflow";

interface paramProps {
  disciplineId: string;
}

export const DisciplineContext = createContext("0");

export default function Page({ params }: { params: paramProps }) {

  //
  return (
    <div>
      <div className="content flex h-full min-h-screen w-screen">
        <Toolbar />
        <div className="about bg-orange-700 h-screen w-full">
          <div className="ourBlock h-full">
          <DisciplineContext.Provider value={params.disciplineId}>
            <GraphRedactor />
            </DisciplineContext.Provider>
          </div>
        </div>
      </div>
    </div>
  );
}
