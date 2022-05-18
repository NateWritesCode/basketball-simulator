import { createLogger } from "@lvksh/logger";
import chalk from "chalk";

export const log = createLogger(
  {
    danger: {
      label: chalk.redBright`[DANGER]`,
      newLine: ``,
      newLineEnd: ``,
    },
    info: {
      label: chalk.blueBright`[INFO]`,
      newLine: ``,
      newLineEnd: ``,
    },
  },
  { padding: "PREPEND" },
  console.log
);
