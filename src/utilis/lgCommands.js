export function executeOrbit(){
    return "echo 'playtour=Orbit' > /tmp/query.txt";
}

async function relaunchLG(context, { 
    sshClient, 
    rigsCount, 
    passwordProvider, 
    usernameProvider 
  }) {
    try {
      for (let i = 1; i <= rigsCount; i++) {
        const cmd = `RELAUNCH_CMD="\\
          if [ -f /etc/init/lxdm.conf ]; then
            export SERVICE=lxdm
          elif [ -f /etc/init/lightdm.conf ]; then
            export SERVICE=lightdm
          else
            exit 1
          fi
          if  [[ \\$(service \\$SERVICE status) =~ 'stop' ]]; then
            echo ${passwordProvider} | sudo -S service \\${SERVICE} start
          else
            echo ${passwordProvider} | sudo -S service \\${SERVICE} restart
          fi
          " && sshpass -p ${passwordProvider} ssh -x -t lg@lg${i} "$RELAUNCH_CMD"`;
  
        await sshClient.execute(
          `"/home/${usernameProvider}/bin/lg-relaunch" > /home/${usernameProvider}/log.txt`
        );
        await sshClient.execute(cmd);
      }
    } catch (error) {
      console.log("error", error);
      return null;
    }
  }

  async function cleanSlaves(context, { sshClient, rigsCount }) {
    const blank = `<?xml version="1.0" encoding="UTF-8"?>
  <kml xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2" xmlns:kml="http://www.opengis.net/kml/2.2" xmlns:atom="http://www.w3.org/2005/Atom">
    <Document>
    </Document>
  </kml>`;

    try {
      for (let i = 2; i <= rigsCount; i++) {
        await sshClient.run(`echo '${blank}' > /var/www/html/kml/slave_${i}.kml`);
      }
    } catch (error) {
      await cleanSlaves(context, { sshClient, rigsCount });
    }
  }

  // Stop orbit function
 async function stopOrbit(context, { sshClient }) {
    try {
      await sshClient.run('echo "exittour=true" > /tmp/query.txt');
    } catch (error) {
      await stopOrbit(context, { sshClient });
    }
  }
  
  // Reboot LG function
  async function rebootLG(context, { sshClient, rigsCount, passwordProvider }) {
    try {
      for (let i = 1; i <= rigsCount; i++) {
        await sshClient.run(
          `sshpass -p ${passwordProvider} ssh -t lg${i} "echo ${passwordProvider} | sudo -S reboot"`
        );
      }
    } catch (error) {
        console.log("error", error);
    }
  }

// Utility class for balloon operations
  class BalloonMakers {
    static blankBalloon() {
      return `<?xml version="1.0" encoding="UTF-8"?>
  <kml xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2" xmlns:kml="http://www.opengis.net/kml/2.2" xmlns:atom="http://www.w3.org/2005/Atom">
  <Document>
   <name>None</name>
   <Style id="blank">
     <BalloonStyle>
       <textColor>ffffffff</textColor>
       <text></text>
       <bgColor>ff15151a</bgColor>
     </BalloonStyle>
   </Style>
   <Placemark id="bb">
     <description></description>
     <styleUrl>#blank</styleUrl>
     <gx:balloonVisibility>0</gx:balloonVisibility>
     <Point>
       <coordinates>0,0,0</coordinates>
     </Point>
   </Placemark>
  </Document>
  </kml>`;
    }
  }
  
  async function cleanBalloon(context, {
    sshClient, 
    leftmostRigProvider,
    connectionRetry 
  }) {
    try {
      await sshClient.run(
        `echo '${BalloonMakers.blankBalloon()}' > /var/www/html/kml/slave_2.kml`
      );
    } catch (error) {
      await cleanBalloon(context, { 
        sshClient, 
        leftmostRigProvider,
        connectionRetry 
      });
    }
  }
