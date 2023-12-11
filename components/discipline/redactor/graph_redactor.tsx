// GraphRedactor.tsx
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import ReactFlow, {
  useEdgesState,
  updateEdge,
  addEdge,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  Node,
  NodeChange,
  EdgeChange,
  Edge,
  useNodesState,
  Position,
  useReactFlow,
  Connection
} from "reactflow";
import { FC } from "react";
import RewritableNode from "./customNodes/redact/Rewritablenode";
import NodeVideo from "./customNodes/redact/NodeVideo";
import { randomInt } from "crypto";
import axios from "axios";
import { DisciplineContext } from "@/app/disciplines/[disciplineId]/redactor/page";
import sizes_nodes from "@/public/sizes";
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


const GraphRedactor = ({ setSharedData }: { setSharedData: any }) => {
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);

  const [reactFlow, setReactFlow] = useState(useReactFlow());

  const getBrothers = (parentId: string) => {
    const allNodes = reactFlow.getNodes()
    const brothers = allNodes.filter(node => node.data.parentId == parentId)
    console.log(brothers)
    return brothers
  }
  const handleAddNode = (position: { x: number; y: number }, parentId: string, posEdge: Boolean) => {
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

  const position = { x: 0, y: 0 };
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

  const onEdgeUpdate = useCallback(
    (oldEdge: Edge, newConnection: Connection) => setEdges((els) => updateEdge(oldEdge, newConnection, els)),
    []
  );
  const onConnect = useCallback((params: Connection | Edge) => setEdges((els) => addEdge(params, els)), []);
  const router = usePathname();
  const isOnElementsPage = router.includes("/elements");
  const disciplineId = useContext(DisciplineContext);
  let id = 0;
  const getId = () => `dndnode_${id++}`;

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
    name: "циклы",
    description: "Description for Node 1",
    isHard: true,
    type: "Rewritable",
    children: [
      {
        name: "for",
        description: "Description for Subnode 1.1",
        isHard: false,
        type: "Rewritable",
        children: [
          {
            name: "описание for",
            description: "Description for Leaf 1.1.1",
            isHard: false,
            type: "Rewritable",
          },
        ],
      },
      {
        name: "while",
        description: "Description for Subnode 1.2",
        isHard: false,
        type: "Rewritable",
        children: [
          {
            name: "описание while",
            description: "Description for Leaf 1.2.1",
            isHard: false,
            type: "Rewritable",
          },
        ],
      }, {
        name: "операторы",
        description: "Description for Subnode 1.3",
        isHard: false,
        type: "Rewritable",
        children: [
          {
            name: "break",
            description: "Description for Leaf 1.3.1",
            isHard: false,
            type: "Rewritable",
            children: [
              {
                name: "описание break",
                description: "Description for Leaf 1.2.1",
                isHard: false,
                type: "Rewritable",
              },
            ]
          },
          {
            name: "continue",
            description: "Description for Leaf 1.3.2",
            isHard: false,
            type: "Rewritable",
            children: [
              {
                name: "описание continue",
                description: "Description for Leaf 1.2.1",
                isHard: false,
                type: "Rewritable",
                children: [
                  {
                    name: "видик",
                    description: "Description for Leaf 1.2.23",
                    isHard: false,
                    type: "VideoN",
                  },
                ]
              },
            ]
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
  const treeInfoArray: TreeInfo[] = traverseTree(tree);

  console.log(treeInfoArray)

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
      let indent = 0;
      let maxDepth = 0;
      interface Papa {
        name: string;
        nodeId: string;
        depth: number;
      }
      let papa: Papa = {
        name: '',
        nodeId: '',
        depth: 0
      }
      let papas: Papa[] = [];
      treeInfoArray.forEach(function (treeInfo, index) {
        if (treeInfo.depth > maxDepth) 
        {
          maxDepth = treeInfo.depth;
        }
        if (treeInfo.depth >= 0) {
          if (index > 0) if (treeInfoArray[index - 1].depth >= treeInfo.depth) indent += 256;
        }
      });
      if (treeInfoArray[0].depth == 0 && treeInfoArray[0].isHard == false) maxDepth++;
      const pos = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY
      });
      const newNode = {
        id: getId(),
        position: pos,
        data: {
          onAddNode: handleAddNode
        },
        style: {
          backgroundColor: 'rgba(255, 0, 255, 0.2)',
          height: maxDepth * 256,
          width: indent + 256,
        },
      };
      indent = 0
      let daddy = newNode.id;
      setNodes((nds) => nds.concat(newNode));
      treeInfoArray.forEach(function (treeInfo, index) {
        if (treeInfo.depth > maxDepth) maxDepth = treeInfo.depth;
        if (treeInfo.isHard && treeInfo.depth == 0) {
          treeInfoArray.forEach((temp) => {
            temp.depth -= 1;
          });
          return;
        }
        if (treeInfo.depth >= 0) {
          if (index > 0) if (treeInfoArray[index - 1].depth >= treeInfo.depth) indent += 256;
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
          }
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
            }
            setEdges((eds) => eds.concat(newEdge));
          }
          if (treeInfo.depth == 0) {
            let foundPapa = null;
            console.log(index);
            for (let i = index - 1; i >= 0; i--) {
              if (papas[i].depth == 0 && papas[i].name != treeInfo.node) {
                console.log(papas[i].name, treeInfo.node);
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
              }
              setEdges((eds) => eds.concat(newEdge));
            }
          }
          console.log(treeInfo);
        }
      });
      treeInfoArray.forEach(function (treeInfo, index) {
        if (treeInfo.isHard && treeInfo.depth == -1) {
          treeInfoArray.forEach((temp) => {
            temp.depth += 1;
          });
          return;
        }
      });
    },
    [reactFlowInstance]
  );

  const save = async () => {
    const data = {
      disciplineId: disciplineId,
      nodes: nodes,
      edges: edges
    }
    console.log(data, "SIMPLE")
    try {
      console.log(data)
      const response = await axios.post(`/api/discipline/save`, data)
      console.log(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const save_complex = async () => {
    const data = {
      disciplineId: disciplineId,
      nodes: nodes,
      edges: edges
    }
    console.log(data, "COMPLEX")
  }

  useEffect(() => {
    setSharedData(treeInfoArray)
    console.log("SHARED DATA SET")
    console.log(treeInfoArray, "TREE INFO ARRAY")
  }, [])


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
      onEdgeUpdate={onEdgeUpdate}
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
