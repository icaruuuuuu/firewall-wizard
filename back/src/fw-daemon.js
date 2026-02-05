import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'

async function restartNftables() {
    return new Promise((resolve, reject) => {
        exec('systemctl restart nftables', (error, stdout, stderr) => {
            if (error) {
                console.error(`error: ${error.message}`);
                reject(error);
                return;
            }
            if (stderr) {
                console.error(`stderr: ${stderr}`);
            }
            console.log(`restarting nftables: ${stdout}`);
            resolve(stdout);
        });
    });
}

const SRC = '/tmp';
const DEST = '/etc';
const ARQ = 'nftables.conf';

fs.mkdirSync(SRC, { recursive: true });
fs.mkdirSync(DEST, { recursive: true });

setInterval(async () => {
  const source_file = path.join(SRC, ARQ);
  const destiny_file = path.join(DEST, ARQ);
  
  if (fs.existsSync(source_file)) {
    try {
      fs.copyFileSync(source_file, destiny_file);
      
      fs.unlinkSync(source_file);
      
      console.log('bulding /etc/nftables.conf');
      await restartNftables();
    } catch (error) {
      console.error('error:', error.message);
    }
  }
}, 2000); 

console.log('Watching', SRC);
