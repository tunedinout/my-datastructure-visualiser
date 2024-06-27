import BSTNode from "./BSTNode";
interface SearchResult<Type> {
  node: BSTNode<Type> | null;
  parent: BSTNode<Type> | null;
  isLeftChild: Boolean;
}
export class BST<Type> {
  // if root is deleted or not defined yet,
  // its null
  root: BSTNode<Type> | null;

  constructor(root: BSTNode<Type>) {
    this.root = root;
  }

  private getInorderPredecessor(node: BSTNode<Type>): SearchResult<Type> {
    // it must have a left child
    // if node has no children remove Node

    // find the inorder predecessor
    const left = node.left;
    if (left) {
      // find the right most node of the left child
      let prev: BSTNode<Type> | null = null;
      let current: BSTNode<Type> | null = node;

      while (current.right) {
        prev = current;
        current = current.right;
      }
      return { node: current, parent: prev, isLeftChild: false };
    } else {
      // it has no left child
      // hence no inorder predecessor
      return { node: null, parent: null, isLeftChild: false };
    }
  }

  private addNodeHelper(
    node: BSTNode<Type>,
    parent: BSTNode<Type> | null
  ): void {
    if (!parent) {
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
      return { node: null, parent: null, isLeftChild: false };
    }

    if (parent.value === value) {
      return {
        node: parent,
        parent: grandParent,
        isLeftChild: grandParent?.left === parent,
      };
    } else {
      const nextNode = value < parent.value ? parent.left : parent.right;
      return nextNode
        ? this.searchHelper(value, nextNode, parent)
        : { node: null, parent: null, isLeftChild: false };
    }
  }

  private removeChildFromParent(
    node: BSTNode<Type> | null,
    parent: BSTNode<Type> | null
  ): BSTNode<Type> | null {
    if (!node || !parent) return null;
    if (node === parent.left) {
      parent.setLeft(null);
    } else if (node === parent.right) {
      parent.setRight(null);
    } else {
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
   * returns the deleted node or null if not found or if the root is removed
   */
  public removeNode(value: Type): BSTNode<Type> | null {
    const { node, parent, isLeftChild: isNodeLeftChild } = this.searchNode(value);
    if (!node) return node;

    if (!parent) {
      this.root = null;
      return null;
    }

    // if no children remove it from the parent
    if (!node.left && !node.right) {
      if (parent.left === node) {
        parent.setLeft(null);
        return node;
      } else if (parent.right === node) {
        parent.setRight(null);
        return node;
      } else {
        // silently fail as node has to be child of parent
        return null;
      }
    }

    // if not left child, then replace this node with its right child
    if (!node.left) {
      // get back this removedNode
      const child = node.right;
      if (parent.left === node) {
        // if left child of parent
        parent.setLeft(child);
      } else if (parent.right === node) {
        parent.setRight(child);
      } else {
        // silently fail as node has to child of parent
        return null;
      }
    } else {
      // replace with inorder predecessor
      const {
        node: inorderPredecessor,
        parent: inorderPredecessorParent,
        isLeftChild: isInorderPredecessorLeftChild
      }: SearchResult<Type> = this.getInorderPredecessor(node);

      if (inorderPredecessor) {
        // it can have a left child but it must not have a right child

        // disconnect inorder predecssor left child with its parent 
        // and connect left child to inorderPredecessorParent
        if (inorderPredecessor.left) {
           
            
            if(isInorderPredecessorLeftChild){
               inorderPredecessorParent?.setLeft(inorderPredecessor.left);
               // inorder Predecessor disconnect from it child
               inorderPredecessor.setLeft(null)
            }
            // 
            if(isNodeLeftChild){
                inorderPredecessor.left = node.left;
                
                parent.setLeft(inorderPredecessor);

            }
        }else{

        }
      } else {
        // silently fail  as it does not have inorderPredecessor
        console.error("fetching inorder predecessor has failed!!");
        return null;
      }

      // predecessor has no
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
