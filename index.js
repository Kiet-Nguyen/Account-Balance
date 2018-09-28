/*jshint esversion: 6 */

const budgetController = (() => {})();

const UIController = (() => {})();

const controller = ((budgetCtrl, UICtrl) => {
  const addButton = document.querySelector('.add-btn');
  const descriptionInput = document.querySelector('.description__input');
  const amountInput = document.querySelector('.amount-__input');
  const itemType = document.querySelector('.item-type');
  const incomeItems = document.querySelector('.income-items');
  const expenseItems = document.querySelector('.expense-items');

  const addItem = () => {
    // Get input field
    const description = descriptionInput.value;
    const amount = amountInput.value;
    const type = itemType.options[itemType.options.selectedIndex].textContent;

    if (type === 'Income') {
      incomeItems.insertAdjacentHTML(
        'afterbegin',
        `
          <li>${description}: ${amount}</li>
        `
      );
    } else if (type === 'Expense') {
      expenseItems.insertAdjacentHTML(
        'afterbegin',
        `
          <li>${description}: ${amount}</li>
        `
      );
    }

    // Add the item to the budget controller
    // Add the item to the UI
    // Calculate the budget
    // Display the budget on the UI
  };

  addButton.addEventListener('click', () => {
    addItem();
  });

  document.addEventListener('keypress', event => {
    if (event.keyCode === 13 || event.which === 13) {
      addItem();
    }
  });
})(budgetController, UIController);
