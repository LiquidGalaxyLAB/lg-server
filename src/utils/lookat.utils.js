export function lookAtLinear(latitude, longitude, elevation, tilt, bearing) {
  return `<LookAt><longitude>${longitude}</longitude><latitude>${latitude}</latitude><range>${elevation}</range><tilt>${tilt}</tilt><heading>${bearing}</heading><altitude>3341.7995674</altitude><gx:altitudeMode>relativeToGround</gx:altitudeMode></LookAt>`;
}
