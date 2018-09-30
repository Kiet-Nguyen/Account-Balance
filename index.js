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
    }
  };

  return {
    addItem: (type, description, amount) => {
      let newItem, itemID;

      // Create item's ID
      data.allItems[type].length > 0
        ? (itemID = data.allItems[type][data.allItems[type].length - 1].id + 1)
        : (itemID = 0);

      // Add new item into its respective postion
      if (type === 'income') {
        newItem = new Income(itemID, description, amount);
      } else if (type === 'expense') {
        newItem = new Expense(itemID, description, amount);
      }
      data.allItems[type].push(newItem);

      return newItem;
    },

    testing: () => {
      console.log(data);
    }
  };
})();

// For UI
const UIController = (() => {
  const elements = {
    inputType: document.querySelector('.item-type'),
    inputDescription: document.querySelector('.description__input'),
    inputAmount: document.querySelector('.amount__input'),
    addButton: document.querySelector('.add-btn'),
    incomeContainer: document.querySelector('.income__items'),
    expenseContainer: document.querySelector('.expense__items')
  };

  return {
    getInput: () => {
      return {
        type: elements.inputType.value,
        description: elements.inputDescription.value,
        amount: elements.inputAmount.value
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
    let input, newItem;
    // Get input field
    input = UICtrl.getInput();

    // Add the item to the budget controller
    newItem = budgetCtrl.addItem(input.type, input.description, input.amount);

    // Add the item to the UI
    UICtrl.addListItem(newItem, input.type);
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
