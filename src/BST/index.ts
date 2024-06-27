import BSTNode from "./BSTNode";
interface SearchResult<Type> {
  node: BSTNode<Type> | null;
  parent: BSTNode<Type> | null;
}
export class BST<Type> {
    // if root is deleted or not defined yet,
    // its null
  root: BSTNode<Type> | null;

  constructor(root: BSTNode<Type>) {
    this.root = root;
  }

  private findInorderPred(node: BSTNode<Type>) {
    // it must have a left child
    // if node has no children remove Node

    // find the inorder predecessor
    const left = node.left;
    if (left) {
    } else {
      // it has no left child
    }
  }

  private addNodeHelper(node: BSTNode<Type>, parent: BSTNode<Type> | null): void {
    if(!parent){
        // this is the first node
        this.root = node;
        return;
    }
    const nodeValue: Type = node.value;
    const parentValue: Type = parent.value;


    if (nodeValue < parentValue) {
      const left = parent.left;
      if (left) {
        // left becomes the new parent node
        this.addNodeHelper(node, left);
      } else {
        parent.setLeft(node);
      }
    } else {
      const right = parent.right;
      if (right) {
        // right becomes the new parent node
        this.addNodeHelper(node, right);
      } else {
        parent.setRight(node);
      }
    }
  }

  private searchHelper(
    value: Type,
    parent: BSTNode<Type> | null,
    grandParent: BSTNode<Type> | null
  ): SearchResult<Type> {
    if (!parent) {
      return { node: null, parent: null };
    }

    if (parent.value === value) {
      return { node: parent, parent: grandParent };
    } else {
      const nextNode = value < parent.value ? parent.left : parent.right;
      return nextNode
        ? this.searchHelper(value, nextNode, parent)
        : { node: null, parent: null };
    }
  }

  private removeChildFromParent(node: BSTNode<Type> | null, parent: BSTNode<Type> | null): BSTNode<Type> | null{
    if(!node || !parent)
        return null;
    if(node === parent.left){
        parent.setLeft(null)
    }else if(node === parent.right){
        parent.setRight(null)

    }else{
        // if node is neither left child or right child fail silently
        return null;
    }
    return node;
  }
  /**
   * add Node in the binary search Tree
   * Q: Add never fails ?
   */
  public addNode(value: Type): void {
    const newNode: BSTNode<Type> = new BSTNode<Type>(value, null, null);
    // call add on the root node
    this.addNodeHelper(newNode, this.root);
  }

  /**
   * returns the deleted node or null if not founde
   */
  public removeNode(value: Type): BSTNode<Type> | null {
    const { node, parent } = this.searchNode(value);
    if (!node) return node;

    if(!parent){
        this.root = null;
        return null;
    }

    // if it has no children simple remove and return
    if(!node.left && !node.right){
        this.removeChildFromParent
        if(parent)
        return this.removeChildFromParent(node,parent);
        else{
            // remove the root node from BSt
            this.root = null;
            return null;
        }
    }
  }
  /**
   * @param value
   * @returns {SearchResult} result of this search
   */
  public searchNode(value: Type): SearchResult<Type> {
    return this.searchHelper(value, this.root, null);
  }
}
