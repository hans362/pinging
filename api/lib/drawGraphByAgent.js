import prisma from "./prisma";
const { getNodeNameById } = require('./getNodeNameById');
const { getAgentNameById } = require('./getAgentNameById');

async function processRecords(records) {
  const nodeIds = [...new Set(records.map(record => record.nodeId))];
  const series = [];
  for await (const nodeId of nodeIds) {
    const nodeRecords = records.filter(record => record.nodeId === nodeId);
    const data = nodeRecords.map(record => [Date.parse(record.createdAt), record.latency]);
    series.push({
      name: await getNodeNameById(nodeId),
      type: 'line',
      data: data,
      smooth: true,
    });
  }
  return series;
}

async function drawGraphByAgent(agentId) {
  const records = await prisma.record.findMany({
    where: {
      agentId: parseInt(agentId),
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
  const title = {
    text: 'Pinging',
    subtext: 'From ' + await getAgentNameById(agentId),
  }
  return { title, series };
}

exports.drawGraphByAgent = drawGraphByAgent;