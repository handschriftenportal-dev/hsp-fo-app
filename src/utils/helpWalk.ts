export function helpWalk(node: Node, fn: (node: Node) => void) {
  fn(node)
  node.childNodes.forEach((node) => helpWalk(node, fn))
}
