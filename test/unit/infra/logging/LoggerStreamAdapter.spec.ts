import { expect } from 'chai';
import { LoggerStreamAdapter } from '../../../../src/infra/logging/LoggerStreamAdapter';
import type { Logger } from 'log4js';

describe('Infra :: Logging :: LoggerStreamAdapter', () => {
  describe('.toStream', () => {
    it('wraps the logger into a stream', () => {
      expect(LoggerStreamAdapter.toStream({} as Logger)).to.have.all.keys('write');
    });

    it('removes the \\n character from the message', (done) => {
      const fakeLogger = {
        info(message: string) {
          expect(message).to.equal('Sliced message');
          done();
        }
      } as unknown as Logger;

      LoggerStreamAdapter.toStream(fakeLogger).write('Sliced message\n');
    });
  });
});