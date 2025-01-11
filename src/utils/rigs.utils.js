export const defaultRigs = 3;
export const leftMostRig = (rigs) => {
  return Math.floor(parseInt(rigs, 10) / 2) + 2;
};

export const rightMostRig = (rigs) => {
  return Math.floor(rigs / 2) + 1;
};
