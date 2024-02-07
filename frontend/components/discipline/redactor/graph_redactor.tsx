// GraphRedactor.tsx
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
  Position,
  Connection,
  useStoreApi,
} from "reactflow";
import RewritableNode from "./customNodes/redact/Rewritablenode";
import NodeVideo from "./customNodes/redact/NodeVideo";
import axios from "axios";
import { usePathname } from "next/navigation";

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

  interface TreeNode {
    name: string;
    description: string;
    isHard: boolean;
    type: string;
    children?: TreeNode[];
  }

  interface TreeInfo {
    parent: string | null;
    node: string;
    description: string;
    depth: number;
    isHard: boolean;
    type: string;
  }

  const tree: TreeNode = {
    name: "Python",
    description: "Описание по Python",
    isHard: true,
    type: "Rewritable",
    children: [
      {
        name: "Синтаксис",
        description: "Описание синтаксиса Python",
        isHard: false,
        type: "Rewritable",
        children: [
          {
            name: "Условные операторы",
            description: "Описание условных операторов",
            isHard: false,
            type: "Rewritable",
            children: [
              {
                name: "if",
                description: "Описание if-оператора",
                isHard: false,
                type: "Rewritable",
              },
              {
                name: "else",
                description: "Описание else-оператора",
                isHard: false,
                type: "Rewritable",
              },
              {
                name: "elif",
                description: "Описание elif-оператора",
                isHard: false,
                type: "Rewritable",
              },
            ],
          },
          {
            name: "Циклы",
            description: "Описание циклов",
            isHard: false,
            type: "Rewritable",
            children: [
              {
                name: "for",
                description: "Описание for-цикла",
                isHard: false,
                type: "Rewritable",
              },
              {
                name: "while",
                description: "Описание while-цикла",
                isHard: false,
                type: "Rewritable",
              },
            ],
          },
        ],
      },
      {
        name: "Классы",
        description: "Описание классов в Python",
        isHard: false,
        type: "Rewritable",
        children: [
          {
            name: "Определение класса",
            description: "Описание определения класса",
            isHard: false,
            type: "Rewritable",
          },
          {
            name: "Методы",
            description: "Описание методов класса",
            isHard: false,
            type: "Rewritable",
          },
          {
            name: "Наследование",
            description: "Описание наследования классов",
            isHard: false,
            type: "Rewritable",
          },
        ],
      },
      {
        name: "Функции",
        description: "Описание функций в Python",
        isHard: false,
        type: "Rewritable",
        children: [
          {
            name: "Определение функции",
            description: "Описание определения функции",
            isHard: false,
            type: "Rewritable",
          },
          {
            name: "Аргументы функции",
            description: "Описание аргументов функции",
            isHard: false,
            type: "Rewritable",
          },
          {
            name: "Возвращаемые значения",
            description: "Описание возвращаемых значений функции",
            isHard: false,
            type: "Rewritable",
          },
        ],
      },
    ],
  };

  function traverseTree(node: TreeNode, parent: string | null = null, depth: number = 0): TreeInfo[] {
    const result: TreeInfo[] = [
      {
        parent,
        node: node.name,
        description: node.description,
        depth,
        type: node.type,
        isHard: node.isHard
      },
    ];

    if (node.children) {
      for (const child of node.children) {
        result.push(...traverseTree(child, node.name, depth + 1));
      }
    }

    return result;
  }
  const fullTreeInfoArray: TreeInfo[] = traverseTree(tree);

  let treeInfoArray = JSON.parse(JSON.stringify(fullTreeInfoArray));
  console.log(treeInfoArray);
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

      treeInfoArray.length = 0;

      const treeElement = JSON.parse(type);
      treeInfoArray.push(treeElement);

      const firstElement = fullTreeInfoArray.findIndex(x => x.node === treeInfoArray[0].node);

      if (treeElement.depth !== -1) {
        for (let i = firstElement + 1; i < fullTreeInfoArray.length; i++) {
          if (fullTreeInfoArray[firstElement].depth >= fullTreeInfoArray[i].depth) break;
          treeInfoArray.push(JSON.parse(JSON.stringify(fullTreeInfoArray[i])));
        }
      }

      const minValue = Math.min(...treeInfoArray.map((item: { depth: any }) => item.depth));
      treeInfoArray.forEach((item: { depth: number }) => {
        item.depth -= minValue;
      });

      let indent = 1;
      let maxDepth = 0;

      treeInfoArray.forEach(function (treeInfo: { depth: number; }, index: number) {
        if (treeInfo.depth > maxDepth) {
          maxDepth = treeInfo.depth;
        }
        if (treeInfo.depth >= 0) {
          if (index > 0 && treeInfoArray[index - 1].depth >= treeInfo.depth) indent++;
        }
      });

      if (treeInfoArray[0].depth === 0 && !treeInfoArray[0].isHard || treeInfoArray.length === 1) {
        maxDepth++;
      }

      const pos = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY
      });

      const newNode = {
        id: getId() + "Group",
        position: pos,
        data: {
          isGroup: true
        },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        style: {
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          height: maxDepth * 256,
          width: indent * 256,
        },
      };

      indent = 0;
      let group = newNode.id;
      setNodes((nds) => nds.concat(newNode));

      interface Parent {
        name?: string;
        nodeId?: string;
        depth?: number;
      }

      let parent: Parent = {};
      let parents: Parent[] = [];

      treeInfoArray.forEach(function (treeInfo: { depth: number; isHard: any; type: any; node: string | undefined; parent: string | undefined; }, index: number) {
        if (treeInfo.depth > maxDepth) maxDepth = treeInfo.depth;

        if (treeInfo.isHard && treeInfo.depth === 0) {
          treeInfoArray.forEach((temp: { depth: number; }) => {
            temp.depth -= 1;
          });
          return;
        }

        if (treeInfo.depth >= 0) {
          if (index > 0 && treeInfoArray[index - 1].depth >= treeInfo.depth) indent ++;

          const position = ({
            x: 32 + indent * 256,
            y: 32 + treeInfo.depth * 256
          });

          const newNode = {
            id: getId(),
            type: treeInfo.type,
            position,
            data: {
              label: treeInfo.node,
              text: treeInfo.node
            },
            parentNode: group,
          };

          setNodes((nds) => nds.concat(newNode));

          parent = {
            name: treeInfo.node,
            nodeId: newNode.id,
            depth: treeInfo.depth
          };

          parents.push(parent);

          if (index > 0) {
            let foundParent = parents.find(parent => parent.name === treeInfo.parent);

            let newEdge = {
              id: `${foundParent?.nodeId}-${newNode.id}`,
              source: String(foundParent?.nodeId),
              target: newNode.id,
              sourceHandle: 'bottom',
              targetHandle: 'top',
              type: "step",
              style: {
                strokeWidth: 3,
                stroke: 'black',
              },
            };

            setEdges((eds) => eds.concat(newEdge));
          }

          if (treeInfo.depth === 0) {
            let foundParent = null;

            for (let i = index - 1; i >= 0; i--) {
              if (parents[i].depth === 0 && parents[i].name !== treeInfo.node) {
                foundParent = parents[i];
                break;
              }
            }

            if (foundParent) {
              let newEdge = {
                id: `${foundParent?.nodeId}-${newNode.id}`,
                source: String(foundParent?.nodeId),
                target: newNode.id,
                sourceHandle: 'right',
                targetHandle: 'left',
                type: "step",
                style: {
                  strokeWidth: 3,
                  stroke: 'black',
                },
              };

              setEdges((eds) => eds.concat(newEdge));
            }
          }
        }
      });

      treeInfoArray.forEach(function (treeInfo: { isHard: any; depth: number; }, _index: any) {
        if (treeInfo.isHard && treeInfo.depth === -1) {
          treeInfoArray.forEach((temp: { depth: number; }) => {
            temp.depth += 1;
          });
        }
      });

      treeInfoArray = JSON.parse(JSON.stringify(fullTreeInfoArray));
    },
    [reactFlowInstance]
  );

  const save = async () => {
    const data = {
      disciplineId: disciplineId,
      nodes: nodes,
      edges: edges
    }
    try {
      await axios.post(`/api/discipline/save`, data)
    } catch (error) {
      console.log(`Ошибка сохранения ${error}`);
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
    setSharedData(treeInfoArray)
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
      snapGrid={[256, 256]}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onInit={setReactFlowInstance}
      onConnect={onConnect}
    >
      <Background />
      <Controls />
      <button
        className="absolute bottom-0 z-20 left-1/2 transform -translate-x-1/2 px-12 py-1 border-solid border-2 border-sky-500 rounded-lg cursor-pointer"
        onClick={isOnElementsPage ? save_complex : save}
      >
        Save
      </button>
    </ReactFlow>
  );
};

export default GraphRedactor;
