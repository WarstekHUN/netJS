/*
Author: Balogh Levente
Address: levi@proc.hu
2021-2022
*/
import { readFileSync } from 'fs';
import { createServer } from 'https';

const httpsServer = createServer({
    cert: readFileSync(`cert\\fullchain.pem`),
    key: readFileSync(`cert\\privkey.pem`)
});

export default httpsServer;
console.log('HTTPS server has been set up');