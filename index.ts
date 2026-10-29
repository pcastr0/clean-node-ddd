import container from './src/container';

const app = container.resolve('app');

app
  .start()
  .catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  });