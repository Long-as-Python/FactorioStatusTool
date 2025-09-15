const { exec } = require('child_process');
const path = require('path');

const factorioDir = process.env.FACTORIO_DIR || '/factorio';
const output = path.join(process.cwd(), 'public', 'map', 'latest.png');
const cmd = process.env.MAPSHOT_CMD || `mapshot --factorio-dir ${factorioDir} --output ${output}`;

exec(cmd, (err, stdout, stderr) => {
  if (err) {
    console.error('Mapshot failed:', err);
    console.error(stderr);
  } else {
    console.log(stdout);
    console.log('Map generated at', output);
  }
});
