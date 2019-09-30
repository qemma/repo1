// @flow
const generateTree = (entityList: Array<IEntity>) => {
  let tree = [];

  // First map the nodes of the array to an object -> create a hash table.
  const mappedArr = entityList.reduce((acc, curr) => {
    return {
      ...acc,
      [curr.uuid]: { ...curr, children: [], key: curr.uuid, data: curr, expanded: true }
    };
  }, {});
  Object.keys(mappedArr).forEach(itemId => {
    const item: IEntity = mappedArr[itemId];
    const parentId = item.parentId || item.uuid; //parentIds.length === 1 ? item.uuid : parentIds[parentIds.length - 2];
    const parent = mappedArr[parentId];
    if (parent && parent.uuid !== item.uuid) {
      parent.children.push(item);
    } else {
      tree.push(item);
    }
  });

  return tree;
};

export default generateTree;
