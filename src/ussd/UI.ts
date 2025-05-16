import chalk from 'chalk';
import ora from 'ora';

export class UI {
    private static readonly BOX_WIDTH = 50;
    private static readonly BOX_CHAR = '─';
    private static readonly BOX_VERTICAL = '│';
    private static readonly BOX_CORNER_TL = '┌';
    private static readonly BOX_CORNER_TR = '┐';
    private static readonly BOX_CORNER_BL = '└';
    private static readonly BOX_CORNER_BR = '┘';

    public static drawBox(title: string, content: string[]): void {
        const titleLine = ` ${title} `;
        const titlePadding = Math.floor((this.BOX_WIDTH - titleLine.length) / 2);

        // Top border with title
        console.log(
            chalk.blue(
                this.BOX_CORNER_TL +
                this.BOX_CHAR.repeat(titlePadding) +
                chalk.bold(titleLine) +
                this.BOX_CHAR.repeat(this.BOX_WIDTH - titlePadding - titleLine.length) +
                this.BOX_CORNER_TR
            )
        );

        // Content
        content.forEach(line => {
            const padding = ' '.repeat(Math.floor((this.BOX_WIDTH - line.length) / 2));
            console.log(
                chalk.blue(this.BOX_VERTICAL) +
                padding +
                line +
                ' '.repeat(this.BOX_WIDTH - line.length - padding.length) +
                chalk.blue(this.BOX_VERTICAL)
            );
        });

        // Bottom border
        console.log(
            chalk.blue(
                this.BOX_CORNER_BL +
                this.BOX_CHAR.repeat(this.BOX_WIDTH) +
                this.BOX_CORNER_BR
            )
        );
    }

    public static drawProgressBar(percent: number): void {
        const width = 30;
        const filled = Math.floor(width * (percent / 100));
        const empty = width - filled;

        const bar = chalk.green('█'.repeat(filled)) + chalk.gray('░'.repeat(empty));
        console.log(`\n${bar} ${percent}%\n`);
    }

    public static async drawSpinner(message: string, duration: number): Promise<void> {
        const spinner = ora({
            text: message,
            color: 'blue'
        }).start();

        await new Promise(resolve => setTimeout(resolve, duration));
        spinner.succeed('Terminé');
    }

    public static formatAmount(amount: number): string {
        return new Intl.NumberFormat('fr-MG', {
            style: 'currency',
            currency: 'MGA'
        }).format(amount);
    }

    public static formatDate(date: Date): string {
        return new Intl.DateTimeFormat('fr-MG', {
            dateStyle: 'medium',
            timeStyle: 'short'
        }).format(date);
    }

    public static showError(message: string): void {
        console.log(chalk.red(`\n❌ ${message}\n`));
    }

    public static showSuccess(message: string): void {
        console.log(chalk.green(`\n✅ ${message}\n`));
    }

    public static showInfo(message: string): void {
        console.log(chalk.blue(`\nℹ️  ${message}\n`));
    }
} 