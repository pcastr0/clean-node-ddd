import REPL from 'repl';
import vm from 'vm';

interface ConsoleOptions {
  expose?: Record<string, unknown>;
}

export const Console = {
  start(options: ConsoleOptions = {}) {
    const { expose } = options;

    const repl = REPL.start({
      eval: promiseableEval
    });

    Object.assign(repl.context, expose);
  }
};

function promiseableEval(cmd: string, context: vm.Context, _filename: string, callback: (err: Error | null, result?: unknown) => void): void {
  const result = vm.runInContext(cmd, context);

  if (isPromise(result)) {
    (result as Promise<unknown>)
      .then((value) => callback(null, value))
      .catch((err) => callback(err));

    return;
  }

  callback(null, result);
}

function isPromise(value: unknown): value is Promise<unknown> {
  return !!value && (typeof (value as Promise<unknown>).then === 'function') && (typeof (value as Promise<unknown>).catch === 'function');
}