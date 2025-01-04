export const defaultRigs = 3;
export const leftMostRig = (rigs) => {
    return Math.floor(parseInt(rigs,10) / 2) + 2;
}

export const rightMostRig = (rigs) => {
    return Math.floor(rigs / 2) + 1
}

export function lookAtLinear(latitude, longitude, zoom, tilt, bearing) {
    return `<LookAt><longitude>${longitude}</longitude><latitude>${latitude}</latitude><range>${zoom}</range><tilt>${tilt}</tilt><heading>${bearing}</heading><altitude>3341.7995674</altitude><gx:altitudeMode>relativeToGround</gx:altitudeMode></LookAt>`;
}
  