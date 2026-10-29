import request from 'supertest';
import container from '../../src/container';

const server = container.resolve('server');

export default function apiRequest() {
  return request(server.express);
}