import prisma from "./prisma";

async function registerNode(name, hostname) {
  if (!name || !hostname) throw new Error('Invalid node name or node hostname');
  const nodeExists = await prisma.node.findUnique({
    where: {
      name,
    },
  })
  if (nodeExists) throw new Error('Node already exists');
  await prisma.node.create({
    data: {
      name,
      hostname,
    },
  })
  await prisma.$disconnect()
}

exports.registerNode = registerNode