// GraphRedactor.tsx
import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactFlow, {
  useEdgesState,
  updateEdge,
  addEdge,
  Controls,
  Background,
  Node,
  NodeChange,
  EdgeChange,
  Edge,
  useNodesState,
  Position,
  useReactFlow,
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

const MIN_DISTANCE = 384


const GraphRedactor = ({ setSharedData }: { setSharedData: any }) => {
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);

  const [reactFlow, setReactFlow] = useState(useReactFlow());
  const edgeUpdateSuccessful = useRef(true);
  const store = useStoreApi();

  const getClosestEdge = useCallback((node: { id: string; parentNode: string; positionAbsolute: { x: number; y: number; }; }) => {
    const { nodeInternals } = store.getState();
    const storeNodes = Array.from(nodeInternals.values());
    let dy = 0;
    let dx = 0;
    const closestNode = storeNodes.reduce(
      (res, n) => {
        if (n.id !== node.id && n.positionAbsolute && n.parentNode != node.parentNode && !n.id.includes("Group") && !node.id.includes("Group") ) {
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
        node: { id: "", parentNode: "",positionAbsolute: { x: 0, y: 0 } },
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
        ? `${closestNode.node.id}-${node.id}`
        : `${node.id}-${closestNode.node.id}`,
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

  const getBrothers = (parentId: string) => {
    const allNodes = reactFlow.getNodes()
    const brothers = allNodes.filter(node => node.data.parentId == parentId)
    return brothers
  }
  const handleAddNode = (_position: { x: number; y: number }, _parentId: string, _posEdge: Boolean) => {
    // const id = getId();
    // console.log(id, parentId);
    // const newNode = {
    //   id: id,
    //   type: 'Rewritable',
    //   data: {
    //     id: id,
    //     label: 'new node',
    //     parentId: parentId,
    //     onAddNode: handleAddNode,
    //     position
    //   },
    //   position: position,
    // };
    // setNodes((nds) => nds.concat(newNode));
    // let newEdge = {
    //   id: `${parentId}-${id}`,
    //   source: parentId,
    //   target: id,
    //   sourceHandle: '',
    //   targetHandle: '',
    //   type: "step",
    //   style: {
    //     strokeWidth: 3,
    //     stroke: 'black',
    //   },
    // }
    // if (posEdge) {
    //   newEdge.sourceHandle = 'right'
    //   newEdge.targetHandle = 'left'
    // } else {
    //   newEdge.sourceHandle = 'bottom'
    //   newEdge.targetHandle = 'top'
    // }
    // console.log(newEdge);
    // setEdges((eds) => eds.concat(newEdge));
  };

  // useEffect(() => {
  //   // Format nodes positions
  //   if (reactFlow.getNodes().length == 1) {
  //     return
  //   }
  //   console.log("START FORMAT")
  //   const rfNodes = reactFlow.getNodes()
  //   console.log(rfNodes)
  //   let sortedParents: string[] = [];
  //   rfNodes.forEach(node => {
  //     const parentId = node['data']['parentId']
  //     if (parentId == "") {

  //     } else {
  //       if (!sortedParents.includes(parentId)) {
  //         sortedParents.push(parentId)
  //         const brothers = getBrothers(parentId)
  //         let start_x = 99999999.0
  //         let start_y = 99999999.0
  //         let width: number[] = []
  //         let height: number[] = []
  //         brothers.forEach((brother) => {
  //           const size = {
  //             width: brother?.width,
  //             height: brother?.height,
  //           };
  //           const position = {
  //             x: brother?.position?.x,
  //             y: brother?.position?.y,
  //           };
  //           if (size?.width && size?.height && position?.x && position?.y) {
  //             if (position.x < start_x) {
  //               start_x = position.x;
  //             }
  //             if (position.y < start_y) {
  //               start_y = position.y;
  //             }
  //             width.push(size.width);
  //             height.push(size.height);
  //           }
  //         });
  //         let startPos = reactFlow.flowToScreenPosition({ x: start_x, y: start_y })
  //         console.log(startPos, "START POS")
  //         console.log(width, "WIDTH")
  //         console.log(height, "HEIGHT")
  //         // Sort brothers via position x
  //         brothers.sort((a, b) => a.position.x - b.position.x);
  //         console.log(brothers)
  //         // Start position fit
  //         for (let i = 0; i < brothers.length; i++) {
  //           console.log(i)
  //           let new_node = brothers[i]
  //           let new_x = reactFlow.getNode(parentId)?.position.x || 0
  //           console.log(new_x, "NEW X VALUE START")
  //           for (let j = 0; j < i; j++) {
  //             let prev_node = brothers[j]
  //             new_x += (prev_node?.width || 0) + 32
  //           }
  //           console.log(new_x, "NEW X VALUE")
  //           if (!(brothers[i].position.y == reactFlow.getNode(parentId)?.position.y)) {
  //             console.log(i, "Changed pos")
  //             brothers[i].position.x = new_x
  //           }
  //           // reactFlow.getNode(new_node.id)?.position?.x = new_x;
  //           // reactFlow.getNode(new_node.id)?.position?.y = new_y;
  //         }
  //         console.log(brothers)
  //         console.log("Sorted parents: ", sortedParents)
  //       }
  //     }
  //   })
  //   console.log(sortedParents)
  // }, [reactFlow.getNodes()])

  const initialNodes: Node<any, string | undefined>[] = [
    // {
    //   id: "0_0",
    //   type: "Rewritable",
    //   data: {
    //     id: "0_0",
    //     label: "First node",
    //     parentId: "",
    //     onAddNode: handleAddNode,
    //     position: position
    //   },
    //   position: position,

    // },
    // {
    //   id: "1_0",
    //   type: "VideoN",
    //   data: {
    //     id: "1_0",
    //     label: "Second node",
    //     parentId: "",
    //     onAddNode: handleAddNode,
    //     position: { x: position.x + 200, y: position.y * 2 }
    //   },
    //   position: { x: position.x + 400, y: position.y * 2 },
    // },
  ];
  const initialEdges: Edge<any>[] = [
    //   {
    //   id: '0_0-1_0',
    //   source: '0_0',
    //   target: '1_0',
    // },
  ];
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

  // const onEdgesChange = useCallback(
  //   (changes: EdgeChange[]) =>
  //     setEdges((eds: Edge<any>[]) => applyEdgeChanges(changes, eds)),
  //   []
  // );


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

      let indent = 0;
      let maxDepth = 0;

      interface Papa {
        name?: string;
        nodeId?: string;
        depth?: number;
      }

      let papa: Papa = {};
      let papas: Papa[] = [];

      treeInfoArray.forEach(function (treeInfo: { depth: number; }, index: number) {
        if (treeInfo.depth > maxDepth) {
          maxDepth = treeInfo.depth;
        }

        if (treeInfo.depth >= 0) {
          if (index > 0 && treeInfoArray[index - 1].depth >= treeInfo.depth) indent += 256;
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
          isGroup: true,
          onAddNode: handleAddNode
        },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        style: {
          backgroundColor: 'rgba(255, 0, 255, 0.2)',
          height: maxDepth * 256,
          width: indent + 256,
        },
      };

      indent = 0;
      let daddy = newNode.id;
      setNodes((nds) => nds.concat(newNode));

      treeInfoArray.forEach(function (treeInfo: { depth: number; isHard: any; type: any; node: string | undefined; parent: string | undefined; }, index: number) {
        if (treeInfo.depth > maxDepth) maxDepth = treeInfo.depth;

        if (treeInfo.isHard && treeInfo.depth === 0) {
          treeInfoArray.forEach((temp: { depth: number; }) => {
            temp.depth -= 1;
          });
          return;
        }

        if (treeInfo.depth >= 0) {
          if (index > 0 && treeInfoArray[index - 1].depth >= treeInfo.depth) indent += 256;

          const position = ({
            x: 32 + indent,
            y: 32 + treeInfo.depth * 256
          });

          const newNode = {
            id: getId(),
            type: treeInfo.type,
            position,
            data: {
              label: treeInfo.node,
              text: treeInfo.node,
              onAddNode: handleAddNode
            },
            parentNode: daddy,
          };

          setNodes((nds) => nds.concat(newNode));

          papa = {
            name: treeInfo.node,
            nodeId: newNode.id,
            depth: treeInfo.depth
          };

          papas.push(papa);


          if (index > 0) {
            let foundPapa = papas.find(papa => papa.name === treeInfo.parent);

            let newEdge = {
              id: `${foundPapa?.nodeId}-${newNode.id}`,
              source: String(foundPapa?.nodeId),
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
            let foundPapa = null;

            for (let i = index - 1; i >= 0; i--) {
              if (papas[i].depth === 0 && papas[i].name !== treeInfo.node) {
                foundPapa = papas[i];
                break;
              }
            }

            if (foundPapa) {
              let newEdge = {
                id: `${foundPapa?.nodeId}-${newNode.id}`,
                source: String(foundPapa?.nodeId),
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
          return;
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
      const response = await axios.post(`/api/discipline/save`, data)
    } catch (error) {
    }
  }

  const save_complex = async () => {
    const data = {
      disciplineId: disciplineId,
      nodes: nodes,
      edges: edges
    }
    //console.log(data, "COMPLEX")
  }

  useEffect(() => {
    setSharedData(treeInfoArray)
    //console.log("SHARED DATA SET")
    //console.log(treeInfoArray, "TREE INFO ARRAY")
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
      snapGrid={[32, 32]}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onInit={setReactFlowInstance}
      onConnect={onConnect}
    >
      <Background />
      <Controls />
      <a
        className="absolute bottom-3 z-20 left-1/2 transform -translate-x-1/2 px-12 py-1 border-solid border-2 border-sky-500 rounded-lg cursor-pointer"
        onClick={isOnElementsPage ? save_complex : save}
      >

        Save
      </a>
    </ReactFlow>
  );
};

export default GraphRedactor;
