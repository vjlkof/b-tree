import Node from "./Node.js";

export default class BTree {
  constructor(arrayItem = []) {
    this.root = this.buildTree(arrayItem);
  }

  buildTree(arrayItem) {
    if (arrayItem.length === 1) {
      return new Node(arrayItem[0]);
    }
    const sortedArray = Array.from(new Set(arrayItem.sort((a, b) => a - b)));

    function buildBTree(arrayItem) {
      if (arrayItem.length === 0) {
        return null;
      }
      if (arrayItem.length === 1) {
        return new Node(arrayItem[0]);
      }
      const midArray = Math.floor(arrayItem.length / 2);
      return new Node(
        arrayItem[midArray],
        buildBTree(arrayItem.slice(0, midArray)),
        buildBTree(arrayItem.slice(midArray + 1, arrayItem.length))
      );
    }
    return buildBTree(sortedArray);
  }

  prettyPrint(node, prefix = "", isLeft = false) {
    if (node === null) {
      return;
    }
    if (node.right !== null) {
      this.prettyPrint(node.right, `${prefix}${isLeft ? "│ " : " "}`, false);
    }
    console.log(`${prefix}${isLeft ? "└── L: " : "┌── R: "}${node.value}`);
    if (node.left !== null) {
      this.prettyPrint(node.left, `${prefix}${isLeft ? " " : "│ "}`, true);
    }
  }

  insert(value) {
    try {
      this.root = searchAndInsert(this.root);
      return true;
    } catch (e) {
      return false;
    }

    function searchAndInsert(node) {
      if (!node) {
        node = new Node(value);
        return node;
      }
      if (value >= node.value) {
        node.right = searchAndInsert(node.right);
      } else {
        node.left = searchAndInsert(node.left);
      }
      return node;
    }
  }

  delete(value) {
    return searchAndDelete(this.root);

    function searchForReplacing(node, fatherNode) {
      if (!node.left) {
        const auxNode = node.value;
        fatherNode.left = node.right;
        return auxNode;
      }
      return searchForReplacing(node.left, node);
    }

    function searchAndDelete(node, fatherNode, left = null) {
      if (!node) {
        return false;
      }
      if (value === node.value) {
        if (!node.left || !node.right) {
          if (!node.left) {
            node = node.right;
          } else {
            node = node.left;
          }
          if (fatherNode) {
            if (left) {
              fatherNode.left = node;
            } else {
              fatherNode.right = node;
            }
          }
          return true;
        }
        node.value = searchForReplacing(node.right, node);
        return true;
      }
      if (value > node.value) {
        return searchAndDelete(node.right, node, false);
      } else {
        return searchAndDelete(node.left, node, true);
      }
    }
  }

  find(value) {
    return findValue(this.root);

    function findValue(node) {
      if (!node) {
        return false;
      }
      if (value === node.value) {
        return node;
      }
      if (value > node.value) {
        return findValue(node.right);
      } else {
        return findValue(node.left);
      }
    }
  }

  levelOrder(callback = null) {
    return levelOrderCheck(this.root, callback);

    function levelOrderCheck(node, callback) {
      if (!node) {
        return null;
      }
      let auxNode = node;
      const arrayAux = [auxNode];
      const arrayFinal = [];

      while (arrayAux.length > 0) {
        auxNode = arrayAux.shift();
        if (auxNode.left) arrayAux.push(auxNode.left);
        if (auxNode.right) arrayAux.push(auxNode.right);
        arrayFinal.push(auxNode.value);
      }
      return arrayFinal;
    }
  }

  levelOrderRec(callback = null) {
    if (!this.root) {
      return null;
    }
    return levelOrderCheck([this.root], callback);

    function levelOrderCheck(queue, callback) {
      if (queue.length === 0) {
        return [];
      }
      const auxNode = queue.shift();
      if (auxNode.left) queue.push(auxNode.left);
      if (auxNode.right) queue.push(auxNode.right);
      if (!callback) {
        const result = [auxNode.value, ...levelOrderCheck(queue, callback)];
        return result;
      } else {
        auxNode.value = callback(auxNode).value;
        levelOrderCheck(queue, callback);
        return true;
      }
    }
  }

  inOrder(callback = null) {
    if (!this.root) {
      return null;
    }
    return inOrderCheck(this.root, callback);

    function inOrderCheck(node, callback) {
      if (!node) {
        return [];
      }
      if (!callback) {
        const result = [
          ...inOrderCheck(node.left, callback),
          node.value,
          ...inOrderCheck(node.right, callback),
        ];
        return result;
      } else {
        inOrderCheck(node.left, callback);
        callback(node);
        inOrderCheck(node.right, callback);
        return true;
      }
    }
  }

  preOrder(callback = null) {
    if (!this.root) {
      return null;
    }
    return preOrderCheck(this.root, callback);

    function preOrderCheck(node, callback) {
      if (!node) {
        return [];
      }
      if (!callback) {
        const result = [
          node.value,
          ...preOrderCheck(node.left, callback),
          ...preOrderCheck(node.right, callback),
        ];
        return result;
      } else {
        callback(node);
        preOrderCheck(node.left, callback);
        preOrderCheck(node.right, callback);
        return true;
      }
    }
  }

  postOrder(callback = null) {
    if (!this.root) {
      return null;
    }
    return postOrderCheck(this.root, callback);

    function postOrderCheck(node, callback) {
      if (!node) {
        return [];
      }
      if (!callback) {
        const result = [
          ...postOrderCheck(node.left, callback),
          ...postOrderCheck(node.right, callback),
          node.value,
        ];
        return result;
      } else {
        postOrderCheck(node.left, callback);
        postOrderCheck(node.right, callback);
        callback(node);
        return true;
      }
    }
  }

  height(node) {
    if (!this.root) {
      return null;
    }
    return heightCheck(node);

    function heightCheck(node) {
      if (!node) {
        return -1;
      }
      const leftAux = 1 + heightCheck(node.left);
      const rightAux = 1 + heightCheck(node.right);
      return leftAux > rightAux ? leftAux : rightAux;
    }
  }

  depth(node) {
    if (!this.root) {
      return null;
    }
    return depthCheck(node, this.root);

    function depthCheck(node, root) {
      if (!root) {
        return null;
      }
      if (node.value === root.value) {
        return 0;
      }
      let auxSum = 0;
      if (node.value > root.value) {
        auxSum = depthCheck(node, root.right);
      } else {
        auxSum = depthCheck(node, root.left);
      }
      return auxSum === null ? null : auxSum + 1;
    }
  }

  isBalanced() {
    if (!this.root) {
      return null;
    }
    const height = this.height.bind(this);

    return balancedCheck(this.root);

    function balancedCheck(node) {
      if (!node) {
        return true;
      }
      const leftCheck = !node.left ? 0 : height(node.left);
      const rightCheck = !node.right ? 0 : height(node.right);
      if (Math.abs(leftCheck - rightCheck) > 1) {
        return false;
      }
      if (!balancedCheck(node.left) || !balancedCheck(node.right)) {
        return false;
      }
      return true;
    }
  }

  rebalance() {
    if (!this.root) {
      return null;
    }
    const auxArray = this.inOrder();
    this.root = this.buildTree(auxArray);

    return true;
  }
}
