import { disconnect } from "process";
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
  private isLeftChildOfParent(node: BSTNode<Type>, parent: BSTNode<Type>) {
    return parent.getLeft() === node;
  }

  // DANGER
  private deleteRoot(): BSTNode<Type> | null {
    if (!this.root) return this.root;

    const rootOriginal: BSTNode<Type> = this.root;
    this.root = null;

    return rootOriginal;
  }

  private removeLeafNode(
    node: BSTNode<Type>,
    parent: BSTNode<Type>,
  ): BSTNode<Type> {
    if (parent.getLeft() === node) {
      parent.setLeft(null);
    }
    // doing it this way  makes sure
    // that even in case of invalid input
    // this funciton is reliable
    if (parent.getRight() === node) {
      parent.setRight(null);
    }
    return node;
  }

  private removeNodeWithOnlyLeftChild(
    node: BSTNode<Type>,
    parent: BSTNode<Type>,
  ): BSTNode<Type> {
    // needs to finally attach the right child of node
    const isNodeLeftChild = this.isLeftChildOfParent(node, parent);

    if (isNodeLeftChild) {
      parent.setLeft(node.getLeft());
    } else {
      parent.setRight(node.getLeft());
    }

    // parent has already derefrenced this node
    node.setLeft(null);
    return node;
  }

  private removeNodeWithOnlyRightChild(
    node: BSTNode<Type>,
    parent: BSTNode<Type>,
  ): BSTNode<Type> {
    const isNodeLeftChild = this.isLeftChildOfParent(node, parent);

    if (isNodeLeftChild) {
      parent.setLeft(node.getRight());
    } else {
      parent.setRight(node.getRight());
    }

    // parent has already derefrenced this node
    node.setRight(null);
    return node;
  }
  /**
   * return the previous element from the node in the final
   * inorder traversal
   */
  private findInorderPrevElement(node: BSTNode<Type>): SearchResult<Type> {
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
      return { node: current, parent: prev };
    } else {
      // it has no left child
      // hence no inorder predecessor
      return { node: null, parent: null };
    }
  }

  private replaceNodeWithAnother(
    node: BSTNode<Type>,
    parent: BSTNode<Type>,
    replacementNode: BSTNode<Type>,
  ): BSTNode<Type> {
    // assumptions
    // replacementNode does not have its own subtree
    // if it does this funciton will replace it

    const leftSubTreeRoot = node.getLeft();
    const rightSubTreeRoot = node.getRight();

    // derefrence node children
    node.setRight(null);
    node.setLeft(null);

    const isNodeLeftChild = this.isLeftChildOfParent(node, parent);

    if (isNodeLeftChild) {
      parent.setLeft(replacementNode);
    } else {
      parent.setRight(replacementNode);
    }

    // assign respective subTree to the replacement node

    replacementNode.setRight(rightSubTreeRoot);
    replacementNode.setLeft(leftSubTreeRoot);

    // always return the given node
    // for chaining
    return node;
  }

  private addNodeHelper(
    node: BSTNode<Type>,
    parent: BSTNode<Type> | null,
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
    grandParent: BSTNode<Type> | null,
  ): SearchResult<Type> {
    if (!parent) {
      return { node: null, parent: null };
    }

    if (parent.value === value) {
      return {
        node: parent,
        parent: grandParent,
      };
    } else {
      const nextNode = value < parent.value ? parent.left : parent.right;
      return nextNode
        ? this.searchHelper(value, nextNode, parent)
        : { node: null, parent: null };
    }
  }

  private removeChildFromParent(
    node: BSTNode<Type> | null,
    parent: BSTNode<Type> | null,
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
    const { node, parent } = this.searchNode(value);
    if (!node) return node;

    //0. if node does not have a parent it is the root node
    if (!parent) {
      return this.deleteRoot();
    }

    //1. if no children remove it from the parent
    if (!node.left && !node.right) {
      return this.removeLeafNode(node, parent);
    }

    //2. if no left child, then replace this node with its right child
    if (!node.left) {
      return this.removeNodeWithOnlyRightChild(node, parent);
    } else {
      const { node: inorderPredecessor, parent: inorderPredecessorParent } =
        this.findInorderPrevElement(node);

      // if inorder pred has any left child that is joined with its parent
      if (inorderPredecessor?.getLeft() && inorderPredecessorParent)
        this.removeNodeWithOnlyLeftChild(
          inorderPredecessor,
          inorderPredecessorParent,
        );

      // derefrence any children explicitiy for the inorder predecessor
      if (inorderPredecessor) {
        inorderPredecessor.setLeft(null);
        inorderPredecessor.setRight(null);
        // replace inorder predecessor with the node to be remove
        return this.replaceNodeWithAnother(node, parent, inorderPredecessor);
      }

      return null;
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
