import prisma from "./prisma";
const echarts = require('echarts');

async function drawGraph(nodeId) {
  //prisma query recent 24h records for nodeId
  const records = await prisma.record.findMany({
    where: {
      nodeId: parseInt(nodeId),
      createdAt: {
        gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
      }
    },
    orderBy: {
      createdAt: 'asc',
    },
  });
  const chart = echarts.init(null, null, {
    renderer: 'svg', // 必须使用 SVG 模式
    ssr: true, // 开启 SSR
    width: 400, // 需要指明高和宽
    height: 300
  });
  //draw multiple lines for each agent
  //console.log(records);
  //console.log('---');
  const agentIds = [...new Set(records.map(record => record.agentId))];
  const series = [];
  for (const agentId of agentIds) {
    const agentRecords = records.filter(record => record.agentId === agentId);
    const data = agentRecords.map(record => [record.createdAt, record.latency]);
    //console.log(agentRecords);
    series.push({
      name: agentId,
      type: 'line',
      data: data,
    });
  }
  console.log(series);
  const option = {
    title: {
      text: 'Latency',
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: series.map(s => s.name),
    },
    //show full 24h
    xAxis: {
      type: 'time',
      boundaryGap: [0, '100%'],
      splitLine: {
        show: false,
      },
    },
    yAxis: {
      type: 'value',
      boundaryGap: [0, '100%'],
      splitLine: {
        show: false,
      },
    },
    series: series,
  };
  chart.setOption(option);
  return chart.renderToSVGString();
}

exports.drawGraph = drawGraph;