import fs from 'fs'
import path from 'path'

const SRC = '/tmp';
const DEST = '/etc';
const ARQ = 'app.conf';

fs.mkdirSync(SRC, { recursive: true });
fs.mkdirSync(DEST, { recursive: true });

setInterval(() => {
  const source_file = path.join(SRC, ARQ);
  const destiny_file = path.join(DEST, ARQ);
  
  if (fs.existsSync(source_file)) {
    try {
      fs.copyFileSync(source_file, destiny_file);
      
      fs.unlinkSync(source_file);
      
      console.log('bulding /etc/nftables.conf');
    } catch (error) {
      console.error('error:', error.message);
    }
  }
}, 2000); 

console.log('Watching', SRC);
