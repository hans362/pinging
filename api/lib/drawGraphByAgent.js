import prisma from "./prisma";
const { getNodeNameById } = require('./getNodeNameById');
const { getAgentNameById } = require('./getAgentNameById');

async function processRecords(records) {
  const nodeIds = [...new Set(records.map(record => record.nodeId))];
  const series = [];
  for await (const nodeId of nodeIds) {
    const nodeRecords = records.filter(record => record.nodeId === nodeId);
    const data = nodeRecords.map(record => [Date.parse(record.createdAt), record.latency == -1 ? null : record.latency]);
    const loss = [];
    nodeRecords.filter(record => record.loss != 0 || record.latency == -1).forEach(record => {
      const next = nodeRecords.find(nextRecord => nextRecord.createdAt > record.createdAt);
      const pushCount = record.latency == -1 ? 10 : Math.round(record.loss / 0.1);
      for (let i = 0; i < pushCount; i++) loss.push([{ xAxis: Date.parse(record.createdAt) }, { xAxis: Date.parse(next ? next.createdAt : record.createdAt) }]);
    });
    series.push({
      name: await getNodeNameById(nodeId),
      symbol: 'none',
      type: 'line',
      data: data,
      smooth: true,
      markArea: {
        silent: true,
        data: loss,
        itemStyle: {
          opacity: 0.05,
        },
      },
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