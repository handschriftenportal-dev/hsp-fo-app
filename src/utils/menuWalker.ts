interface Node {
  children: Node[]
}

/**
 * Traverses the nodes of a tree and applies a callback function to each node.
 * The callback receives the node, the tree level of the node and
 * the index within this level.
 *
 * Pre-order traversal (root -> left -> right)
 */
export function menuWalker<T extends Node>(
  node: T,
  fn: (node: T, level: number, index: number) => void,
  level = 0,
  index = 0,
) {
  fn(node, level, index)
  node.children.forEach((childNode, childIndex) =>
    menuWalker(childNode as any, fn, level + 1, childIndex),
  )
}
