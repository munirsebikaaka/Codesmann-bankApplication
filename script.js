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
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
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

function displayMovents(movements) {
  movements.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    let htmlCode = `
      <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__value">${mov}</div>
        </div>
      `;
    containerMovements.insertAdjacentHTML('afterbegin', htmlCode);
  });
}
// displayMovents(account1);
const calcDisplayBalance = movements => {
  const balance = movements.reduce((acu, curEL) => acu + curEL);
  labelBalance.textContent = balance;
};
// calcDisplayBalance(account1);
const displaySummerry = movements => {
  const incomes = movements
    .filter(mov => mov > 0)
    .reduce((acu, curEl) => acu + curEl);
  labelSumIn.textContent = incomes;

  const withdrawals = movements
    .filter(mov => mov < 0)
    .reduce((acu, curEl) => acu + curEl);
  labelSumOut.textContent = `${Math.abs(withdrawals)}`;

  const interests = movements
    .filter(mov => mov > 0)
    .reduce((acu, curEl) => acu + curEl);
  const ints = (interests / 100) * 1.2;
  labelSumInterest.textContent = `${Math.trunc(ints)}`;
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
  displayMovents(bigAC.movements);
  ////////////////////////////
  calcDisplayBalance(bigAC.movements);
  ////////////////////////////
  displaySummerry(bigAC.movements);
};
let currentAccout;
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
    upDateUI(currentAccout);
  }
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

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTures

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
