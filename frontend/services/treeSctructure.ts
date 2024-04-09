import { getElementSize, ElementType } from "@/public/sizes";

interface Position {
  x: number;
  y: number;
}

class Node<T> {
  id: string;
  type: string;
  data: T;
  position?: Position;
  children: Node<T>[];

  constructor(id: string, data: T, type?: string, position?: Position) {
    this.id = id;
    this.type = type ?? 'Rewritable';
    this.data = data;
    this.position = position;
    this.children = [];
  }
}

class Tree<T> {
  root: Node<T> | null;

  constructor(Tree?: Tree<T>) {
    this.root = Tree ? Tree.root : null;
  }

  addNode(id: string, data: T, parentId?: string | null, type?: string, position?: Position): void {
    const newNode = new Node(id, data, type, position);
    if (!parentId) {
      if (!this.root) {
        this.root = newNode;
      } else {
        console.error(`Root node already exists.`);
      }
    } else {
      const parentNode = this.findNodeById(this.root, parentId);
      if (parentNode) {
        parentNode.children.push(newNode);
      } else {
        console.error(`Parent node with ID ${parentId} not found.`);
      }
    }
  }

  findNodeById(node: Node<T> | null, id: string): Node<T> | null {
    if (!node) return null;

    if (node.id === id) {
      return node;
    }
    for (const child of node.children) {
      const foundNode = this.findNodeById(child, id);
      if (foundNode) {
        return foundNode;
      }
    }

    return null;
  }

  traverseDF(callback: (node: Node<T>) => void): void {
    (function recurse(currentNode) {
      if (!currentNode) return;
      for (const element of currentNode.children) {
        recurse(element);
      }
      callback(currentNode);
    })(this.root);
  }

  traverseBF(callback: (node: Node<T>) => void): void {
    let queue = [this.root];
    let currentNode = queue.shift();

    while (currentNode) {
      for (const element of currentNode.children) {
        queue.push(element);
      }
      callback(currentNode);
      currentNode = queue.shift();
    }
  }

  getHierarchy(node: Node<T>): any {
    const children = node.children.map((child) => this.getHierarchy(child));
    const nodeType = node.type;
    if (!nodeType) {
      console.error(`Node type is not valid.`);
      return;
    }
    const { width, height } = getElementSize(nodeType as ElementType);
    return {
      size: [width, height],
      input_data: {
        id: node.id,
        data: node.data,
        type: nodeType
      },
      children: children,
    };
  }
}

class EnsembleTree<T> {
  getHierarchy(root: any) {
    throw new Error("Method not implemented.");
  }
  root(root: any) {
    throw new Error("Method not implemented.");
  }
  trees: Tree<T>[];

  constructor(EnsTree?: EnsembleTree<T>) {
    this.trees = EnsTree ? EnsTree.trees : [];
  }

  addTree(tree: Tree<T>): void {
    this.trees.push(tree);
  }

  convertIntoNodesEdges(): { nodes: { id: string; data: T; position?: Position, type: string }[]; edges: { source: string; target: string, id: string }[] } {
    const nodes: { id: string; data: T; position?: Position, type: string }[] = [];
    const edges: { source: string; target: string, id: string; sourceHandle?: string; targetHandle?: string }[] = [];
    for (const tree of this.trees) {
      const newTree = new Tree<T>(tree);
      newTree.traverseBF((node) => {
        nodes.push({ id: node.id, data: node.data, position: node.position, type: node.type });
        for (const child of node.children) {
          edges.push({ source: node.id, target: child.id, id: `${node.id}-${child.id}`, sourceHandle: 'bottom', targetHandle: 'top' });
        }
      });
    }

    return { nodes, edges };
  }
}

function convertDataToTree(
  data: {
    nodes: {
      id: string;
      data: any;
      position: Position;
      type: string;
    }[];
    edges: { source: string; target: string }[]
  }
): EnsembleTree<any> {
  const nodes = data.nodes;
  const edges = data.edges;
  const treeEnsemble = new EnsembleTree<any>();
  const rootNodes = nodes.filter((node) => !edges.find((edge) => edge.target === node.id));
  for (const rootNode of rootNodes) {
    let tree = new Tree<any>();
    const node = new Node<any>(rootNode.id, rootNode.data, rootNode.type, rootNode.position);
    tree.root = node;
    (function addChildren(currentNode) {
      const childrenEdges = edges.filter((edge) => edge.source === currentNode.id);
      for (const edge of childrenEdges) {
        const childNode = nodes.find((node) => node.id === edge.target);
        if (childNode) {
          tree.addNode(childNode.id, childNode.data, currentNode.id, childNode.type, childNode.position);
          addChildren(childNode);
        }
      }
    })(rootNode);
    treeEnsemble.addTree(tree);
  }
  return treeEnsemble;
}


export { Tree, EnsembleTree, convertDataToTree }
