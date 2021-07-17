"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-05-27T17:01:17.194Z",
    "2020-07-11T23:36:17.929Z",
    "2020-07-12T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ["USD", "United States dollar"],
  ["EUR", "Euro"],
  ["GBP", "Pound sterling"],
]);

// let movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

//elements
let labelWelcome = document.querySelector(".welcome");
let inputUser = document.querySelector(".user");
let inputPin = document.querySelector(".pin");
let btnlogin = document.querySelector(".arr");
let containerApp = document.querySelector(".contain");
let movementRow = document.querySelector(".movement-rows");
let movementBlock = document.querySelector(".movements");
let inValue = document.querySelector(".in-value");
let outValue = document.querySelector(".out-value");
let interestValue = document.querySelector(".interest-value");
let balanceValue = document.querySelector(".balance-value");
let btnTransfer = document.querySelector(".btn-transfer");
let btnClose = document.querySelector(".btn-close");
let btnRequest = document.querySelector(".btn-request");

let btnRegister = document.querySelector(".btn-register");
let containerModal = document.querySelector(".main-modal");
let inputOwner = document.querySelector(".owner");
let inputMovement = document.querySelector(".movement-modal");
let inputInterest = document.querySelector(".interest-rate");
let inputPinRegister = document.querySelector(".pinmodal");
let btnSubmit = document.querySelector(".btn-submit");
let inputTransferTo = document.querySelector(".input-Transfer-to");
let inputTransferAmount = document.querySelector(".input-Transfer-amount");
let labelDate = document.querySelector("#head");
let inputLoanAmount = document.querySelector(".input-loan-amount");
let inputCurrencyValue = document.querySelector(".currency");
let cnfrmUser = document.querySelector(".input-cnfrm-user");
let cnfrmPin = document.querySelector(".input-cnfrm-pin");
let remainingTime = document.querySelector(".remaining-time");
let btnSort = document.querySelector(".sort");

//start......................

//functions ..../////////////

//////////////////////////////////////////////////////////////////////////////////
//generating the user name .
let userNameGenerator = function (array) {
  array.forEach(function (obj) {
    obj.userName = obj.owner
      .split(" ")
      .map((name) => name[0])
      .join("")
      .toLowerCase();
  });
};
userNameGenerator(accounts);

// date converter
//creating date object.
let dateConverter = function (obj, ip = "default") {
  let dateObj;
  if (ip === "default") {
    dateObj = new Date();

    let options = {
      hour: "numeric",
      minute: "numeric",
      date: "numeric",
      month: "long",
      year: "numeric",
    };
    return new Intl.DateTimeFormat(obj.locale, options).format(dateObj);
  } else {
    dateObj = new Date(ip);
    return new Intl.DateTimeFormat(obj.locale).format(dateObj);
  }
};
//main /////////////movements addition////////////////////////////

//2 Row adder
let rowAdder = function (obj, sort = false) {
  //removing the initial rows
  movementBlock.innerHTML = "";
  //////////////////////////

  let movement = sort
    ? obj.movements.slice(0).sort((a, b) => a - b)
    : obj.movements;
  console.log(movement);

  /////////////////////
  movement.forEach(function (value, _) {
    let i = obj.movements.findIndex((mov) => mov === value);
    let currentDate = obj.movementsDates[i];

    //html to be inserted for every movement.
    //prettier-ignore
    let html = `  <div class="movement-rows">
                      <div class="part">
                          <span class="type  ${value > 0 ? "deposit" : "withdrawal"}">
                            ${i + 1} ${ value > 0 ? "deposit" : "withdrawal"}
                          </span>
                          <span class="date">${dateConverter(
                            currentAccount,
                            currentDate
                          )}</span>
                      </div>
                      <div class="amount">${currencyConverter(
                        Math.abs(value),
                        obj.currency,
                        obj.locale
                      )}</div>
                 </div>`;
    //inserting the html!
    movementBlock.insertAdjacentHTML("afterbegin", html);
  });

  return sort;
};

//creating the currency according to the user
let currencyConverter = function (number, currency, locale) {
  let obj = {
    style: "currency",
    currency,
  };

  return new Intl.NumberFormat(locale, obj).format(number);
};

//displays the total deposit!
let displayIn = function (obj) {
  let valueIn = obj.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  inValue.textContent = currencyConverter(valueIn, obj.currency, obj.locale);
};
//displays the total withdrawal!
let displayOut = function (obj) {
  let newValueOut;
  let valueOut = obj.movements.filter((mov) => mov < 0);
  if (valueOut.length !== 0) {
    newValueOut = valueOut.reduce((acc, mov) => acc + mov);
    outValue.textContent = currencyConverter(
      -1 * newValueOut,
      obj.currency,
      obj.locale
    );
  } else {
    outValue.textContent = "NA";
  }
};

//displays the total interest on the deposits
let displayInterest = function (obj) {
  let valueInterest = obj.movements
    .filter((mov) => mov > 0)
    .map((mov) => (mov * obj.interestRate) / 100)
    .reduce((acc, mov) => acc + mov, 0);
  interestValue.textContent = currencyConverter(
    valueInterest,
    obj.currency,
    obj.locale
  );
};
//displays the overall balance(deposit + withdrawal)
let displayBalanceValue = function (obj) {
  let valueOfBalance = obj.movements.reduce((acc, mov) => acc + mov, 0);
  balanceValue.textContent = currencyConverter(
    valueOfBalance,
    obj.currency,
    obj.locale
  );
};
//summation of all the function
let updateUI = function (obj) {
  displayIn(obj);
  displayOut(obj);
  displayInterest(obj);
  rowAdder(obj);
  displayBalanceValue(obj);
};

//display logout timer
let logOuter = function () {
  let time = 300;

  let timer = setInterval(() => {
    let min = `${Math.trunc(time / 60)}`.padStart(2, "0");
    let sec = `${Math.trunc(time % 60)}`.padStart(2, "0");

    remainingTime.textContent = `${min}:${sec}`;
    if (time === 0) {
      containerApp.style.opacity = 0;
      labelWelcome.textContent = `Login to get started ..`;
    }
    time--;
  }, 1000);
  return timer;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////

let currentAccount;
let timer;
let sort;

//login feature

btnlogin.addEventListener("click", function (event) {
  event.preventDefault();
  containerModal.style.opacity = 0;

  //storing the input values
  let user = inputUser.value;
  let Pin = inputPin.value;
  //finding the account in the arrays of accounts
  currentAccount = accounts.find((account) => account.userName === user);
  //validation
  if (currentAccount?.pin === +Pin) {
    containerApp.style.opacity = 100;
    labelWelcome.textContent = `Welcome ${currentAccount.owner
      .split(" ")
      .splice(0, 1)}`;

    labelDate.textContent = `As of ${dateConverter(currentAccount)}`;
    updateUI(currentAccount);
    if (timer) clearInterval(timer);
    timer = logOuter();

    inputUser.value = "";
    inputPin.value = "";
    inputPin.blur();
  } else {
    alert("no such account exists ..😯🤐");
    inputUser.value = "";
    inputPin.value = "";
    inputPin.blur();
  }
});

btnRegister.addEventListener("click", function (event) {
  event.preventDefault();
  containerModal.style.opacity = 100;
  containerApp.style.opacity = 0;
});

btnSubmit.addEventListener("click", function (e) {
  e.preventDefault();
  //collecting values
  let ownerValue = inputOwner.value;
  let movementValue = Array.from({ length: 1 }, (mov) => inputMovement.value);
  let interestValue = +inputInterest.value;
  let pinValue = +inputPinRegister.value;
  let currencyValue = inputCurrencyValue.value;
  console.log(
    ownerValue,
    movementValue,
    interestValue,
    pinValue,
    currencyValue
  );

  //adding empty object into accounts

  accounts.push({});
  console.log(accounts);

  // adding input values in the empty object;
  accounts[accounts.length - 1].owner = ownerValue;
  accounts[accounts.length - 1].movements = Array.from(
    { length: 1 },
    (mov) => +movementValue
  );
  accounts[accounts.length - 1].interestRate = interestValue;
  accounts[accounts.length - 1].pin = pinValue;
  accounts[accounts.length - 1].movementsDates = Array.from(
    { length: 1 },
    (mov) => new Date().toISOString()
  );
  accounts[accounts.length - 1].currency = currencyValue;
  accounts[accounts.length - 1].locale = navigator.language;
  userNameGenerator(accounts);
  console.log(currencyValue);

  console.log(accounts);

  inputOwner.value = "";
  inputInterest.value = "";
  inputMovement.value = "";
  inputPinRegister.value = "";

  alert("account succesfully created !");

  containerModal.style.opacity = 0;
});

//  adding transfer operation ..................................

// transfer operation
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();

  //collecting data from i/p feild
  let transferTo = inputTransferTo.value;
  let transferAmount = +inputTransferAmount.value;

  //finding reciever account.
  let recieverAccount = accounts.find((obj) => obj.userName === transferTo);

  //push the amount into the movement array
  if (recieverAccount) {
    currentAccount.movements.push(-1 * transferAmount);
    recieverAccount.movements.push(transferAmount);
    currentAccount.movementsDates.push(new Date());
    recieverAccount.movementsDates.push(new Date());

    setTimeout(() => {
      updateUI(currentAccount);
    }, 2000);
  } else {
    alert(`account cannot be found!😑`);
  }

  //clearing the input feilds
  inputTransferTo.value = "";
  inputTransferAmount.value = "";
  inputTransferAmount.blur();

  //resetting timer
  clearInterval(timer);
  logOuter();
});

// adding request loan feature

btnRequest.addEventListener("click", function (e) {
  e.preventDefault();

  //collecting input value
  let loanAmount = +inputLoanAmount.value;

  //condition for sanctioning the loan

  if (
    currentAccount.movements.some((mov) => mov > 0.1 * loanAmount) &&
    loanAmount !== 0
  ) {
    currentAccount.movements.push(loanAmount);
    currentAccount.movementsDates.push(new Date());
  } else {
    alert("this amount can not be sanctioned..😶");
  }
  // set timeout function
  setTimeout(() => updateUI(currentAccount), 2500);

  //clearing i/p feilds
  inputLoanAmount.value = "";
  inputLoanAmount.blur();

  //resetting timer
  clearInterval(timer);
  logOuter();
});

// closing operation

btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  //collecting input data
  let cnfrmUserValue = cnfrmUser.value;
  let cnfrmPinValue = +cnfrmPin.value;

  // verifying if it is the current user
  if (cnfrmUserValue === currentAccount.userName) {
    //check if pin is correct
    if (cnfrmPinValue === currentAccount.pin) {
      let closingAccountIndex = accounts.findIndex(
        (obj) => obj.userName === currentAccount.userName
      );
      //removing the account
      accounts.splice(closingAccountIndex, 1);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = `Log in to get started ..`;
    } else {
      alert("wrong pin ! try again..😏");
    }
  } else {
    alert("such a task can not be executed !...😑😐");
  }
});

btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  console.log(sort, `updating starts`);
  sort = !sort;
  sort = rowAdder(currentAccount, sort);
  console.log(`updtaing ends`, sort);
});
