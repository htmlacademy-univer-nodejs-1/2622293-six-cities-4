import chalk from 'chalk';
import { ICommand } from '../../shared/types/command.js';
import { TSVFileReader } from '../../shared/libs/index.js';
import { createOffer } from '../../shared/libs/file-reader/offer.js';
import { getErrorMessage } from '../../shared/helpers/common.js';

export class ImportCommand implements ICommand {
  public getName(): string {
    return '--import';
  }

  private onImportedLine(line: string): void {
    const offer = createOffer(line);
    console.info(offer);
  }

  private onCompleteImport(count: number): void {
    console.info(`Imported ${count} rows`);
  }

  public execute(...parameters: string[]): void {
    const [filename] = parameters;
    const fileReader = new TSVFileReader(filename.trim());

    fileReader.on('line', this.onImportedLine);
    fileReader.on('end', this.onCompleteImport);

    try {
      fileReader.read();
    } catch (err) {
      console.log(chalk.red(`cant import data from file: ${filename}`));
      console.error(getErrorMessage(err));
    }
  }
}
