import prisma from "./prisma";

async function registerAgent(name) {
  if (!name) throw new Error('Invalid agent name');
  const agentExists = await prisma.agent.findUnique({
    where: {
      name,
    },
  })
  if (agentExists) return agentExists.id;
  const agent = await prisma.agent.create({
    data: {
      name,
    },
  });
  const agentId = agent.id;
  await prisma.$disconnect()
  return agentId;
}

exports.registerAgent = registerAgent