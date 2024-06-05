import React, { useCallback, useEffect, useRef, useState } from "react";
import nodeTypesRedact from "@/data/NodeTypesRedact";
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
import { EnsembleTree, Tree, convertDataToTree } from "@/services/treeSctructure";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import axios from "axios";
import { usePathname } from "next/navigation";
import { ImSpinner9 } from "react-icons/im";
import HistoryTab from "./history_tab";
import NodeChangeModal from "./node_change_modal";
import selectedNodeToHide from "@/services/selectedNodeToHide";
import { setSelectedNode } from "@/services/selectedNodeSlice";

interface ReactFlowInstance {
  screenToFlowPosition: (position: { x: number; y: number }) => {
    x: number;
    y: number;
  };
}

const MIN_DISTANCE = 392

const GraphRedactor = ({ setSharedData, dataTree }: { setSharedData: any, dataTree: any }) => {
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);
  const edgeUpdateSuccessful = useRef(true);
  const store = useStoreApi();
  const nodeTypes = nodeTypesRedact;

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
  const router = usePathname();
  const isOnElementsPage = router.includes("/elements");
  const disciplineId = router.split("/")[2];
  const initialNodes: Node<any, string | undefined>[] = [];
  const initialEdges: Edge<any>[] = [];
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const selectedNode = useSelector((state: RootState) => state.selectedNode);
  const [showNodeChangeModal, setShowNodeChangeModal] = useState(false);
  const selectedNodetoHide = useSelector((state: RootState) => state.selectedNodeToHide);
  useEffect(() => {
    if (!dataTree) return;
    const { nodes, edges } = dataTree.convertIntoNodesEdges();
    setNodes(nodes);
    setEdges(edges);
  }, [dataTree]);

  useEffect(() => {
    if (selectedNode.id !== "") {
      setShowNodeChangeModal(true);
    }
  }, [selectedNode]);
  useEffect(() => {
    if (selectedNodetoHide.id !== "") {
      const childNodes = getChildNodes(selectedNodetoHide.id, edges, nodes);
      if (childNodes.length != 0) {
        const hide = childNodes[0].hidden
        setNodes((nds) =>
          nds.map((node) => {
            if (childNodes.includes(node)) {
              node.hidden = !hide;
            }
            return node;
          })
        );
        setEdges((eds) =>
          eds.map((edge) => {
            const node = nodes.find((node) => node.id === edge.target);
            if (node?.hidden == true) {
              edge.hidden = true
            }
            if (node?.hidden == false) {
              edge.hidden = false
            }
            return edge;
          })
        );
      }
    }
  }, [selectedNodetoHide]);

  function getChildNodes(nodeId: string, edges: Edge[], nodes: Node[]): Node[] {
    const childNodes: Node[] = [];
    const outgoingEdges = edges.filter(edge => edge.source === nodeId);
    outgoingEdges.forEach(edge => {
      const childNode = nodes.find(node => node.id === edge.target);
      if (childNode) {
        childNodes.push(childNode);
        const grandChildNodes = getChildNodes(childNode.id, edges, nodes);
        childNodes.push(...grandChildNodes);
      }
    });
    return childNodes;
  }

  const [loading, setLoading] = useState(false);
  const historyList = useRef<any[]>([]);

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

  const onConnect = useCallback((params: Connection | Edge) => {
    // Generate a unique ID for the new edge (parent ID + Child ID + getID())
    const edgeId = `${params.source}-${params.target}` + getId();

    // Add the new edge to the elements array
    setEdges((els) => addEdge({ ...params, id: edgeId }, els));

    // Add a new entry to the history list
    historyList.current = [
      ...historyList.current,
      { id: edgeId, action: 'Edge created' },
    ];
  }, []);


  let id = 0;
  const getId = () => `_${id++}`;

  const onNodeDrag = useCallback(
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
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
    },
    []
  );
  const fullTreeInfoArray: Tree<string> = new Tree<string>();
  fullTreeInfoArray.addNode("Python", "Описание по Python");

  fullTreeInfoArray.addNode("Основы Python", "А", "Python");
  fullTreeInfoArray.addNode("Переменные и типы данных", "Описание переменных и типов данных", "Основы Python");
  fullTreeInfoArray.addNode("Операции с переменными", "Описание операций с переменными", "Переменные и типы данных");
  fullTreeInfoArray.addNode("Конвертация типов", "Описание конвертации типов данных", "Переменные и типы данных");
  fullTreeInfoArray.addNode("Основные операторы", "Описание арифметических, логических и сравнительных операторов", "Основы Python");

  fullTreeInfoArray.addNode("Синтаксис", "Описание синтаксиса Python", "Python");
  fullTreeInfoArray.addNode("Условные операторы", "Описание условных операторов", "Синтаксис");
  fullTreeInfoArray.addNode("if", "Описание if-оператора", "Условные операторы");
  fullTreeInfoArray.addNode("else", "Описание else-оператора", "Условные операторы");
  fullTreeInfoArray.addNode("elif", "Описание elif-оператора", "Условные операторы");

  fullTreeInfoArray.addNode("Циклы", "Описание циклов", "Синтаксис");
  fullTreeInfoArray.addNode("for", "Описание for-цикла", "Циклы");
  fullTreeInfoArray.addNode("while", "Описание while-цикла", "Циклы");
  fullTreeInfoArray.addNode("Вложенные циклы", "Описание вложенных циклов", "Циклы");
  fullTreeInfoArray.addNode("break и continue", "Описание операторов break и continue", "Циклы");

  fullTreeInfoArray.addNode("Функции", "Описание функций в Python", "Python");
  fullTreeInfoArray.addNode("Определение функции", "Описание определения функции", "Функции");
  fullTreeInfoArray.addNode("Аргументы функции", "Описание аргументов функции", "Функции");
  fullTreeInfoArray.addNode("Возвращаемые значения", "Описание возвращаемых значений функции", "Функции");
  fullTreeInfoArray.addNode("Рекурсия", "Описание рекурсии", "Функции");

  fullTreeInfoArray.addNode("Работа со строками", "Описание работы со строками в Python", "Python");
  fullTreeInfoArray.addNode("Методы строк", "Описание методов строк", "Работа со строками");
  fullTreeInfoArray.addNode("Форматирование строк", "Описание форматирования строк", "Работа со строками");
  fullTreeInfoArray.addNode("Регулярные выражения", "Описание регулярных выражений в Python", "Работа со строками");

  fullTreeInfoArray.addNode("Коллекции", "Описание коллекций данных в Python", "Python");
  fullTreeInfoArray.addNode("Списки", "Описание списков в Python", "Коллекции");
  fullTreeInfoArray.addNode("Кортежи", "Описание кортежей в Python", "Коллекции");
  fullTreeInfoArray.addNode("Множества", "Описание множеств в Python", "Коллекции");
  fullTreeInfoArray.addNode("Словари", "Описание словарей в Python", "Коллекции");

  fullTreeInfoArray.addNode("Работа с файлами", "Описание работы с файлами в Python", "Python");
  fullTreeInfoArray.addNode("Чтение файла", "Описание чтения файла", "Работа с файлами");
  fullTreeInfoArray.addNode("Запись в файл", "Описание записи в файл", "Работа с файлами");

  fullTreeInfoArray.addNode("Элементы функционального программирования", "Описание функционального программирования в Python", "Python");
  fullTreeInfoArray.addNode("Lambda-функции", "Описание lambda-функций в Python", "Элементы функционального программирования");
  fullTreeInfoArray.addNode("Функции высшего порядка", "Описание функций высшего порядка (map, filter, reduce)", "Элементы функционального программирования");
  fullTreeInfoArray.addNode("List Comprehensions", "Описание генераторов списков", "Элементы функционального программирования");

  fullTreeInfoArray.addNode("Обработка исключений", "Описание обработки исключений в Python", "Python");
  fullTreeInfoArray.addNode("try-except", "Описание блока try-except", "Обработка исключений");
  fullTreeInfoArray.addNode("finally", "Описание блока finally", "Обработка исключений");

  fullTreeInfoArray.addNode("Модули и пакеты", "Описание модулей и пакетов в Python", "Python");
  fullTreeInfoArray.addNode("Импорт модулей", "Описание импорта модулей", "Модули и пакеты");
  fullTreeInfoArray.addNode("Создание модулей", "Описание создания собственных модулей", "Модули и пакеты");

  fullTreeInfoArray.addNode("Работа с библиотеками", "Описание работы с внешними библиотеками", "Python");
  fullTreeInfoArray.addNode("Пример: NumPy", "Описание работы с библиотекой NumPy", "Работа с библиотеками");
  fullTreeInfoArray.addNode("Пример: Pandas", "Описание работы с библиотекой Pandas", "Работа с библиотеками");

  const getTree = (node: any) => {
    const flextree = require('d3-flextree').flextree;
    const layout = flextree();
    const hierarchy = fullTreeInfoArray.getHierarchy(node);
    const tree = layout.hierarchy(hierarchy);
    layout(tree);
    return tree;
  }


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
      const rootNode = fullTreeInfoArray.findNodeById(fullTreeInfoArray.root, data.id)
      if (!rootNode) {
        if (data.minElement) {
          const elemId = data.node + getId();
          setNodes((ns) => [
            ...ns,
            {
              id: elemId,
              type: data.type,
              position: {
                x: startPos.x,
                y: startPos.y
              },
              data: {
                label: data.node,
                text: data.description
              }
            }
          ]);
          historyList.current.push({
            action: "add",
            id: elemId
          });
        }
        return;
      }
      let flowNodes: { id: string; type: any; position: { x: number; y: number; }; data: { label: string; text: string }; }[] = [];
      let flowEdges: { id: string; source: string; target: string; animated: boolean; sourceHandle: string; targetHandle: string; }[] = [];
      const tree = getTree(rootNode);
      tree.descendants().forEach((element: {
        data: {
          input_data: {
            id_context: string; id: string;
          };
        };
      }, index: any) => {
        element.data.input_data.id_context = `${element.data.input_data.id}-${index}` + getId();
      });
      let usedNodesIds: string[] = [];
      let usedEdgesIds: string[] = [];
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
        usedNodesIds.push(element.data.input_data.id_context);
      }
      for (const element of tree.descendants()) {
        if (element.children) {
          for (const child of element.children) {
            const edgeId = `${element.data.input_data.id}-${child.data.input_data.id}` + getId();
            flowEdges.push({
              id: edgeId,
              source: element.data.input_data.id_context,
              sourceHandle: 'bottom',
              target: child.data.input_data.id_context,
              targetHandle: 'top',
              animated: true
            });
            usedEdgesIds.push(edgeId);
          }
        }
      }
      historyList.current.push({
        action: "add",
        id: flowNodes[0].id,
        usedNodesIds: usedNodesIds,
        usedEdgesIds: usedEdgesIds,
      });
      setNodes((ns) => [...ns, ...flowNodes]);
      setEdges((es) => [...es, ...flowEdges]);
    }, [reactFlowInstance]
  );

  const save = async () => {
    console.log(selectedNodetoHide);
    store.getState();
    setLoading(true);
    const nodesData = nodes.map(node => ({
      id: node.id,
      data: node.data,
      position: node.position,
      books: node.data.books,
      type: node.type ?? 'defaultType',
    }));
    const tree = convertDataToTree({
      "nodes": nodesData,
      "edges": edges
    });
    const data = {
      disciplineId: disciplineId,
      dataTree: tree
    }
    try {
      await axios.post(`/api/discipline/save`, data, {
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        }
      })
    } catch (error) {
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
      await axios.post(`/api/discipline/saveComplex`, data, {
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        }
      })
    } catch (error) {
    }
  }

  useEffect(() => {
    setSharedData(fullTreeInfoArray);
  }, [])
  const dispatch = useDispatch();

  return (
    <>
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
          id="saveButton"
        >
          {loading ? <ImSpinner9 size={24} className="animate-spin" /> : "Save"}
        </button>

      </ReactFlow>
      {showNodeChangeModal ?
        <NodeChangeModal
          selectedNode={selectedNode}
          saveSelectedNode={(data) => {
            setNodes((ns) => ns.map((n) => n.id === data.id ? { ...n, data: { ...n.data, text: data.text, inside: data.inside, books: data.books } } : n));
            setShowNodeChangeModal(false);
          }}
          closeModal={() => {
            setShowNodeChangeModal(false);
            dispatch(setSelectedNode({
              id: '',
              parentId: '',
              text: '',
              inside: ''
            }))
          }}
        /> :
        <HistoryTab historyList={historyList} />}

    </>
  );
};

export default GraphRedactor;
