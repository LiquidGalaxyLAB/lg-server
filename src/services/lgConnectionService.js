import Client from "ssh2/lib/client.js";
import AppError from "../utilis/error.utils.js";

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
               conn.end();
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

export const executeOrbitService = async (host, sshPort, username, password, command) => {

   const client = new Client();
   try {
     
      let port = parseInt(sshPort, 10)
      await connectSSH(client, { host, port, username, password });
      const result = await executeCommand(client, command);
      return result;
   } catch (error) {
   return next(new AppError(error||"Failed to execute orbit",500));
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
      return result;
   } catch (error) {
      return next(new AppError(error||"Failed to Clean Visualization",500));
   }
   finally {
      client.end();
   }
}

export const cleanlogosService = async (host, sshPort, username, password) => {
   let rigs = 4;
   let port = parseInt(sshPort, 10)
   let blank = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2" xmlns:kml="http://www.opengis.net/kml/2.2" xmlns:atom="http://www.w3.org/2005/Atom">
 <Document>
 </Document>
</kml>`

   const client = new Client();
   let command = `echo '${blank}' > /var/www/html/kml/slave_${rigs}.kml`
   try {
     
      await connectSSH(client, { host, port, username, password });
      const result = await executeCommand(client, command);
      return result;

   } catch (error) {
      return next(new AppError(error||"Failed to Clean Logo",500));
   }
   finally {
      client.end();
   }
}

export const relaunchLGService = async (host, sshPort, username, password, numberofrigs) => {
   let client = new Client();
   let rigs = parseInt(numberofrigs, 10);
   let port = parseInt(sshPort, 10)

   try {
     
      for (let i = rigs; i >= 1; i--) {

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
         return result;
      }
   } catch (error) {
      return next(new AppError(error||"Failed to Re-launch LG ",500));
   }
   finally {
      client.end();
   }
}
export const shutdownLGService = async (host, sshPort, username, password, numberofrigs) => {
   let client = new Client();
   let rigs = parseInt(numberofrigs, 10);
   let port = parseInt(sshPort, 10)
   try {

      for (let i = rigs; i >= 1; i--) {

         await connectSSH(client, { host, port, username, password });
         const result = await executeCommand(client, `sshpass -p ${password} ssh -t lg${i} "echo ${password} | sudo -S poweroff"`);

         return result;
      }
   } catch (error) {
      return next(new AppError(error||"Failed to Shutdown LG ",500));
   } finally {
      client.end();
   }
}
export const rebootLGService = async (host, sshPort, username, password, numberofrigs) => {
   let client = new Client();
   let rigs = parseInt(numberofrigs, 10);
   let port = parseInt(sshPort, 10);
   try {

      for (let i = rigs; i >= 1; i--) {

         await connectSSH(client, { host, port, username, password });
         const result = await executeCommand(client, `sshpass -p ${password} ssh -t lg${i} "echo ${password} | sudo -S reboot"`);

         return result;
      }
   } catch (error) {
      return next(new AppError(error||"Failed to reboot LG",500));
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
      return result;
   } catch (error) {
      return next(new AppError(error||"Failed to Stop Orbit ",500));
   } finally {
      client.end()
   }
}
export const cleanBalloonService = async (host, sshPort, username, password) => {
   let client = new Client();
   let rigs = 3;
   let port = parseInt(sshPort, 10);
   let blank = `<?xml version="1.0" encoding="UTF-8"?>
      <kml xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2" xmlns:kml="http://www.opengis.net/kml/2.2" xmlns:atom="http://www.w3.org/2005/Atom">
        <Document>
        </Document>
      </kml>`
   try {
    
      rigs = (int.parse(rigs) / 2).floor() + 1;
      await connectSSH(client, { host, port, username, password });
      const result = await executeCommand(client, `echo '${blank}' > /var/www/html/kml/slave_${rigs}.kml`);
      return result;
   } catch (error) {
      return next(new AppError(error||"Failed to Clean Balloon ",500));
   } finally {
      client.end();
   }
}
