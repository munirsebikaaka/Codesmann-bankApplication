'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2024-04-29T17:01:17.194Z',
    '2024-05-01T23:36:17.929Z',
    '2024-05-03T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');
function formatDates(date) {
  const calcdaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  const daysPassed = calcdaysPassed(new Date(), date);
  console.log(daysPassed);
  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesturday';
  if (daysPassed === 1) return `${daysPassed} days have past`;
  const days = String(date.getDate()).padStart(2, 0);
  const month = String(date.getMonth()).padStart(2, 0);
  const year = date.getFullYear();
  return `${days}/${month}/${year}`;
}
function displayMovents(acc) {
  acc.movements.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatDates(date);
    let htmlCode = `
      <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${new Intl.NumberFormat(acc.locale, {
            style: 'currency',
            currency: acc.currency,
          }).format(mov)}</div>
        </div>
      `;
    containerMovements.insertAdjacentHTML('afterbegin', htmlCode);
  });
}
// displayMovents(account1);
const calcDisplayBalance = acc => {
  const balance = acc.movements.reduce((acu, curEL) => acu + curEL);
  labelBalance.textContent = new Intl.NumberFormat(acc.locale, {
    style: 'currency',
    currency: acc.currency,
  }).format(balance);
};
// calcDisplayBalance(account1);
const displaySummerry = acc => {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acu, curEl) => acu + curEl);
  labelSumIn.textContent = new Intl.NumberFormat(acc.locale, {
    style: 'currency',
    currency: acc.currency,
  }).format(incomes);

  const withdrawals = acc.movements
    .filter(mov => mov < 0)
    .reduce((acu, curEl) => acu + curEl);
  const withs = `${Math.abs(withdrawals)}`;
  labelSumOut.textContent = new Intl.NumberFormat(acc.locale, {
    style: 'currency',
    currency: acc.currency,
  }).format(withs);

  const interests = acc.movements
    .filter(mov => mov > 0)
    .reduce((acu, curEl) => acu + curEl);
  const ints = (interests / 100) * 1.2;
  const intes = `${Math.trunc(ints)}`;
  labelSumInterest.textContent = new Intl.NumberFormat(acc.locale, {
    style: 'currency',
    currency: acc.currency,
  }).format(intes);
};
// displaySummerry(account1);
const calcUserName = acc => {
  acc.forEach(el => {
    el.userName = el.owner
      .toLowerCase()
      .split(' ')
      .map(el => el[0])
      .join('');
  });
};
calcUserName(accounts);
const upDateUI = bigAC => {
  displayMovents(bigAC);
  ////////////////////////////
  calcDisplayBalance(bigAC);
  ////////////////////////////
  displaySummerry(bigAC);
};
const logOutEL = document.querySelector('.timer');
let currentAccout;
let time = 280;
function logOutFUNCTION() {
  const minutes = Math.trunc(time / 60) + ''.padStart(0, 2);
  const seconds = Math.trunc(time % 60) + ''.padStart(0, 2);
  logOutEL.textContent = `${minutes}:${seconds}`;
  time--;
  if (time < 0) containerApp.style.opacity = 0;
}

btnLogin.addEventListener('click', e => {
  e.preventDefault();
  currentAccout = accounts.find(
    acc => acc.userName === inputLoginUsername.value
  );
  if (currentAccout.pin === +inputLoginPin.value) {
    containerApp.style.opacity = '100%';
    labelWelcome.textContent = `Welcome back ${
      currentAccout.owner.split(' ')[0]
    }`;
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
    const now = new Date();

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccout.locale
    ).format(now);
    upDateUI(currentAccout);
  }
  setInterval(() => {
    logOutFUNCTION();
  }, 1000);
});
btnTransfer.addEventListener('click', e => {
  e.preventDefault();
  const receiverAcount = accounts.find(
    el => el.userName === inputTransferTo.value
  );
  const amount = +inputTransferAmount.value;
  if (
    amount > 0 &&
    receiverAcount &&
    receiverAcount.userName !== currentAccout.userName
  ) {
    receiverAcount.movements.push(amount);
    currentAccout.movements.push(-amount);
    currentAccout.movementsDates.push(new Date());
    receiverAcount.movementsDates.push(new Date());
    upDateUI(currentAccout);
    inputTransferTo.value = '';
    inputTransferAmount.value = '';
  }
});
btnLoan.addEventListener('click', e => {
  e.preventDefault();
  const amount = +inputLoanAmount.value;
  if (amount > 0 && currentAccout.movements.some(mov => mov >= amount / 10)) {
    currentAccout.movements.push(amount);
    currentAccout.movementsDates.push(new Date());
  }
  inputLoanAmount.value = '';
  upDateUI(currentAccout);
});
btnClose.addEventListener('click', e => {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccout.userName &&
    +inputClosePin.value === currentAccout.pin
  ) {
    const index = accounts.findIndex(
      el => el.userName === currentAccout.userName
    );
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
    inputCloseUsername.value = '';
    inputClosePin.value = '';
  }
});
