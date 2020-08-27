async function feed(parent, args, context, info) {
  const where = {
    AND: [
      {
        hue: {
          gte: args.hue - 7,
        },
      },
      {
        hue: {
          lte: args.hue + 7,
        },
      },
      {
        contrast_ratio: {
          gt: args.contrastRatio - 0.001,
        },
      },
      {
        contrast_ratio: {
          lt: args.contrastRatio + 0.001,
        },
      },
    ],
  };

  const colors = await context.prisma.rgbColorCodes.findMany({
    where,
    orderBy: args.orderBy,
  });

  return colors;
}

module.exports = {
  feed,
};
