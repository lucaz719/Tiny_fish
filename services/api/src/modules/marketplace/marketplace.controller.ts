import { FastifyReply, FastifyRequest } from 'fastify';
import { CreateReviewInput, SearchMarketplaceInput } from './marketplace.schema.js';
import { getVendorProfile, searchMarketplace, submitReview } from './marketplace.service.js';

export const submitReviewHandler = async (
    request: FastifyRequest<{ Body: CreateReviewInput }>,
    reply: FastifyReply
) => {
    try {
        const review = await submitReview(request.prisma, request.user.tenantId, request.body);
        return reply.code(201).send(review);
    } catch (error: any) {
        return reply.code(400).send({ error: error.message });
    }
};

export const searchMarketplaceHandler = async (
    request: FastifyRequest<{ Querystring: SearchMarketplaceInput }>,
    reply: FastifyReply
) => {
    const results = await searchMarketplace(request.prisma, request.query);
    return reply.send(results);
};

export const getVendorProfileHandler = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
) => {
    const profile = await getVendorProfile(request.prisma, request.params.id);
    if (!profile) return reply.code(404).send({ error: 'Vendor not found' });
    return reply.send(profile);
};
