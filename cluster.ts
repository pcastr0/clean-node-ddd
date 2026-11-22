import dotenv from 'dotenv';
import pm2 from 'pm2';

dotenv.config();

const instances = process.env.WEB_CONCURRENCY ? Number(process.env.WEB_CONCURRENCY) : -1;
const maxMemory = process.env.WEB_MEMORY ? Number(process.env.WEB_MEMORY) : 512;

pm2.connect(() => {
  pm2.start({
    script: 'dist/index.js',
    instances,
    max_memory_restart: `${maxMemory}M`,
    env: {
      NODE_ENV: 'production'
    }
  }, (err) => {
    if (err) {
      return console.error('Error while launching applications', err.stack || err);
    }

    console.log('PM2 and application has been successfully started!');

    pm2.launchBus((err, bus) => {
      if (err) {
        return console.error('[PM2] Log streaming failed', err);
      }

      console.log('[PM2] Log streaming started');

      bus.on('log:out', (packet: { process: { name: string }; data: string }) => {
        console.log('[App:%s] %s', packet.process.name, packet.data);
      });

      bus.on('log:err', (packet: { process: { name: string }; data: string }) => {
        console.error('[App:%s][Err] %s', packet.process.name, packet.data);
      });
    });
  });
});