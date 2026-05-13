const bcrypt = require('bcryptjs');

async function test() {
  const pass = 'password';
  const hash = await bcrypt.hash(pass, 10);
  const match = await bcrypt.compare(pass, hash);
  console.log(`Pass: ${pass}`);
  console.log(`Hash: ${hash}`);
  console.log(`Match: ${match}`);
}

test();
