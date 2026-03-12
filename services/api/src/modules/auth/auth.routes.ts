import { FastifyInstance } from 'fastify';
import { loginHandler, registerHandler } from './auth.controller.js';

const authRoutes = async (app: FastifyInstance) => {
    app.post('/register', registerHandler as any);
    app.post('/login', loginHandler as any);
};

export default authRoutes;
