/**
 * Mock category hierarchy per CONTRACT Section 7.
 * Electronics (Laptops, Smartphones, Audio)
 * Fashion (Footwear)
 * Books (Technology, Fiction)
 */
export const CATEGORIES_TREE = [
  {
    id: 1,
    name: 'Electronics',
    children: [
      { id: 2, name: 'Laptops', children: [] },
      { id: 3, name: 'Smartphones', children: [] },
      { id: 4, name: 'Audio', children: [] },
    ],
  },
  {
    id: 5,
    name: 'Fashion',
    children: [
      { id: 6, name: 'Footwear', children: [] },
    ],
  },
  {
    id: 7,
    name: 'Books',
    children: [
      { id: 8, name: 'Technology', children: [] },
      { id: 9, name: 'Fiction', children: [] },
    ],
  },
];

/**
 * Returns an array containing the target category id and all its descendant ids.
 * Used for category filtering where parent category includes child categories.
 */
export function getCategoryAndDescendantIds(targetId) {
  const idNum = Number(targetId);
  const result = [];

  function findAndCollect(nodes) {
    for (const node of nodes) {
      if (node.id === idNum) {
        collectAll(node);
        return true;
      }
      if (node.children?.length && findAndCollect(node.children)) {
        return true;
      }
    }
    return false;
  }

  function collectAll(node) {
    result.push(node.id);
    if (node.children) {
      node.children.forEach(collectAll);
    }
  }

  findAndCollect(CATEGORIES_TREE);
  return result.length > 0 ? result : [idNum];
}
