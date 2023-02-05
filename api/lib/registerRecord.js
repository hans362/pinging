import prisma from "./prisma";

async function registerRecord(agentId, nodeId, latency) {
  if (!agentId || !nodeId || !latency) throw new Error('Invalid record data');
  const record = await prisma.record.create({
    data: {
      agent: { connect: { id: parseInt(agentId) } },
      node: { connect: { id: parseInt(nodeId) } },
      latency: parseInt(latency),
    },
  });
  await prisma.$disconnect()
}

exports.registerRecord = registerRecord