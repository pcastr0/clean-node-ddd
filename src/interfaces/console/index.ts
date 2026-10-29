import { Console } from './Console';
import container from '../../container';

Console.start({
  expose: { container }
});