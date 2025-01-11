class Orbit {
  static generateOrbitTag(lat, long, heading, range) {
    heading = parseFloat(heading);
    let tilt = 60;
    let orbit = 0;
    let content = "";

    while (orbit <= 36) {
      if (heading >= 360) heading -= 360;

      content += `
          <gx:FlyTo>
            <gx:duration>1.2</gx:duration>
            <gx:flyToMode>smooth</gx:flyToMode>
            <LookAt>
              <longitude>${long}</longitude>
              <latitude>${lat}</latitude>
              <heading>${heading}</heading>
              <tilt>${tilt}</tilt>
              <range>${range}</range>
              <gx:fovy>60</gx:fovy>
              <altitude>3341.7995674</altitude>
              <gx:altitudeMode>absolute</gx:altitudeMode>
            </LookAt>
          </gx:FlyTo>
        `;

      heading += 10;
      orbit += 1;
    }
    return content;
  }

  static buildOrbit(content) {
    return `
        <?xml version="1.0" encoding="UTF-8"?>
        <kml xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2" xmlns:kml="http://www.opengis.net/kml/2.2" xmlns:atom="http://www.w3.org/2005/Atom">
          <gx:Tour>
            <name>Orbit</name>
            <gx:Playlist> 
              ${content}
            </gx:Playlist>
          </gx:Tour>
        </kml>
      `;
  }
}

export default Orbit;
