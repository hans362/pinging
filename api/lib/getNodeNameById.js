import prisma from "./prisma";

async function getNodeNameById(nodeId) {
  const node = await prisma.node.findUnique({
    where: {
      id: parseInt(nodeId),
    },
  });
  return node.name;
}

exports.getNodeNameById = getNodeNameById;