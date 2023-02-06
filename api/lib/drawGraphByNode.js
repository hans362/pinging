import prisma from "./prisma";
const { getAgentNameById } = require('./getAgentNameById');
const { getNodeNameById } = require('./getNodeNameById');

async function processRecords(records) {
  const agentIds = [...new Set(records.map(record => record.agentId))];
  const series = [];
  for await (const agentId of agentIds) {
    const agentRecords = records.filter(record => record.agentId === agentId);
    const data = agentRecords.map(record => [Date.parse(record.createdAt), record.latency == -1 ? null : record.latency]);
    const loss = agentRecords.filter(record => record.loss != 0 || record.latency == -1).map(record => {
      const next = agentRecords.find(nextRecord => nextRecord.createdAt > record.createdAt);
      return [{ xAxis: Date.parse(record.createdAt) }, { xAxis: Date.parse(next ? next.createdAt : record.createdAt) }];
    });
    series.push({
      name: await getAgentNameById(agentId),
      type: 'line',
      data: data,
      smooth: true,
      markArea: {
        silent: true,
        data: loss,
        itemStyle: {
          opacity: 0.25,
        },
      },
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
    },
    orderBy: {
      createdAt: 'asc',
    },
  });
  const series = await processRecords(records);
  const title = {
    text: 'Pinging',
    subtext: 'To ' + await getNodeNameById(nodeId),
  }
  return { title, series };
}

exports.drawGraphByNode = drawGraphByNode;