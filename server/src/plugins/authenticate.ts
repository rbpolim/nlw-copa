import { FastifyRequest } from "fastify";

export function authenticate(request: FastifyRequest) {
  return request.jwtVerify();
}
