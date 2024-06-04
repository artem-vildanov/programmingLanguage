import * as readline from "readline";
import {
  stdin as input,
  stdout as output,
} from 'process';

const read = async function(): Promise<number> {
  const rl = readline.createInterface({
    input,
    output,
  });

  const inputValue = await new Promise((resolve) => {
    rl.question("input: ", (answer) => {
      resolve(Number(answer));
      rl.close();
    });
  });

  return Number(inputValue);
};

export default read;