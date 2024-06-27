export default class BSTNode<Type> {
  value: Type;
  left: BSTNode<Type> | null;
  right: BSTNode<Type> | null;
  constructor(
    value: Type,
    left: BSTNode<Type> | null,
    right: BSTNode<Type> | null
  ) {
    this.value = value;
    this.left = left;
    this.right = right;
  }
  /**
   * Get Left BSTNode
   */
  public getLeft(): BSTNode<Type> | null {
    return this.left;
  }
  /**
   * getRight
   */
  public getRight(): BSTNode<Type> | null {
    return this.right;
  }

  /**
   * setRight
   */
  public setRight(right: BSTNode<Type> | null): void {
    // if child is already null fail silently
    if (!this.right) return;
    this.right = right;
  }

  /**
   * setLeft
   */
  public setLeft(left: BSTNode<Type>| null): void {
    // if child is already null fail silently
    if (!this.left) return;
    this.left = left;
  }
}
