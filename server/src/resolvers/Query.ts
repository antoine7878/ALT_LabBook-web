import { PrismaClient } from '@prisma/client'

interface Context {
	prisma: PrismaClient;
}

interface Id {
	id: string;
}

export const groups = (_: any, args: { id: string }, ctx: Context) => {
	if (Boolean(args.id)) {
		return [ctx.prisma.group.findOne({ where: { id: Number(args.id) } })]
	} else {
		return ctx.prisma.group.findMany()
	}
}

export const compounds = (_: any, args: { groupId: string }, ctx: Context) => {
	if (args.groupId) {
		return ctx.prisma.compound.findMany({
			where: { groupId: Number(args.groupId) },
			orderBy: { index: 'asc' }
		})
	} else {
		return ctx.prisma.compound.findMany()
	}
}

export const exp = (_: any, args: Id, ctx: Context) => {
	if (args.id) {
		return [ctx.prisma.exp.findOne({
			where: { id: Number(args.id) }
		})]
	} else {
		return ctx.prisma.exp.findMany()
	}
}

export const exps = async (_: any, args: { compoundId: string }, ctx: Context) => {
	return await ctx.prisma.exp.findMany({
		where: { compoundId: Number(args.compoundId) }
	})
}

export const compound = async (_: any, args: Id, ctx: Context) => {
	return await ctx.prisma.compound.findOne({ where: { id: Number(args.id) } })
}

export const expLength = async (_: any, __: any, ctx: Context) => {
	return await ctx.prisma.exp.count()
}

export const expIdFromName = async (_: any, args: { name: string }, ctx: Context) => {
	const name = args.name
	const id = (await ctx.prisma.exp.findFirst({ where: { name } }))?.id
	return { id, name }
}