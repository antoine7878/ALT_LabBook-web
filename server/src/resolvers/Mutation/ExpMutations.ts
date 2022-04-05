import { PrismaClient } from "@prisma/client";

interface Context {
  prisma: PrismaClient;
}

export const addExp = async (_: any, args: { compoundId: string }, ctx: Context) => {
  const compoundId = Number(args.compoundId)
  const expLength = ((await ctx.prisma.exp.count()) + 1).toString().padStart(3, '0')

  const exp = await ctx.prisma.exp.create({
    data: {
      compound: { connect: { id: compoundId } },
      name: `ALT-${expLength}`,
      procedure: '',
      notes: '',
      reference: '',
    }
  })
  return exp
};

export const setProcedureExp = async (_: any, args: { id: string; procedure: string }, ctx: Context) => {
  return ctx.prisma.exp.update({
    where: {
      id: Number(args.id),
    },
    data: {
      procedure: args.procedure,
    },
  });
};

export const setNotesExp = async (_: any, args: { id: string; notes: string }, ctx: Context) => {
  return ctx.prisma.exp.update({
    where: {
      id: Number(args.id),
    },
    data: {
      notes: args.notes,
    },
  });
};

export const setReferenceExp = async (_: any, args: { id: string; reference: string }, ctx: Context) => {
  return ctx.prisma.exp.update({
    where: {
      id: Number(args.id),
    },
    data: {
      reference: args.reference,
    },
  });
};

