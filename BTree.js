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
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.value}`);
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
}

/*

[1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324]
[1, 3, 4, 5, 7, 8, 9, 23, 67, 324, 6345]

                    8
            4               67
          3   7          23      6345
        1   5          9      324

sort

*/
