import { faker } from "@faker-js/faker";
import inquirer from "inquirer";
import chalk from "chalk";
class Customer {
    firstName;
    lastName;
    age;
    gender;
    mobNumber;
    accNumber;
    constructor(fName, lName, age, gender, mob, acc) {
        this.firstName = fName;
        this.lastName = lName;
        this.age = age;
        this.gender = gender;
        this.mobNumber = mob;
        this.accNumber = acc;
    }
}
class Bank {
    customer = [];
    account = [];
    addCustomer(object) {
        this.customer.push(object);
    }
    addAccountNumber(object) {
        this.account.push(object);
    }
    transaction(accObject) {
        let newAccounts = this.account.filter((acc) => acc.accNumber !== accObject.accNumber);
        this.account = [...newAccounts, accObject];
    }
}
let myBank = new Bank();
for (let i = 1; i <= 3; i++) {
    let fName = faker.person.firstName();
    let lName = faker.person.lastName();
    let mob = parseInt(faker.phone.number("3#########"));
    let cus = new Customer(fName, lName, 25 * i, "male", mob, 1000 + i);
    myBank.addCustomer(cus);
    myBank.addAccountNumber({ accNumber: cus.accNumber, balance: 100 * i });
}
async function bankService(Bank) {
    while (true) {
        let service = await inquirer.prompt({
            name: "select",
            message: "Please select the Service",
            type: "list",
            choices: ["View Balance", "Cash Withdraw", "Cash Deposit", "Exit"]
        });
        if (service.select == "View Balance") {
            let res = await inquirer.prompt({
                name: "num",
                message: "Please enter your account number",
                type: "input",
            });
            let account = myBank.account.find((account) => account.accNumber == parseInt(res.num));
            if (!account) {
                console.log(chalk.bold.red("Invalid Account Number!"));
            }
            else {
                let name = myBank.customer.find((item) => item.accNumber == account?.accNumber);
                console.log(`Dear ${chalk.italic.green(name?.firstName)} ${chalk.italic.green(name?.lastName)}, Your Balance is ${chalk.bold.blueBright("$", account.balance)}`);
            }
        }
        if (service.select == "Cash Withdraw") {
            let res = await inquirer.prompt({
                name: "num",
                message: "Please enter your account number",
                type: "input",
            });
            let account = myBank.account.find((account) => account.accNumber == parseInt(res.num));
            if (!account) {
                console.log(chalk.bold.red("Invalid Account Number!"));
            }
            else {
                let ans = await inquirer.prompt({
                    name: "amount",
                    message: "Please enter amount",
                    type: "input",
                });
                let amount = parseFloat(ans.amount);
                if (amount > account.balance) {
                    console.log(chalk.bold.red("Insufficient Balance!"));
                }
                else {
                    let myBalance = account.balance - amount;
                    Bank.transaction({ accNumber: account.accNumber, balance: myBalance });
                    console.log(`New Balance: ${chalk.bold.blueBright("$", myBalance)}`);
                }
            }
        }
        if (service.select == "Cash Deposit") {
            let res = await inquirer.prompt({
                name: "num",
                message: "Please enter your account number",
                type: "input",
            });
            let account = myBank.account.find((account) => account.accNumber == parseInt(res.num));
            if (!account) {
                console.log(chalk.bold.red("Invalid Account Number!"));
            }
            else {
                let ans = await inquirer.prompt({
                    name: "amount",
                    message: "Please enter amount",
                    type: "input",
                });
                let amount = parseFloat(ans.amount);
                let myBalance = account.balance + amount;
                Bank.transaction({ accNumber: account.accNumber, balance: myBalance });
                console.log(`New Balance: ${chalk.bold.blueBright("$", myBalance)}`);
            }
        }
        if (service.select == "Exit") {
            console.log(chalk.bold.green("Thank you for using our service!"));
            process.exit();
        }
    }
}
bankService(myBank);
