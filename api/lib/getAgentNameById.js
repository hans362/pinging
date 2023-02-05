import prisma from "./prisma";

async function getAgentNameById(agentId) {
  const agent = await prisma.agent.findUnique({
    where: {
      id: parseInt(agentId),
    },
  });
  return agent.name;
}

exports.getAgentNameById = getAgentNameById;