import prisma from "./prisma";

async function registerRecord(agentId, nodeId, lantency) {
  if (!agentId || !nodeId || !lantency) throw new Error('Invalid record data');
  const record = await prisma.record.create({
    data: {
      agent: { connect: { id: parseInt(agentId) } },
      node: { connect: { id: parseInt(nodeId) } },
      lantency: parseInt(lantency),
    },
  });
  await prisma.$disconnect()
}

exports.registerRecord = registerRecord