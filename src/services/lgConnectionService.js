import Client from "ssh2/lib/client.js";
import SSHClient from 'ssh2-sftp-client';
import AppError from "../utilis/error.utils.js";
import { defaultRigs, leftMostRig, lookAtLinear, rightMostRig } from "../utilis/lgUtils.js";
import AppSuccess from "../utilis/success.utils.js";
const connectSSH = async (client, config) => {
   return new Promise((resolve, reject) => {
      client
         .on("ready", resolve)
         .on("error", reject)
         .connect(config);
   });
}

const executeCommand = async (client, command) => {
   return new Promise((resolve, reject) => {
      client.exec(command, (err, stream) => {
         if (err) return reject(err);

         let output = "";
         let errorOutput = "";

         stream
            .on("close", (code, signal) => {
               console.log(
                  `Stream :: close :: code: ${code}, signal: ${signal}`
               );
               
               resolve(output);
            })
            .on("data", (data) => {
               output += data.toString();
            })
            .stderr.on("data", (data) => {
               errorOutput += data.toString();
            });
      });
   });
}

export const executeOrbitService = async (host, sshPort, username, password) => {

   const client = new Client();
   try {
      let port = parseInt(sshPort, 10);
      const command = `echo "search=Lleida" >/tmp/query.txt`;
      await connectSSH(client, { host, port, username, password });
      const result = await executeCommand(client, command);
      return new AppSuccess("Orbit executed successfully",200, result);
   } catch (error) {
   throw (new AppError(error || "Failed to execute orbit", 500));
   }
   finally {
      client.end();
   }
}

export const cleanVisualizationService = async (host, port, username, password) => {
   const client = new Client();
   try {
      await connectSSH(client, { host, port, username, password });
      const result = await executeCommand(client, "> /var/www/html/kmls.txt");
      return new AppSuccess("Visualization cleaned successfully",200, result);
   } catch (error) {
      throw new AppError(error||"Failed to Clean Visualization",500);
   }
   finally {
      client.end();
   }
}

export const cleanlogosService = async (host, sshPort, username, password, numberofrigs = defaultRigs) => {
   const leftmostrig = leftMostRig(numberofrigs);
   let port = parseInt(sshPort, 10)
   let blank = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2" xmlns:kml="http://www.opengis.net/kml/2.2" xmlns:atom="http://www.w3.org/2005/Atom">
 <Document>
 </Document>
</kml>`
   const client = new Client();
   let command = `echo '${blank}' > /var/www/html/kml/slave_${leftmostrig}.kml`
   try {
     
      await connectSSH(client, { host, port, username, password });
      const result = await executeCommand(client, command);
      return new AppSuccess("Logo cleaned successfully",200, result);

   } catch (error) {
      throw (new AppError(error||"Failed to Clean Logo",500));
   }
   finally {
      client.end();
   }
}

export const relaunchLGService = async (host, sshPort, username, password, numberofrigs = defaultRigs) => {
   let client = new Client();
   let rigs = parseInt(numberofrigs, 10);
   let port = parseInt(sshPort, 10)

   try {
      for (let i = 1; i <= rigs; i++) {

         await connectSSH(client, { host, port, username, password });

         const relaunchCommand = `
            RELAUNCH_CMD="\\
            if [ -f /etc/init/lxdm.conf ]; then
            export SERVICE=lxdm
            elif [ -f /etc/init/lightdm.conf ]; then
            export SERVICE=lightdm
            else
            exit 1
            fi
            if [[ \\\$(service \\\$SERVICE status) =~ 'stop' ]]; then
            echo ${password} | sudo -S service \\\${SERVICE} start
            else
            echo ${password} | sudo -S service \\\${SERVICE} restart
            fi
            " && sshpass -p ${password} ssh -x -t lg@lg${i} "\$RELAUNCH_CMD"`;

         await executeCommand(client, `"/home/${username}/bin/lg-relaunch" > /home/${username}/log.txt`);
         const result = await executeCommand(client, relaunchCommand);
         // client.end();
         return new AppSuccess("LG Relaunched successfully",200, result);
      }
   } catch (error) {
      throw (new AppError(error||"Failed to Re-launch LG ",500));
   }
   finally {
      client.end();
   }
}
export const shutdownLGService = async (host, sshPort, username, password, numberofrigs = defaultRigs) => {
   let client = new Client();
   let rigs = parseInt(numberofrigs, 10);
   let port = parseInt(sshPort, 10)
   try {

      for (let i = 1; i <= rigs; i++) {

         await connectSSH(client, { host, port, username, password });
         const result = await executeCommand(client, `sshpass -p ${password} ssh -t lg${i} "echo ${password} | sudo -S poweroff"`);

         return new AppSuccess("LG Shutdown successfully",200, result);
      }
   } catch (error) {
      throw (new AppError(error||"Failed to Shutdown LG ",500));
   } finally {
      client.end();
   }
}
export const rebootLGService = async (host, sshPort, username, password, numberofrigs = defaultRigs) => {
   let client = new Client();
   let rigs = parseInt(numberofrigs, 10);
   let port = parseInt(sshPort, 10);
   try {

      for (let i = 1; i <= rigs; i++) {

         await connectSSH(client, { host, port, username, password });
         const result = await executeCommand(client, `sshpass -p ${password} ssh -t lg${i} "echo ${password} | sudo -S reboot"`);

         return new AppSuccess("LG Rebooted successfully",200, result);
      }
   } catch (error) {
      throw (new AppError(error||"Failed to reboot LG",500));
   } finally {
      client.end();
   }
}
export const stopOrbitService = async (host, sshPort, username, password) => {
   let client = new Client();
   let port = parseInt(sshPort, 10);
   try {
     
      await connectSSH(client, { host, port, username, password });
      const result = await executeCommand(client, `echo "exittour=true" > /tmp/query.txt`);
      return new AppSuccess("Orbit Stopped successfully",200, result);
   } catch (error) {
      throw (new AppError(error||"Failed to Stop Orbit ",500));
   } finally {
      client.end()
   }
}
export const cleanBalloonService = async (host, sshPort, username, password, numberofrigs = defaultRigs) => {
   let client = new Client();
   let rigs = parseInt(numberofrigs, 10);
   let port = parseInt(sshPort, 10);
   let blank = `<?xml version="1.0" encoding="UTF-8"?>
      <kml xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2" xmlns:kml="http://www.opengis.net/kml/2.2" xmlns:atom="http://www.w3.org/2005/Atom">
        <Document>
        </Document>
      </kml>`
   try {
      rigs = rightMostRig(rigs);
      await connectSSH(client, { host, port, username, password });
      const result = await executeCommand(client, `echo '${blank}' > /var/www/html/kml/slave_${rigs}.kml`);
      return new AppSuccess("Balloon cleaned successfully",200, result);
   } catch (error) {
     throw (new AppError(error||"Failed to Clean Balloon ",500));
   } finally {
      client.end();
   }
}

export const flytoService = async (host, sshPort, username, password, latitude, longitude, tilt, bearing, numberofrigs = defaultRigs) => {
   let client = new Client();
   let port = parseInt(sshPort, 10);
   const zoomValue = (591657550.500000 / Math.pow(2, 13.15393352508545));
   const syncZoom = zoomValue / parseInt(numberofrigs,10);
   try {
      await connectSSH(client, { host, port, username, password });
      const result = await executeCommand(client, `echo "flytoview=${lookAtLinear(latitude, longitude, syncZoom, tilt, bearing)}" > /tmp/query.txt`);
      return new AppSuccess("Flyto executed successfully",200, result);
   } catch (error) {
     throw (new AppError(error||"Failed to fly to ",500));
   } finally {
      client.end();
   }
}

export const showOverlayImageService = async (host, sshPort, username, password, numberofrigs = defaultRigs, overlayImage) => {
   let client = new Client();
   const leftmostrig = leftMostRig(numberofrigs);
   let port = parseInt(sshPort, 10);
   try {
         await connectSSH(client, { host, port, username, password });
         const result = await executeCommand(client, `echo '${overlayImage}' > /var/www/html/kml/slave_${leftmostrig}.kml`);
         return new AppSuccess("Logo sent successfully",200, result);
   } catch (error) {
      throw (new AppError(error||"Failed to send Logo ",500));
   } finally {
      client.end();
   }
}

export const showBalloonService = async (host, sshPort, username, password, numberofrigs = defaultRigs, balloon) => {
   let client = new Client();
   let port = parseInt(sshPort, 10);
   const rightmostrig = rightMostRig(numberofrigs);
   try {
      await connectSSH(client, { host, port, username, password });
      const result = await executeCommand(client, `echo '${balloon}' > /var/www/html/kml/slave_${rightmostrig}.kml`);
      return new AppSuccess("Balloon sent successfully",200, result);
   } catch (error) {
      throw (new AppError(error||"Failed to send Balloon ",500));
   } finally {
      client.end();
   }
}

export const sendKmlService = async (host, sshPort, username, password, projectname, localPath) => {
   const sftp = new SSHClient();
   const client = new Client();
   const remoteKmlPath = `/var/www/html/${projectname}.kml`;
   const remoteKmlListPath = `/var/www/html/kmls.txt`;

   try {
       // Connect to the SFTP server
       await sftp.connect({ host, port: sshPort, username, password });

       // Upload the KML file
       await sftp.put(localPath, remoteKmlPath);

       // Connect to the SSH server
       await new Promise((resolve, reject) => {
           client.on('ready', resolve).on('error', reject).connect({ host, port: sshPort, username, password });
       });

       // Execute the command to update the KML list
       await new Promise((resolve, reject) => {
           client.exec(`echo "http://lg1:81/${projectname}.kml" > ${remoteKmlListPath}`, (err, stream) => {
               if (err) return reject(err);
               stream.on('close', (code, signal) => {
                   if (code === 0) resolve();
                   else reject(new AppError(`Command failed with code ${code}`, 500));
               }).on('data', (data) => {
                   console.log(data.toString());
               }).stderr.on('data', (data) => {
                   console.error(data.toString());
               });
           });
       });

       //Use LookAt so that you can see the kml
      // Execute the command to update the flyto query
      //  await new Promise((resolve, reject) => {
      //      client.exec(`echo "flytoview=${lookAtLinear("28.7041", "77.1025", 2000, 60, 0)}" > /tmp/query.txt`, (err, stream) => {
      //          if (err) return reject(err);
      //          stream.on('close', (code, signal) => {
      //              if (code === 0) resolve();
      //              else reject(new AppError(`Command failed with code ${code}`, 500));
      //          }).on('data', (data) => {
      //              console.log(data.toString());
      //          }).stderr.on('data', (data) => {
      //              console.error(data.toString());
      //          });
      //      });
      //  });

       return new AppSuccess("KML sent successfully", 200, null);
   } catch (error) {
       throw new AppError(error || "Failed to send KML", 500);
   } finally {
       sftp.end();
       client.end();
   }
}

