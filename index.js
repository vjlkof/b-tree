import BTree from "./BTree.js";

const bTree = new BTree([1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324]);
bTree.prettyPrint(bTree.root);
console.log("Insert value 2");
bTree.insert(2);
bTree.prettyPrint(bTree.root);
console.log("Delete value 8");
console.log(bTree.delete(8));
bTree.prettyPrint(bTree.root);
console.log("Find value 324");
console.log(bTree.find(324));
console.log("Level Order");
console.log(bTree.levelOrder());
console.log("Level Order recursion");
console.log(bTree.levelOrderRec());
console.log(
  "Level Order recursion with callback, only modify the node in tree"
);
console.log(bTree.levelOrderRec(multiplyBy2));
function multiplyBy2(node) {
  node.value = node.value * 2;
  return node;
}
console.log(bTree.levelOrderRec());
