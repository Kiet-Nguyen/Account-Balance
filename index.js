/*jshint esversion: 6 */

// For data
const budgetController = (() => {
  class Expense {
    constructor(id, description, amount) {
      this.id = id;
      this.description = description;
      this.amount = amount;
    }
  }

  class Income {
    constructor(id, description, amount) {
      this.id = id;
      this.description = description;
      this.amount = amount;
    }
  }

  const data = {
    allItems: {
      income: [],
      expense: []
    },
    totals: {
      income: 0,
      expense: 0
    },
    balance: 0,
    percentage: -1
  };

  const calculateTotal = type => {
    let sum = 0;
    sum = data.allItems[type].reduce((accummulator, currValue) => {
      accummulator += currValue.amount;
      return accummulator;
    }, 0);

    data.totals[type] = sum;
  };

  return {
    addItem: (type, description, amount) => {
      let newItem, itemID;

      // Create item's ID
      if (data.allItems[type].length > 0) {
        itemID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        itemID = 0;
      }

      // Add new item into its respective postion
      if (type === 'income') {
        newItem = new Income(itemID, description, amount);
      } else if (type === 'expense') {
        newItem = new Expense(itemID, description, amount);
      }
      data.allItems[type].push(newItem);

      return newItem;
    },

    deleteItem: (type, id) => {
      let itemIDIndex;
      // Store ids of all remaining items
      const ids = data.allItems[type].map(currItem => {
        return currItem.id;
      });

      // Find the index number of current target
      itemIDIndex = ids.indexOf(id);

      // Delete the target if it's still inside the array
      if (itemIDIndex !== -1) {
        data.allItems[type].splice(itemIDIndex, 1);
      }
    },

    calculateBudget: () => {
      // Total income and expense
      calculateTotal('income');
      calculateTotal('expense');

      // Calculate balance
      data.balance = data.totals.income - data.totals.expense;

      // Calculate percentage of income that we spend
      if (data.totals.income > 0) {
        data.percentage = Math.round(
          (data.totals.expense / data.totals.income) * 100
        );
      } else {
        data.percentage = -1;
      }
    },

    getBudget: () => {
      return {
        balance: data.balance,
        totalIncome: data.totals.income,
        totalExpense: data.totals.expense,
        percentage: data.percentage
      };
    },

    testing: () => {
      console.log(data);
    }
  };
})();

// For UI
const UIController = (() => {
  const elements = {
    title: document.querySelector('.heading-1'),
    inputType: document.querySelector('.item-type'),
    inputDescription: document.querySelector('.description__input'),
    inputAmount: document.querySelector('.amount__input'),
    addButton: document.querySelector('.add-btn'),
    incomeContainer: document.querySelector('.income__items'),
    expenseContainer: document.querySelector('.expense__items'),
    balanceValue: document.querySelector('.balance-value'),
    totalIncome: document.querySelector('.total-income'),
    totalExpense: document.querySelector('.total-expense'),
    containerIncAndExp: document.querySelector('.js-event-delagation')
  };

  elements.title.textContent = `Account balance in`;

  return {
    getInput: () => {
      const descriptionCapitalized =
        elements.inputDescription.value.charAt(0).toUpperCase() +
        elements.inputDescription.value.slice(1);

      return {
        type: elements.inputType.value,
        description: descriptionCapitalized,
        amount: parseFloat(elements.inputAmount.value)
      };
    },

    addListItem: (obj, type) => {
      let today = new Date();
      let datestring = `
        ${today.toLocaleDateString('en-FI')} 
        ${today.getHours()}:${today.getMinutes()}
      `;

      const markup = `
        <div class="item" id="${type}-${obj.id}">
          <div class="item__date">Date: ${datestring}</div>

          <div class="item__details">
            <p class="description">${obj.description}</p>
            <div class="value-btn-container">
              <p class="value">${obj.amount}€</p>
              <button class="btn delete-btn">
                <img class="${type}-delete-btn" src="./img/${type}-delete-icon.svg" alt="Delete icon">
              </button>
            </div>
          </div>
        </div>
      `;

      if (type === 'income') {
        elements.incomeContainer.insertAdjacentHTML('beforeend', markup);
      } else if (type === 'expense') {
        elements.expenseContainer.insertAdjacentHTML('beforeend', markup);
      }
    },

    deleteListItem: itemID => {
      const targetElement = document.getElementById(itemID);
      targetElement.parentNode.removeChild(targetElement);
    },

    clearFields: () => {
      elements.inputDescription.value = '';
      elements.inputAmount.value = '';
    },

    displayBudget: obj => {
      elements.balanceValue.textContent = `${obj.balance}€`;
      elements.totalIncome.textContent = `${obj.totalIncome}€`;
      elements.totalExpense.textContent = `${obj.totalExpense}€`;
    },

    getDOMElements: () => {
      return elements;
    }
  };
})();

const controller = ((budgetCtrl, UICtrl) => {
  const setupEventListerners = () => {
    const DOMElements = UICtrl.getDOMElements();
    // Click
    DOMElements.addButton.addEventListener('click', ctrlAddItem);
    // Enter
    document.addEventListener('keypress', event => {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });
    // Event delegation to delete button
    DOMElements.containerIncAndExp.addEventListener('click', ctrlDeleteItem);
  };

  const ctrlUpdateBudget = () => {
    // Calculate the budget
    budgetCtrl.calculateBudget();

    // Return the budget
    const budget = budgetCtrl.getBudget();

    // Display the budget on the UI
    UICtrl.displayBudget(budget);
  };

  const ctrlAddItem = () => {
    let input, newItem;
    // Get input field
    input = UICtrl.getInput();

    if (input.description !== '' && !isNaN(input.amount) && input.amount > 0) {
      // Add the item to the budget controller
      newItem = budgetCtrl.addItem(input.type, input.description, input.amount);

      // Add the item to the UI
      UICtrl.addListItem(newItem, input.type);

      // Clear input fields
      UICtrl.clearFields();

      // Calculate and update budget
      ctrlUpdateBudget();
    }
  };

  const ctrlDeleteItem = event => {
    let itemID, type, id;
    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

    if (itemID) {
      const typeIDArr = itemID.split('-');
      type = typeIDArr[0];
      id = parseInt(typeIDArr[1]);
    }

    // Delete item from data structure
    budgetCtrl.deleteItem(type, id);

    // Remove item from UI
    UICtrl.deleteListItem(itemID);

    // Calculate and update budget
    ctrlUpdateBudget();
  };

  return {
    init: () => {
      UICtrl.displayBudget({
        balance: 0,
        totalIncome: 0,
        totalExpense: 0,
        percentage: -1
      });
      setupEventListerners();
    }
  };
})(budgetController, UIController);

controller.init();
