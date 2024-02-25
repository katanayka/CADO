import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactFlow, {
  useEdgesState,
  updateEdge,
  addEdge,
  Controls,
  Background,
  Node,
  Edge,
  useNodesState,
  Connection,
  useStoreApi,
} from "reactflow";
import RewritableNode from "./customNodes/redact/Rewritablenode";
import NodeVideo from "./customNodes/redact/NodeVideo";
import { Tree } from "@/services/treeSctructure";
import axios from "axios";
import { usePathname } from "next/navigation";
import { ImSpinner9 } from "react-icons/im";

interface ReactFlowInstance {
  screenToFlowPosition: (position: { x: number; y: number }) => {
    x: number;
    y: number;
  };
}

const nodeTypes = {
  Rewritable: RewritableNode,
  VideoN: NodeVideo,
};

const MIN_DISTANCE = 392

const GraphRedactor = ({ setSharedData }: { setSharedData: any }) => {
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);
  const edgeUpdateSuccessful = useRef(true);
  const store = useStoreApi();

  const getClosestEdge = useCallback((node: { id: string; parentNode: string; positionAbsolute: { x: number; y: number; }; }) => {
    const { nodeInternals } = store.getState();
    const storeNodes = Array.from(nodeInternals.values());
    let dy = 0;
    let dx = 0;
    const closestNode = storeNodes.reduce(
      (res, n) => {
        if (n.id !== node.id && n.positionAbsolute && n.parentNode != node.parentNode && !n.id.includes("Group") && !node.id.includes("Group")) {
          dx = (n.positionAbsolute.x ?? 0) - (node.positionAbsolute?.x ?? 0);
          dy = (n.positionAbsolute.y ?? 0) - (node.positionAbsolute?.y ?? 0);
          const d = Math.sqrt(dx * dx + dy * dy);

          if (d < res.distance && d < MIN_DISTANCE) {
            res.distance = d;
            res.node = n as { id: string; parentNode: string; positionAbsolute: { x: number; y: number } };
          }
        }
        return res;
      },
      {
        distance: Number.MAX_VALUE,
        node: { id: "", parentNode: "", positionAbsolute: { x: 0, y: 0 } },
      },
    );

    if (!closestNode.node) {
      return null;
    }
    let closeNodeIsSource = true;
    dx = Math.abs(closestNode.node.positionAbsolute.x - node.positionAbsolute.x);
    dy = Math.abs(closestNode.node.positionAbsolute.y - node.positionAbsolute.y);
    closeNodeIsSource = (dx > dy ? (closestNode.node.positionAbsolute.x < node.positionAbsolute.x) : (closestNode.node.positionAbsolute.y < node.positionAbsolute.y));

    return {
      id: closeNodeIsSource
        ? `${closestNode.node.id}-${node.id}` + getId()
        : `${node.id}-${closestNode.node.id}` + getId(),
      source: closeNodeIsSource ? closestNode.node.id : node.id,
      target: closeNodeIsSource ? node.id : closestNode.node.id,
      sourceHandle: dx > dy
        ? 'right'
        : 'bottom',
      targetHandle: dx > dy
        ? 'left'
        : 'top',
      className: 'temp',
      type: "step",
      style: {
        strokeWidth: 3,
        stroke: 'black',
      },
    };
  }, []);

  const initialNodes: Node<any, string | undefined>[] = [];
  const initialEdges: Edge<any>[] = [];
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [loading, setLoading] = useState(false);

  const onEdgeUpdateStart = useCallback(() => {
    edgeUpdateSuccessful.current = false;
  }, []);

  const onEdgeUpdate = useCallback(
    (oldEdge: Edge, newConnection: Connection) => { edgeUpdateSuccessful.current = true; setEdges((els) => updateEdge(oldEdge, newConnection, els)) },
    []
  );

  const onEdgeUpdateEnd = useCallback((_: any, edge: { id: string; }) => {
    if (!edgeUpdateSuccessful.current) {
      setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    }
    edgeUpdateSuccessful.current = true;
  }, [])

  const onConnect = useCallback((params: Connection | Edge) => setEdges((els) => addEdge(params, els)), []);

  const router = usePathname();
  const isOnElementsPage = router.includes("/elements");
  const disciplineId = router.split("/")[2];
  console.log("DISCIPLINE ID", disciplineId)
  let id = 0;
  const getId = () => `dndnode_${id++}`;

  const onNodeDrag = useCallback(
    (_: any, node: any) => {
      console.log(getClosestEdge(node), "ASD")
      const closeEdge = getClosestEdge(node);
      if (!node.data.isGroup)
        setEdges((es) => {
          const nextEdges = es.filter((e) => e.className !== 'temp');

          if (
            closeEdge &&
            !nextEdges.find(
              (ne) =>
                ne.source === closeEdge.source && ne.target === closeEdge.target,
            )
          ) {
            closeEdge.className = 'temp';
            nextEdges.push(closeEdge);
          }

          return nextEdges;
        });
    },
    [getClosestEdge, setEdges],
  );

  const onNodeDragStop = useCallback(
    (_: any, node: any) => {
      const closeEdge = getClosestEdge(node);
      if (!node.data.isGroup)
        setEdges((es) => {
          const nextEdges = es.filter((e) => e.className !== 'temp');

          if (
            closeEdge &&
            !nextEdges.find(
              (ne) =>
                ne.source === closeEdge.source && ne.target === closeEdge.target,
            )
          ) {
            nextEdges.push(closeEdge);
          }

          return nextEdges;
        });
    },
    [getClosestEdge],
  );

  const onDragOver = useCallback(
    (event: {
      preventDefault: () => void;
      dataTransfer: { dropEffect: string };
    }) => {
      console.log("ELEMENT HOLD")
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
    },
    []
  );
  const fullTreeInfoArray: Tree<string> = new Tree<string>();
  fullTreeInfoArray.addNode("Python", "Описание по Python");
  fullTreeInfoArray.addNode("Синтаксис", "Описание синтаксиса Python", "Python");
  fullTreeInfoArray.addNode("Условные операторы", "Описание условных операторов", "Синтаксис");
  fullTreeInfoArray.addNode("if", "Описание if-оператора", "Условные операторы");
  fullTreeInfoArray.addNode("else", "Описание else-оператора", "Условные операторы");
  fullTreeInfoArray.addNode("elif", "Описание elif-оператора", "Условные операторы");
  fullTreeInfoArray.addNode("Циклы", "Описание циклов", "Синтаксис");
  fullTreeInfoArray.addNode("for", "Описание for-цикла", "Циклы");
  fullTreeInfoArray.addNode("while", "Описание while-цикла", "Циклы");
  fullTreeInfoArray.addNode("Классы", "Описание классов в Python", "Python");
  fullTreeInfoArray.addNode("Определение класса", "Описание определения класса", "Классы");
  fullTreeInfoArray.addNode("Методы", "Описание методов класса", "Классы");
  fullTreeInfoArray.addNode("Наследование", "Описание наследования классов", "Классы");
  fullTreeInfoArray.addNode("Функции", "Описание функций в Python", "Python");
  fullTreeInfoArray.addNode("Определение функции", "Описание определения функции", "Функции");
  fullTreeInfoArray.addNode("Аргументы функции", "Описание аргументов функции", "Функции");
  fullTreeInfoArray.addNode("Возвращаемые значения", "Описание возвращаемых значений функции", "Функции");

  console.log(fullTreeInfoArray);


  const onDrop = useCallback(
    (event: {
      preventDefault: () => void;
      dataTransfer: { getData: (arg0: string) => any };
      clientX: any;
      clientY: any;
    }) => {
      event.preventDefault();
      const type = event.dataTransfer.getData("application/reactflow");
      if (!type || reactFlowInstance === null) {
        return;
      }
      const data = JSON.parse(type);
      const startPos = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY
      });
      console.log(data, "DATA")
      const rootNode = fullTreeInfoArray.findNodeById(fullTreeInfoArray.root, data.id)
      if (!rootNode) {
        return;
      }
      let flowNodes: { id: string; type: any; position: { x: number; y: number; }; data: { label: string; text: string }; }[] = [];
      let flowEdges: { id: string; source: string; target: string; animated: boolean; }[] = [];
      const flextree = require('d3-flextree').flextree;
      const layout = flextree();
      const hierarchy = fullTreeInfoArray.getHierarchy(rootNode);
      const tree = layout.hierarchy(hierarchy);
      layout(tree);
      console.log(tree.descendants(), "HIERARCHY")
      // Foreach element in tree.descendants() we need to create a property for current element id
      tree.descendants().forEach((element: {
        data: {
          input_data: {
            id_context: string; id: string;
          };
        };
      }, index: any) => {
        element.data.input_data.id_context = `${element.data.input_data.id}-${index}`+getId();
      });
      for (const element of tree.descendants()) {
        flowNodes.push({
          id: element.data.input_data.id_context,
          type: element.data.input_data.type,
          position: {
            x: element.x + startPos.x,
            y: element.y + startPos.y
          },
          data: {
            label: element.data.input_data.id,
            text: element.data.input_data.id,
          },
        });
      }
      console.log(flowNodes, "FLOW NODES")
      for (const element of tree.descendants()) {
        if (element.children) {
          for (const child of element.children) {
            flowEdges.push({
              id: `${element.data.input_data.id}-${child.data.input_data.id}` + getId(),
              source: element.data.input_data.id_context,
              target: child.data.input_data.id_context,
              animated: true
            });
          }
        }
      }
      console.log(flowEdges, "FLOW EDGES")
      setNodes((ns) => [...ns, ...flowNodes]);
      setEdges((es) => [...es, ...flowEdges]);
    }, [reactFlowInstance]
  );

  const save = async () => {
    setLoading(true);
    const data = {
      disciplineId: disciplineId,
      nodes: nodes,
      edges: edges
    }
    try {
      await axios.post(`/api/discipline/save`, data)
    } catch (error) {
      console.log(`Ошибка сохранения ${error}`);
    } finally {
      setLoading(false);
    }
  }

  const save_complex = async () => {
    const data = {
      disciplineId: disciplineId,
      nodes: nodes,
      edges: edges
    }
    try {
      await axios.post(`/api/discipline/saveComplex`, data)
    } catch (error) {
      console.log(`Ошибка сохранения ${error}`);
    }
  }

  useEffect(() => {
    setSharedData(fullTreeInfoArray);
  }, [])

  return (
    <ReactFlow
      nodes={nodes}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      onNodeDrag={onNodeDrag}
      onNodeDragStop={onNodeDragStop}
      edges={edges}
      onEdgesChange={onEdgesChange}
      onEdgeUpdate={onEdgeUpdate}
      onEdgeUpdateStart={onEdgeUpdateStart}
      onEdgeUpdateEnd={onEdgeUpdateEnd}
      className="z-10"
      snapToGrid={true}
      snapGrid={[16, 16]}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onInit={setReactFlowInstance}
      onConnect={onConnect}
    >
      <Background />
      <Controls />
      <button
        className="absolute bottom-0 z-20 left-1/2 transform -translate-x-1/2 px-12 py-1 border-solid border-2 border-sky-500 rounded-lg cursor-pointer no-animation translate"
        onClick={isOnElementsPage ? save_complex : save}
      >
        {loading ? <ImSpinner9 size={24} className="animate-spin" /> : "Save"}
      </button>
    </ReactFlow>
  );
};

export default GraphRedactor;
