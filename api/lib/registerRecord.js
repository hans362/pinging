import prisma from "./prisma";

async function registerRecord(agentId, nodeId, latency, loss) {
  if (!agentId || !nodeId || !latency || !loss) throw new Error('Invalid record data');
  await prisma.record.create({
    data: {
      agent: { connect: { id: parseInt(agentId) } },
      node: { connect: { id: parseInt(nodeId) } },
      latency: parseFloat(latency),
      loss: parseFloat(loss)
    },
  });
  await prisma.$disconnect()
}

exports.registerRecord = registerRecord