//solana nodes accept HTTP requests using the JSON-RPC 2.0 specification

const web3 = require("@solana/web3.js")
const keys = require("./keys")
const solana = require("./solana")
const figlet = require("figlet")
const chalk = require("chalk")
const inquirer = require("inquirer")
const helper = require("./helper")

const main = async () => {
  let amount, ratio, randomNumber
  let userwallet = await web3.Keypair.fromSecretKey(keys.userSecretKey)
  let treasuryWallet = await web3.Keypair.fromSecretKey(keys.treasurySecretKey)

  const question1 = {
    type: 'input',
    name: 'amount',
    message: "What is the bidding amount you want to stake?",
    validate(value) {
      const pass = value.match(
        /^([0-2])$|^([0-1]\.[0-9])$|^2\.[0-5]$/i
      );
      if (pass) {
        return true;
      }

      return 'Please enter a valid bidding amount';
    },
  }

  const question2 = {
    type: "rawlist",
    name: "ratio",
    message: "What is the ratio of your staking?",
    choices: ["1:1.25", "1:1.5", "1.75", "1:2"],
    filter: function (val) {
      const ratio = val.split(":")[1];
      return ratio;
    },
  }

  const question3 = {
    type: 'input',
    name: 'randomNumber',
    message: "Guess the random number from 1 to 5(both 1, 5 included)",
    validate(value) {
      const pass = value.match(
        /^[1-5]$/i
      );
      if (pass) {
        return true;
      }

      return 'Please enter a valid number';
    },
  }

  try {
    console.log(
      chalk.green(
        figlet.textSync("SOL Stake", {
          font: "Standard",
          horizontalLayout: "default",
          verticalLayout: "default"
        })
      )
    );
    await solana.airdropSolUser()
    console.log(chalk.yellow("The max bidding amount is 2.5"));

    await inquirer.prompt(question1).then((answer) => {
      amount = parseInt(answer.amount)
    });
    await solana.airdropSolUser()
    await inquirer.prompt(question2).then((answer) => {
      ratio = parseFloat(answer.ratio)
    });

    amount = await helper.totalAmtToBePaid(amount)
    console.log(chalk.white("You need to pay " + amount + " to move forward"))

    let prizeAmount = await helper.getReturnAmount(amount, ratio)
    console.log(chalk.green("You will get " + prizeAmount + " sol if guessing the number correctly"))

    await inquirer.prompt(question3).then((answer) => {
      randomNumber = parseInt(answer.randomNumber)
    });

    await solana.airdropSolTreasury()
    userwalletBalance = await solana.getwalletBalance(keys.userPublicKey)
    if (amount > userwalletBalance) {
      console.log(chalk.green("You have " + userwalletBalance + " sol in your wallet"))
      console.log(chalk.red("You dont have suffcient Balance in your wallet"))
      process.exit(1)
    }
    let paymentSignature = await solana.transferSOL(userwallet, treasuryWallet, amount)
    console.log("Signature of payment for playing the game " + chalk.green(paymentSignature))
    if (randomNumber == await helper.randomNumber(1, 5)) {
      console.log(chalk.green("Your guess is absolutely correct"))
      let transactionSignature = await solana.transferSOL(treasuryWallet, userwallet, prizeAmount)
      console.log("Here is your price signature " + chalk.green(transactionSignature))
    } else {
      console.log(chalk.yellow("Better luck next time"))
    }
  } catch (error) {
    console.log("Error:", error)
  }

}

main()