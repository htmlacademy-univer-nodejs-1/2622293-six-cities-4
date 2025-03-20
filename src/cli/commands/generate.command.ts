import got from 'got';
import { ICommand } from '../../shared/types/command.js';
import { IMockServerData } from '../../shared/types/mock-server-data.types.js';
import chalk from 'chalk';
import { TSVOfferGenerator } from '../../shared/libs/offer-generator/tsv-offer-generator.js';
import { TSVFileWriter } from '../../shared/libs/index.js';

export class GenerateCommand implements ICommand {
  private initialData: IMockServerData;

  private async load(url: string) {
    try {
      this.initialData = await got.get(url).json();
    } catch {
      throw new Error('Failed to load data.');
    }
  }

  private async write(filepath: string, offerCount: number) {
    const tsvOfferGenerator = new TSVOfferGenerator(this.initialData);
    const tsvFileWriter = new TSVFileWriter(filepath);
    for (let i = 0; i < offerCount; i++) {
      await tsvFileWriter.write(tsvOfferGenerator.generate());
    }
  }

  public getName(): string {
    return '--generate';
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [count, filepath, url] = parameters;
    const offerCount = Number.parseInt(count, 10);

    try {
      await this.load(url);
      await this.write(filepath, offerCount);
      console.info(chalk.green(`File ${filepath} was generated.`));
    } catch (error: unknown) {
      console.error(chalk.bgRed.white('Cant generate data.'));
      if (error instanceof Error) {
        console.error(chalk.red(error.message));
      }
    }
  }
}
