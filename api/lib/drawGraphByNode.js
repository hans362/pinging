import prisma from "./prisma";
const { getAgentNameById } = require('./getAgentNameById');

async function processRecords(records) {
  const agentIds = [...new Set(records.map(record => record.agentId))];
  const series = [];
  for await (const agentId of agentIds) {
    const agentRecords = records.filter(record => record.agentId === agentId);
    const data = agentRecords.map(record => [Date.parse(record.createdAt), record.latency]);
    series.push({
      name: await getAgentNameById(agentId),
      type: 'line',
      data: data,
      smooth: true,
    });
  }
  return series;
}

async function drawGraphByNode(nodeId) {
  const records = await prisma.record.findMany({
    where: {
      nodeId: parseInt(nodeId),
      createdAt: {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
      NOT: {
        latency: -1,
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
  });
  const series = await processRecords(records);
  return series;
}

exports.drawGraphByNode = drawGraphByNode;