/*jshint esversion: 6 */

// For data
const budgetController = (() => {
  const Expense = (id, description, amount) => {
    this.id = id;
    this.description = description;
    this.amount = amount;
  };

  const Income = (id, description, amount) => {
    this.id = id;
    this.description = description;
    this.amount = amount;
  };

  const data = {
    allItems: {
      incomes: [],
      expenses: []
    },
    totals: {
      incomes: 0,
      expenses: 0
    }
  };

  return {};
})();

// For UI
const UIController = (() => {
  const elements = {
    inputType: document.querySelector('.item-type'),
    inputDescription: document.querySelector('.description__input'),
    inputAmount: document.querySelector('.amount__input'),
    addButton: document.querySelector('.add-btn')
  };

  return {
    getInput: () => {
      return {
        type: elements.inputType.value,
        description: elements.inputDescription.value,
        amount: elements.inputAmount.value
      };
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
    DOMElements.addButton.addEventListener('click', addItem);
    // Enter
    document.addEventListener('keypress', event => {
      if (event.keyCode === 13 || event.which === 13) {
        addItem();
      }
    });
  };

  const addItem = () => {
    // Get input field
    const input = UICtrl.getInput();
    console.log('input', input);

    // Add the item to the budget controller
    // Add the item to the UI
    // Calculate the budget
    // Display the budget on the UI
  };

  return {
    init: () => {
      console.log('Application has started.');
      setupEventListerners();
    }
  };
})(budgetController, UIController);

controller.init();
