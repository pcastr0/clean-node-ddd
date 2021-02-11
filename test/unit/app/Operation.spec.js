const { expect } = require('chai');
const Operation = require('src/app/Operation');

describe('App :: Operation', () => {

  let CustomOperation;

  beforeEach(() => {
    CustomOperation = class CustomOperation extends Operation {

    };

    CustomOperation.setOutputs(['SUCCES']);
  });

  describe('#on', () => {
    context('when added handler for a valid output', () => {
      it('does not throw', () => {
        const operation = new CustomOperation();

        expect(() => {
          operation.on(operation.outputs.SUCCESS, () => {});
        }).to.not.throw;
      });
    });

    context('when added handler for a invalid output', () => {
      it('does throw', () => {
        const operation = new CustomOperation();

        expect(() => {
          operation.on('INVALID', () => {});
        }).to.throw(Error, /Invalid output "INVALID" to operation CustomOperation/);
      });
    });
  });

});