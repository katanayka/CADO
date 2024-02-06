class Node<T> {
  id: string;
  data: T;
  children: Node<T>[];

  constructor(id: string, data: T) {
    this.id = id;
    this.data = data;
    this.children = [];
  }
}

class Tree<T> {
  root: Node<T> | null;

  constructor() {
    this.root = null;
  }

  addNode(id: string, data: T, parentId?: string | null): void {
    const newNode = new Node(id, data);

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

  convertDataToTree(data: { nodes: { id: string, data: T, parentNode?: string | null }[], edges: { source: string, target: string }[] }): void {
    const nodes = data.nodes;
    const edges = data.edges;

    for (const node of nodes) {
      this.addNode(node.id, node.data, node.parentNode);
    }

    for (const edge of edges) {
      const sourceNode = this.findNodeById(this.root, edge.source);
      const targetNode = this.findNodeById(this.root, edge.target);

      if (sourceNode && targetNode) {
        sourceNode.children.push(targetNode);
      } else {
        // if (!sourceNode) console.error(`Source node not found for edge with source ID ${edge.source} and target ID ${edge.target}.`);
        if (!targetNode) console.error(`Target node not found for edge with source ID ${edge.source} and target ID ${edge.target}.`);
      }
    }
  }

  traverseDF(callback: (node: Node<T>) => void): void {
    (function recurse(currentNode) {
      if (!currentNode) return;
      for (let i = 0; i < currentNode.children.length; i++) {
        recurse(currentNode.children[i]);
      }
      callback(currentNode);
    })(this.root);
  }

  traverseBF(callback: (node: Node<T>) => void): void {
    let queue = [this.root];
    let currentNode = queue.shift();

    while (currentNode) {
      for (let i = 0; i < currentNode.children.length; i++) {
        queue.push(currentNode.children[i]);
      }
      callback(currentNode);
      currentNode = queue.shift();
    }
  }
}

export default Tree;
