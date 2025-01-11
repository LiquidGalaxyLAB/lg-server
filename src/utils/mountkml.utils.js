class MountKml {
  constructor(name, content) {
    this.name = name;
    this.content = content;
  }

  mount() {
    return `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2"
  xmlns:kml="http://www.opengis.net/kml/2.2" xmlns:atom="http://www.w3.org/2005/Atom">
  <gx:Tour>
    <name>Orbit</name>
    <gx:Playlist>
        <name>${this.name}</name>
          ${this.content}
          </gx:Playlist>
  </gx:Tour>
    </kml>`;
  }
}
export default MountKml;
