const items = [
  { id: 1, displayIndex: 2 },
  { id: 2, displayIndex: 3 },
  { id: 3, displayIndex: 2 }, // Duplicate
];

function areDisplayIndicesUnique(array: { displayIndex: number }[]): boolean {
  const indices = array.map((item) => item.displayIndex);
  const uniqueIndices = new Set(indices);
  return uniqueIndices.size === indices.length;
}

const isUnique = areDisplayIndicesUnique(items);
console.log(isUnique); // false (because displayIndex 2 is repeated)
