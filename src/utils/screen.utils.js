export const defaultScreens = 3;
export const leftMostScreen = (screens) => {
  return Math.floor(parseInt(screens, 10) / 2) + 2;
};

export const rightMostScreen = (screens) => {
  return Math.floor(screens / 2) + 1;
};
