import chalk from 'chalk';
import ora from 'ora';

export class UI {
  private static readonly _boxWidth: number = 40;
  private static readonly _boxChar: string = '─';
  private static readonly _boxVertical: string = '│';
  private static readonly _boxCornerTl: string = '┌';
  private static readonly _boxCornerTr: string = '┐';
  private static readonly _boxCornerBl: string = '└';
  private static readonly _boxCornerBr: string = '┘';

  /* eslint-disable no-console */
  public static showInfo(message: string): void {
    console.log(chalk.blue('ℹ'), message);
  }

  public static showSuccess(message: string): void {
    console.log(chalk.green('✓'), message);
  }

  public static showError(message: string): void {
    console.log(chalk.red('✗'), message);
  }

  public static showWarning(message: string): void {
    console.log(chalk.yellow('⚠'), message);
  }

  public static drawBox(title: string, content: string[]): void {
    const titleLine = this._centerText(title, this._boxWidth);
    const topBorder =
      this._boxCornerTl + this._boxChar.repeat(this._boxWidth - 2) + this._boxCornerTr;
    const bottomBorder =
      this._boxCornerBl + this._boxChar.repeat(this._boxWidth - 2) + this._boxCornerBr;

    console.log('\n' + topBorder);
    console.log(this._boxVertical + titleLine + this._boxVertical);
    console.log(this._boxVertical + this._boxChar.repeat(this._boxWidth - 2) + this._boxVertical);

    content.forEach(line => {
      const paddedLine = this._padText(line, this._boxWidth - 2);
      console.log(this._boxVertical + paddedLine + this._boxVertical);
    });

    console.log(bottomBorder + '\n');
  }
  /* eslint-enable no-console */

  public static formatAmount(amount: number): string {
    return new Intl.NumberFormat('fr-MG', {
      style: 'currency',
      currency: 'MGA',
    }).format(amount);
  }

  public static async drawSpinner(message: string, duration: number): Promise<void> {
    const spinner = ora(message).start();
    await new Promise(resolve => setTimeout(resolve, duration));
    spinner.succeed();
  }

  private static _centerText(text: string, width: number): string {
    const padding = Math.max(0, width - 2 - text.length);
    const leftPad = Math.floor(padding / 2);
    const rightPad = padding - leftPad;
    return ' '.repeat(leftPad) + text + ' '.repeat(rightPad);
  }

  private static _padText(text: string, width: number): string {
    return text.padEnd(width);
  }
}
