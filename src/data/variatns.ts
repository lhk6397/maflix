export const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -150,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: "tween",
    },
  },
};

export const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.1,
      type: "tween",
    },
  },
};

export const rowVariants = {
  hidden: (isForward: boolean) => ({
    x:
      typeof window !== "undefined"
        ? isForward
          ? window.innerWidth + 5
          : -window.innerWidth - 5
        : 0,
  }),
  visible: {
    x: 0,
  },
  exit: (isForward: boolean) => ({
    x:
      typeof window !== "undefined"
        ? isForward
          ? -window.innerWidth - 5
          : window.innerWidth + 5
        : 0,
  }),
};
