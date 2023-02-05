import prisma from './prisma'

async function getNodeList() {
  const nodes = await prisma.node.findMany()
  await prisma.$disconnect()
  return nodes;
}

exports.getNodeList = getNodeList