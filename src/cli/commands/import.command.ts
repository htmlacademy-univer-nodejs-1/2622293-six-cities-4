import chalk from 'chalk';
import { TSVFileReader } from '../../shared/libs/tsv-file-reader.js';
import { ICommand } from '../../shared/types/command.js';

export class ImportCommand implements ICommand {
  public getName(): string {
    return '--import';
  }

  public execute(...parameters: string[]): void {
    const [filename] = parameters;
    const fileReader = new TSVFileReader(filename.trim());

    try {
      fileReader.read();
      console.log(fileReader.toArray()); //не раскрасить, будет [Object, object]
    } catch (err) {
      if (!(err instanceof Error)) {
        throw err;
      }

      console.log(chalk.red(`cant import data from file: ${filename}`));
      console.log(chalk.bgRed(`Details: ${err.message}`));
    }
  }
}
