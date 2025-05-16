import * as readlineSync from 'readline-sync';

interface Menu {
    message: string;
    handleInput(input: string): void;
}

interface UssdState {
    path: string[];
    tempData: {
        number?: string;
        amount?: number;
        clear(): void;
    };
    getCurrentPath(): string;
}

class UssdStateImpl implements UssdState {
    path: string[] = [];
    tempData = {
        number: undefined,
        amount: undefined,
        clear() {
            this.number = undefined;
            this.amount = undefined;
        }
    };

    getCurrentPath(): string {
        return this.path.join('-');
    }
}

class MenuImpl implements Menu {
    constructor(
        public message: string,
        private handler: (input: string, state: UssdState) => void,
        private state: UssdState
    ) { }

    handleInput(input: string): void {
        this.handler(input, this.state);
    }
}

class MenuService {
    private menus: Map<string, Menu> = new Map();
    private state: UssdState;
    private account: BankAccount;

    constructor(account: BankAccount) {
        this.state = new UssdStateImpl();
        this.account = account;
        this.initMenus();
    }

    private initMenus(): void {
        // Menu Principal
        this.menus.set("", new MenuImpl(
            `Menu Principal:
1. Acheter crédit ou Offre Yas
2. Transférer argent (vers toute destination)
3. Mvola Credit ou Epargne
4. Retrait argent
5. Voir solde
6. Quitter`,
            (input: string, state: UssdState) => {
                switch (input) {
                    case "1":
                    case "2":
                    case "3":
                    case "4":
                        state.path.push(input);
                        this.navigate();
                        break;
                    case "5":
                        this.showBalance();
                        break;
                    case "6":
                        console.log("Merci d'avoir utilisé le service.");
                        process.exit(0);
                        break;
                    default:
                        this.invalidInput();
                }
            },
            this.state
        ));

        // Menu Acheter Crédit
        this.menus.set("1", new MenuImpl(
            `ACHETER CREDIT OU OFFRE YAS:
1. Crédit pour mon numéro
2. Crédit pour autre numéro
3. Offre pour mon numéro
4. Offre pour autre numéro
0. Retour`,
            (input: string, state: UssdState) => {
                switch (input) {
                    case "0":
                        this.goBack();
                        break;
                    case "1":
                    case "2":
                    case "3":
                    case "4":
                        state.path.push(input);
                        this.navigate();
                        break;
                    default:
                        this.invalidInput();
                }
            },
            this.state
        ));

        // Menu Crédit pour mon numéro
        this.menus.set("1-1", new MenuImpl(
            `Crédit pour mon numéro:
1. Sans numéro
2. Mvola Epargne
3. Rembourser une Avance
0. Retour`,
            (input: string, state: UssdState) => {
                switch (input) {
                    case "0":
                        this.goBack();
                        break;
                    case "1":
                        this.handlePurchase(1000, "Crédit Standard 1000 Ar");
                        break;
                    case "2":
                        this.handlePurchase(2000, "Crédit Standard 2000 Ar");
                        break;
                    case "3":
                        this.handlePurchase(5000, "Crédit Standard 5000 Ar");
                        break;
                    default:
                        this.invalidInput();
                }
            },
            this.state
        ));

        // Menu Crédit à envoyer
        this.menus.set("1-2", new MenuImpl(
            `Crédit à envoyer:
1. Recharger directement
2. Code de recharge
0. Retour`,
            (input: string, state: UssdState) => {
                switch (input) {
                    case "0":
                        this.goBack();
                        break;
                    case "1":
                        this.handlePurchase(10000, "Crédit VIP 10000 Ar");
                        break;
                    case "2":
                        this.handlePurchase(20000, "Crédit VIP 20000 Ar");
                        break;
                    default:
                        this.invalidInput();
                }
            },
            this.state
        ));

        // Menu Transférer argent
        this.menus.set("2", new MenuImpl(
            `Transférer argent:
1. Mvola
2. Autre opérateur
3. Banque
0. Retour`,
            (input: string, state: UssdState) => {
                switch (input) {
                    case "0":
                        this.goBack();
                        break;
                    case "1":
                    case "2":
                    case "3":
                        state.path.push(input);
                        this.askRecipientNumber(input);
                        break;
                    default:
                        this.invalidInput();
                }
            },
            this.state
        ));
    }

    public start(): void {
        this.navigate();
    }

    private navigate(): void {
        const path = this.state.getCurrentPath();
        const menu = this.menus.get(path);

        if (!menu) {
            console.log("Menu introuvable. Retour au menu principal.");
            this.state.path = [];
            this.navigate();
            return;
        }

        drawBox('MENU USSD', menu.message.split('\n'));
        const input = readlineSync.question('Votre choix: ');
        menu.handleInput(input);
    }

    private goBack(): void {
        if (this.state.path.length > 0) {
            this.state.path.pop();
        }
        this.navigate();
    }

    private invalidInput(): void {
        console.log("Choix invalide, veuillez réessayer.");
        this.navigate();
    }

    private handlePurchase(amount: number, description: string): void {
        if (this.account.withdraw(amount)) {
            drawSpinner('Traitement de l\'achat en cours', 1500);
            drawBox('ACHAT RÉUSSI', [
                `Description: ${description}`,
                `Montant: ${formatAmount(amount)}`,
                `Nouveau solde: ${formatAmount(this.account.getBalance())}`,
                drawProgressBar(100)
            ]);
        } else {
            drawBox('ERREUR', [
                'Solde insuffisant pour effectuer l\'achat.',
                drawProgressBar(0)
            ]);
        }

        readlineSync.question('\nAppuyez sur Entrée pour revenir au menu principal...');
        this.state.path = [];
        this.navigate();
    }

    private askRecipientNumber(transferType: string): void {
        drawBox('TRANSFERT', [
            'Entrez le numéro du destinataire:',
            '',
            '0. Retour au menu principal'
        ]);

        const number = readlineSync.question('Numéro: ');

        if (number === '0') {
            this.goBack();
            return;
        }

        if (number.length < 8) {
            console.log("Numéro invalide.");
            this.askRecipientNumber(transferType);
            return;
        }

        this.state.tempData.number = number;
        this.askTransferAmount(transferType);
    }

    private askTransferAmount(transferType: string): void {
        drawBox('TRANSFERT', [
            'Entrez le montant à transférer:',
            '',
            '0. Retour au menu principal'
        ]);

        const amountStr = readlineSync.question('Montant: ');

        if (amountStr === '0') {
            this.goBack();
            return;
        }

        const amount = parseFloat(amountStr);

        if (isNaN(amount) || amount <= 0) {
            console.log("Montant invalide.");
            this.askTransferAmount(transferType);
            return;
        }

        this.state.tempData.amount = amount;
        this.confirmTransfer(transferType);
    }

    private confirmTransfer(transferType: string): void {
        const number = this.state.tempData.number;
        const amount = this.state.tempData.amount;

        if (!number || !amount) {
            this.goBack();
            return;
        }

        drawBox('CONFIRMATION', [
            `Confirmer le transfert de ${formatAmount(amount)} vers ${number} via ${this.mapTransferType(transferType)} ?`,
            '',
            '1. Oui',
            '0. Non'
        ]);

        const choice = readlineSync.question('Votre choix: ');

        if (choice === '1') {
            this.askPassword(transferType);
        } else {
            console.log("Transfert annulé.");
            this.state.path = [];
            this.navigate();
        }
    }

    private askPassword(transferType: string): void {
        if (!verifyPinCode(this.account)) {
            this.state.path = [];
            this.navigate();
            return;
        }

        const number = this.state.tempData.number;
        const amount = this.state.tempData.amount;

        if (!number || !amount) {
            this.goBack();
            return;
        }

        const targetAccount = new BankAccount(number, 0);

        if (this.account.transfer(amount, targetAccount)) {
            drawSpinner('Traitement du transfert en cours', 2000);
            drawBox('TRANSFERT RÉUSSI', [
                `Destinataire: ${number}`,
                `Montant: ${formatAmount(amount)}`,
                `Nouveau solde: ${formatAmount(this.account.getBalance())}`,
                drawProgressBar(100)
            ]);
        } else {
            drawBox('ERREUR', [
                'Montant invalide ou solde insuffisant.',
                drawProgressBar(0)
            ]);
        }

        this.state.tempData.clear();
        readlineSync.question('\nAppuyez sur Entrée pour revenir au menu principal...');
        this.state.path = [];
        this.navigate();
    }

    private mapTransferType(input: string): string {
        switch (input) {
            case "1": return "Mvola";
            case "2": return "Autre opérateur";
            case "3": return "Banque";
            default: return "Inconnu";
        }
    }

    private showBalance(): void {
        const balance = this.account.getBalance();
        drawBox('SOLDE', [
            `Votre solde actuel est : ${formatAmount(balance)}`,
            '',
            '0. Retour au menu principal'
        ]);
        readlineSync.question('\nAppuyez sur Entrée pour revenir au menu principal...');
        this.state.path = [];
        this.navigate();
    }
}

function drawProgressBar(percent: number, width: number = 20): string {
    const filledWidth = Math.round(width * percent / 100);
    const emptyWidth = width - filledWidth;
    const filled = '█'.repeat(filledWidth);
    const empty = '░'.repeat(emptyWidth);
    return `[${filled}${empty}] ${percent}%`;
}

function drawBox(title: string, content: string[]): void {
    const width = Math.max(...content.map(line => line.length), title.length) + 4;
    const horizontalBorder = '┌' + '─'.repeat(width - 2) + '┐';
    const bottomBorder = '└' + '─'.repeat(width - 2) + '┘';

    console.log(horizontalBorder);
    console.log(`│ ${title.padEnd(width - 4)} │`);
    console.log('├' + '─'.repeat(width - 2) + '┤');

    content.forEach(line => {
        console.log(`│ ${line.padEnd(width - 4)} │`);
    });

    console.log(bottomBorder);
}

function drawSpinner(message: string, durationMs: number = 1500): void {
    const spinnerChars = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    const startTime = Date.now();
    let i = 0;

    while (Date.now() - startTime < durationMs) {
        process.stdout.write(`\r${spinnerChars[i]} ${message}`);
        i = (i + 1) % spinnerChars.length;
        for (let j = 0; j < 10000000; j++) { }
    }
    process.stdout.write('\r' + ' '.repeat(message.length + 2) + '\r');
}

class BankAccount {
    private accountNumber: string;
    private balance: number;
    private pin: string;
    private transactionHistory: Array<{
        date: Date;
        type: string;
        amount: number;
        balance: number;
    }>;

    constructor(accountNumber: string, initialBalance: number = 0, pin: string = "1234") {
        this.accountNumber = accountNumber;
        this.balance = initialBalance;
        this.pin = pin;
        this.transactionHistory = [];
    }

    public getBalance(): number {
        return this.balance;
    }

    public getAccountNumber(): string {
        return this.accountNumber;
    }

    public verifyPin(enteredPin: string): boolean {
        return this.pin === enteredPin;
    }

    public deposit(amount: number): boolean {
        if (amount <= 0) return false;

        this.balance += amount;
        this.addToHistory('DÉPÔT', amount);
        return true;
    }

    public withdraw(amount: number): boolean {
        if (amount <= 0 || amount > this.balance) return false;

        this.balance -= amount;
        this.addToHistory('RETRAIT', -amount);
        return true;
    }

    public transfer(amount: number, targetAccount: BankAccount): boolean {
        if (amount <= 0 || amount > this.balance) return false;

        this.balance -= amount;
        targetAccount.deposit(amount);
        this.addToHistory('TRANSFERT', -amount);
        return true;
    }

    public getTransactionHistory(): Array<{
        date: Date;
        type: string;
        amount: number;
        balance: number;
    }> {
        return this.transactionHistory;
    }

    private addToHistory(type: string, amount: number) {
        this.transactionHistory.push({
            date: new Date(),
            type,
            amount,
            balance: this.balance
        });
    }
}

function clearScreen(): void {
    console.clear();
}

function formatAmount(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'MGA'
    }).format(amount);
}

function formatDate(date: Date): string {
    return new Intl.DateTimeFormat('fr-FR', {
        dateStyle: 'short',
        timeStyle: 'short'
    }).format(date);
}

function displayMainMenu(): void {
    const options = [
        '1. Consulter le solde',
        '2. Faire un dépôt',
        '3. Faire un retrait',
        '4. Faire un transfert',
        '5. Historique des transactions',
        '6. Quitter'
    ];

    drawBox('MENU PRINCIPAL', options);
}

function showBalance(account: BankAccount): void {
    drawSpinner('Récupération du solde en cours', 1000000);

    const balanceStr = formatAmount(account.getBalance());
    const balanceValue = account.getBalance();
    const maxBalance = 100000;
    const percent = Math.min(100, Math.round((balanceValue / maxBalance) * 100));

    drawBox('SOLDE ACTUEL', [
        `Compte: ${account.getAccountNumber()}`,
        `Solde: ${balanceStr}`,
        drawProgressBar(percent),
        '',
        '0. Retour au menu principal'
    ]);
}

function verifyPinCode(account: BankAccount): boolean {
    drawBox('SÉCURITÉ', [
        'Veuillez entrer votre code PIN à 4 chiffres',
        '',
        '0. Retour au menu principal'
    ]);

    let attempts = 3;

    while (attempts > 0) {
        const pin = readlineSync.question('Code PIN (ou 0 pour retourner): ', {
            hideEchoBack: true
        });

        if (pin === '0') {
            return false;
        }

        if (pin.length !== 4 || !/^\d+$/.test(pin)) {
            console.log('Le code PIN doit contenir exactement 4 chiffres.');
            attempts--;
            console.log(`Il vous reste ${attempts} tentative(s).`);
            continue;
        }

        drawSpinner('Vérification du code PIN', 1000);

        if (account.verifyPin(pin)) {
            drawBox('VÉRIFICATION RÉUSSIE', [
                'Code PIN correct.',
                drawProgressBar(100)
            ]);
            return true;
        } else {
            attempts--;
            drawBox('ERREUR', [
                'Code PIN incorrect.',
                `Il vous reste ${attempts} tentative(s).`,
                drawProgressBar(attempts * 33)
            ]);
        }
    }

    drawBox('SÉCURITÉ', [
        'Trop de tentatives incorrectes.',
        'Retour au menu principal.',
        drawProgressBar(0)
    ]);
    return false;
}

function handleDeposit(account: BankAccount): void {
    drawBox('DÉPÔT D\'ARGENT', [
        'Veuillez saisir le montant à déposer',
        '',
        '0. Retour au menu principal'
    ]);

    const input = readlineSync.question('\nMontant à déposer (ou 0 pour retourner): ');

    if (input === '0') {
        return;
    }

    const amount = parseFloat(input);

    if (isNaN(amount)) {
        console.log('Montant invalide.');
        return;
    }

    if (account.deposit(amount)) {
        drawSpinner('Traitement du dépôt en cours', 1500);

        drawBox('DÉPÔT RÉUSSI', [
            `Montant: ${formatAmount(amount)}`,
            `Nouveau solde: ${formatAmount(account.getBalance())}`,
            drawProgressBar(100)
        ]);
    } else {
        drawBox('ERREUR', [
            'Le montant doit être supérieur à 0.',
            drawProgressBar(0)
        ]);
    }
}

function handleWithdraw(account: BankAccount): void {
    if (!verifyPinCode(account)) {
        return;
    }

    drawBox('RETRAIT D\'ARGENT', [
        'Veuillez saisir le montant à retirer',
        '',
        '0. Retour au menu principal'
    ]);

    const input = readlineSync.question('\nMontant à retirer (ou 0 pour retourner): ');

    if (input === '0') {
        return;
    }

    const amount = parseFloat(input);

    if (isNaN(amount)) {
        console.log('Montant invalide.');
        return;
    }

    if (account.withdraw(amount)) {
        drawSpinner('Traitement du retrait en cours', 1500);

        drawBox('RETRAIT RÉUSSI', [
            `Montant: ${formatAmount(amount)}`,
            `Nouveau solde: ${formatAmount(account.getBalance())}`,
            drawProgressBar(100)
        ]);
    } else {
        drawBox('ERREUR', [
            'Montant invalide ou solde insuffisant.',
            drawProgressBar(0)
        ]);
    }
}

function handleTransfer(account: BankAccount): void {
    if (!verifyPinCode(account)) {
        return;
    }

    drawBox('TRANSFERT D\'ARGENT', [
        'Veuillez saisir les informations du transfert',
        '',
        '0. Retour au menu principal'
    ]);

    const targetAccountInput = readlineSync.question('\nNuméro du compte destinataire (ou 0 pour retourner): ');

    if (targetAccountInput === '0') {
        return;
    }

    const targetAccountNumber = targetAccountInput;
    const targetAccount = new BankAccount(targetAccountNumber, 0);

    const amountInput = readlineSync.question('Montant à transférer (ou 0 pour retourner): ');

    if (amountInput === '0') {
        return;
    }

    const amount = parseFloat(amountInput);

    if (isNaN(amount)) {
        console.log('Montant invalide.');
        return;
    }

    if (account.transfer(amount, targetAccount)) {
        drawSpinner('Traitement du transfert en cours', 2000);

        drawBox('TRANSFERT RÉUSSI', [
            `Destinataire: ${targetAccountNumber}`,
            `Montant: ${formatAmount(amount)}`,
            `Nouveau solde: ${formatAmount(account.getBalance())}`,
            drawProgressBar(100)
        ]);
    } else {
        drawBox('ERREUR', [
            'Montant invalide ou solde insuffisant.',
            drawProgressBar(0)
        ]);
    }
}

function showTransactionHistory(account: BankAccount): void {
    if (!verifyPinCode(account)) {
        return;
    }

    const history = account.getTransactionHistory();

    drawSpinner('Chargement de l\'historique', 1500);

    if (history.length === 0) {
        drawBox('HISTORIQUE DES TRANSACTIONS', [
            'Aucune transaction à afficher.',
            '',
            '0. Retour au menu principal'
        ]);
        return;
    }

    console.log('\n┌─── HISTORIQUE DES TRANSACTIONS ───┐');
    console.log('│                                   │');

    history.forEach(transaction => {
        console.log(`│ ${formatDate(transaction.date)} | ${transaction.type.padEnd(8)} │`);
        console.log(`│ ${formatAmount(transaction.amount).padStart(12)} | Solde: ${formatAmount(transaction.balance)} │`);
        console.log('│                                   │');
    });

    console.log('└───────────────────────────────────┘');
    console.log('\n0. Retour au menu principal');
    readlineSync.question('\nAppuyez sur une touche pour retourner au menu principal...');
}

function handleMainMenuChoice(choice: string, account: BankAccount): boolean {
    switch (choice) {
        case '1':
            showBalance(account);
            break;
        case '2':
            handleDeposit(account);
            break;
        case '3':
            handleWithdraw(account);
            break;
        case '4':
            handleTransfer(account);
            break;
        case '5':
            showTransactionHistory(account);
            break;
        case '6':
            console.log('\nMerci d\'avoir utilisé notre service USSD. À bientôt!');
            return false;
        default:
            console.log('\nOption invalide. Veuillez réessayer.');
    }
    return true;
}

function startUSSDSession() {
    const userAccount = new BankAccount('130103', 1000000, "1234");
    let lastActivityTime = Date.now();
    const TIMEOUT_DURATION = 5000;

    console.clear();
    console.log('Démarrage de l\'application USSD...');

    for (let i = 0; i <= 100; i += 10) {
        process.stdout.write(`\r${drawProgressBar(i)}`);
        for (let j = 0; j < 5000000; j++) { }
    }
    console.log('\n');

    const checkTimeout = () => {
        const currentTime = Date.now();
        if (currentTime - lastActivityTime > TIMEOUT_DURATION) {
            console.clear();
            drawBox('SESSION EXPIRÉE', [
                'Votre session a expiré après 5 secondes d\'inactivité.',
                'Merci d\'avoir utilisé notre service USSD.',
                'À bientôt!'
            ]);
            process.exit(0);
        }
    };

    const timeoutInterval = setInterval(checkTimeout, 1000);

    const menuService = new MenuService(userAccount);
    menuService.start();

    clearInterval(timeoutInterval);
}

console.log('Démarrage de l\'application USSD...');
startUSSDSession(); 