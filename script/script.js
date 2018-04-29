var Casino = function(slotMachineNumber, startingMoneyAmount) {
   if (slotMachineNumber < 0) {
      console.warn(`Bad input!`);
      this.slotMachinesNumber = 0;
   }else {
      this.slotMachinesNumber = slotMachineNumber;
   }
   if (slotMachineNumber < 0) {
      console.warn(`Bad input!`);
      this.cashRegister = 0;
      
   } else {
      this.cashRegister = startingMoneyAmount;
   }
   
   this.initSlotMachines = function () {
      var slotMachinesArray = [];
      for (var i = 0; i < this.slotMachinesNumber; i++){
         slotMachinesArray[i] = new SlotMachine(Math.floor(this.cashRegister / this.slotMachinesNumber));
      }
      slotMachinesArray[0].money += this.cashRegister%this.slotMachinesNumber;
      slotMachinesArray[Math.floor(Math.random() * this.slotMachinesNumber)].lucky = true;

      return slotMachinesArray;
   };

   if (this.slotMachinesNumber > 0) {
      this.slotMachines = this.initSlotMachines();
   }else{
      console.warn(`You need at least one Slot Machine to continue working with Casino!`);
   }
}

var SlotMachine = function(startingMoneyAmount) {
   this.money = startingMoneyAmount;
   this.lucky = false;
}

Casino.prototype.getCurrentMoneyAmount = function () {
   var sum = 0;
   for (var i = 0; i < this.slotMachinesNumber; i++) {
      sum += this.slotMachines[i].money;
   }
   this.cashRegister = sum;
   return sum;
}

Casino.prototype.getSlotMachinesNumber = function () {
   return this.slotMachines.length;
}

Casino.prototype.findHighestMoneyAmount = function () {
   var highestValue = this.slotMachines[0].money;
   var index = 0;
   for (var i = 1; i < this.slotMachinesNumber; i++) {
      if (this.slotMachines[i].money > highestValue){
         highestValue = this.slotMachines[i].money;
         index = i;
      }
   }
   return index;
}

Casino.prototype.addSlotMachine = function () {
   var highestValueMachine = this.slotMachines[this.findHighestMoneyAmount()];
   var halfValue = Math.floor(highestValueMachine.money/2);
   this.slotMachines.push(new SlotMachine(halfValue));
   highestValueMachine.money -= halfValue;
   this.slotMachinesNumber++;
   return this; 
}

Casino.prototype.removeSlotMachine = function (index) {
   if(!this.slotMachines[index]){
      console.warn(`You are trying to delete non-existing Slot Machine! Try again!`);
      return this;
   }
   var slotNumb =  this.getSlotMachinesNumber()-1;
   if (slotNumb === 1) {
      this.cashRegister =  this.slotMachines[0].money;
      this.slotMachines.splice(0, 1);
   }
   if (index !== 0) {
      this.slotMachines[0].money += this.slotMachines[index].money%slotNumb;
   }else{
      this.slotMachines[1].money += this.slotMachines[index].money%slotNumb;
   }
   var moneyPart = Math.floor(this.slotMachines[index].money/slotNumb);
   this.slotMachines.splice(index, 1);
   this.slotMachinesNumber--;
   for (var i = 0; i < this.getSlotMachinesNumber(); i++) {
      this.slotMachines[i].money += moneyPart;
   } 
   return this;
}

Casino.prototype.takeMoneyAway = function (amount) {
    var currentAmount = 0;
    var takingMoneyAmount = 100;
    if (amount > this.getCurrentMoneyAmount()) {
        console.warn(`Not enough money in Casino!`);
        return 0;
    }
    if (this.getCurrentMoneyAmount() === 0) {
        console.warn(`Your casino is empty!`);
        return 0;
    }

    while (currentAmount !== amount) {
        if (amount - currentAmount > takingMoneyAmount) {
            this.slotMachines[this.findHighestMoneyAmount()].money -= takingMoneyAmount;
            this.cashRegister -= takingMoneyAmount;
            currentAmount += takingMoneyAmount;
        } else {
            this.slotMachines[this.findHighestMoneyAmount()].money -= (amount - currentAmount);
            this.cashRegister -= (amount - currentAmount);
            currentAmount += (amount - currentAmount);
            return currentAmount;
        }
    }
    return currentAmount;
}

Casino.prototype.showStatus = function () {
    console.log(`// status`);
    console.log(`Кількість грошей в казино - ${this.getCurrentMoneyAmount()}`);
    console.log(`Кількість автоматів - ${this.getSlotMachinesNumber()}`);
    console.log(`Гроші в автоматах:`);
    for (var i = 0; i < this.getSlotMachinesNumber(); i++){
        console.log(`${i} - $${this.slotMachines[i].money}`);
    }
}

SlotMachine.prototype.getCurrentMoney = function () {
   return this.money;
}

SlotMachine.prototype.takeMoney = function (amount) {
    if (this.cheaterProtection(amount)) return this;
    if (amount > this.money) {
        console.warn(`Not enough money in this machine`);
        return this;
    } else {    
        this.money -= amount;
        return this;
    }
}

SlotMachine.prototype.takeAllMoney = function () {
   this.money = 0;
   return this;
}

SlotMachine.prototype.putMoney = function (amount) {
   if (this.cheaterProtection(amount)) return this;
   this.money += amount;
   return this;
}

SlotMachine.prototype.play = function (amount) {
    this.putMoney(amount);
    const NUMB_LENGHT = 3;
    var number = [];
    for (var i = 0; i < NUMB_LENGHT; i++) {
        number[i] = Math.floor(Math.random()*10);
    }
    var result = this.checkNumber(number);
    var prize = amount * result;
    if (result === 7 ) {
        console.log(`Your number: 7|7|7`);
        prize = this.money;
        this.takeAllMoney();
        console.log(`JACKPOT! You won $${prize}! JACKPOT!`);
        return prize;
    } else if (prize > this.money){
        console.log(`Your number: ${number[0]}|${number[1]}|${number[2]}`);
        prize = this.money;
        this.takeAllMoney();
        console.log(`In this Machine is not enough money so you take all! You won $${prize}!`);
        return prize;
    }
    else if (result === 0) {
        console.warn(`You lose! Try again!`);
        return 0;
    } 
    else {
        console.log(`Your number: ${number[0]}|${number[1]}|${number[2]}`);
        this.takeMoney(prize);
        console.log(`You won $${prize}! Congrats!`);
        return prize;
    }
}

SlotMachine.prototype.checkNumber = function (numbersArray) {
   if(this.lucky || (numbersArray[0] === 7 && numbersArray[0] === numbersArray[1] && numbersArray[1] === numbersArray[2])){
      return 7;
   } else if(numbersArray[0] === numbersArray[1] && numbersArray[1] === numbersArray[2]) {
      return 5;
   } else if (numbersArray[0] === numbersArray[1] || numbersArray[0] === numbersArray[2] || numbersArray[1] === numbersArray[2]) {
      return 2;
   } else {
      return 0;
   }
}

SlotMachine.prototype.cheaterProtection = function (amount) {
   if (amount < 1) {
      console.warn(`You trying to cheat in Casino! Don't do it!`);
      return true;
   }else {
      return false;
   }
}

console.info(`// Testing functionality`);
var myCasino = new Casino(5, 13124);

console.info(`// Creating necessary Slot Machines when Casino constructor called`);
console.log(myCasino.slotMachines);

console.info(`// Casino with false starting values`);
var badInputCasino = new Casino(-1, -1);

console.info(`// Casino public methods:`);

console.info(`// Отримати загальну суму грошей у казино`);
console.log(myCasino.getCurrentMoneyAmount());

console.info(`// Отримати кількість автоматів у казино`);
console.log(myCasino.getSlotMachinesNumber());

console.info(`// Додати новий автомат \n // (в цьому випадку новий автомат має отримати як стартову суму,\n // половину грошей з автомата, у якому їх на даний момент найбільше)`);
myCasino.addSlotMachine();
myCasino.showStatus();

console.info(`// Видалити автомат за номером\n // (гроші з видаленого автомату розподіляються між рештою кас)`);
myCasino.removeSlotMachine(2);
myCasino.showStatus();

console.info(`// Видаляємо неіснуючий автомат`);
myCasino.removeSlotMachine(10);

console.info(`// Забрати з казино гроші. Вхідний аргумент - сума (number).\n // Функція має зібрати потрібну суму з автоматів(послідовність від автомата,\n // у якому грошей найбільше, до автомата у якому грошей найменше)\n // і повернути її.`);
console.info(`// Забираэмо $525`);
myCasino.takeMoneyAway(525);
myCasino.showStatus();

console.info(`// SlotMachine public methods:`);
console.info(`// Отримати загальну суму грошей у автоматі:`);
console.log(`Гроші в другому автоматі: ${myCasino.slotMachines[1].getCurrentMoney()}`);

console.info(`// Забрати гроші . Вхідний аргумент - сума (number).`);
console.info(`// Забираємо з третього автомата $300`);
myCasino.slotMachines[2].takeMoney(300);
console.log(`Гроші в третьому автоматі: ${myCasino.slotMachines[2].getCurrentMoney()}`);

console.info(`// Покласти гроші . Вхідний аргумент - сума (number).`);
console.info(`// Кладемо в 4 автомат $500`);
myCasino.slotMachines[3].putMoney(300);
console.log(`Гроші в четвертому автоматі: ${myCasino.slotMachines[3].getCurrentMoney()}`);

console.info(`// Пробуємо чітити:`);
console.info(`// Кладемо в 4 автомат -$1000`);
myCasino.slotMachines[3].putMoney(-1000);
console.log(`Гроші в четвертому автоматі: ${myCasino.slotMachines[3].getCurrentMoney()}`);

console.info(`// Зіграти. Вхідний аргумент - сума (number) грошей яку гравець закидує в автомат.\n // Гроші зараховуються у суму автомату. Метод генерить випадкове 3-х значне число\n //(наприклад 124). Якщо у числі 2 цифри однакові, повертається\n //сума у 2 рази більша ніж прийшла в аргументі (і віднімається від суми грошей\n // в автоматі). Якщо 3 цифри однакові - повертається 5-кратна сума. \n //Якщо число дорівнює 777, повертаються усі гроші, які є в автоматі.\n // Якщо даний SlotMachine є lucky тоді 3-х значне число не випадкове а дорівнює 777.`);
console.info(`// Граємо на $100 на третьому автоматі поки щось не виграємо:`);

do {
   var money = myCasino.slotMachines[2].play(100);
} while (money === 0);

console.log(`Гроші в третьому автоматі: ${myCasino.slotMachines[2].getCurrentMoney()}`);

console.info(`// Шукаємо LUCKY і граємо на ньому:`);

for (var i = 0; i < myCasino.getSlotMachinesNumber(); i++) {
    if (myCasino.slotMachines[i].lucky) {
        myCasino.slotMachines[i].play(100);
        console.log(`Гроші в ${i+1} автоматі: ${myCasino.slotMachines[i].getCurrentMoney()}`);
        break;
    }
}