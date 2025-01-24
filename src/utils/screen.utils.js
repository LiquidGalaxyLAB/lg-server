export const defaultScreens = 3;
export const getLeftMostScreen = (screens) => {
  return Math.floor(parseInt(screens, 10) / 2) + 2;
};

export const getRightMostScreen = (screens) => {
  return Math.floor(screens / 2) + 1;
};
