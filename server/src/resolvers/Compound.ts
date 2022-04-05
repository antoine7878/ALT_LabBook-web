import { PrismaClient } from '@prisma/client'

interface Context {
	prisma: PrismaClient;
}

export const Compound = (parent: any, _: any, ctx: Context) => {
	return ctx.prisma.compound.findOne({ where: { id: parent.id } }).Exp()
}