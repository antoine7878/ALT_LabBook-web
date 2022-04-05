import { PrismaClient } from '@prisma/client'

interface Context {
	prisma: PrismaClient;
}

export const Compound = async (parent: any, _: any, ctx: Context) => {
	return ctx.prisma.group.findOne({ where: { id: parent.id } }).Compound()
}

export const compoundLength = async (parent: any, _: any, ctx: Context) => {
	return (await ctx.prisma.group.findOne({ where: { id: parent.id } }).Compound()).length
} 