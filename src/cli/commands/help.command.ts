import chalk from 'chalk';
import { ICommand } from '../../shared/types/command.js';

export class HelpCommand implements ICommand {
  public getName(): string {
    return '--help';
  }

  public async execute(..._parameters: string[]): Promise<void> {
    console.info(
      chalk.red(`
      Проект шесть городов.`),
      chalk.blue(`
        Пример:
          cli.js --<command> [--arguments]`),
      chalk.bgCyan(`
        Команды:
          --version:          # выводит версию приложения
          --help:             # выводит этот текст
          --import <path>     # импортирует данные из файла формата .tsv`)
    );
  }
}
