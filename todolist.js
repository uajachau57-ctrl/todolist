const transactionForm = document.getElementById('transactionForm');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const typeInput = document.getElementById('type');
const dateInput = document.getElementById('date'); 
const transactionList = document.getElementById('transactionList');

const searchInput = document.getElementById('searchInput');

const totalBalanceEl = document.getElementById('totalBalance');
const totalIncomeEl = document.getElementById('totalIncome');
const totalExpenseEl = document.getElementById('totalExpense');

let editIndex = null;

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

function formatDate(dateString) {
    const dateObj = new Date(dateString);
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = dateObj.toLocaleString('default', { month: 'short' });
    const year = dateObj.getFullYear();
    return `${day} ${month} ${year}`;
}

function updateDashboard(filterText = '') {
    transactionList.innerHTML = '';
    
    let incomeSum = 0;
    let expenseSum = 0;

    transactions.forEach((transaction, index) => {
        if (transaction.type === 'income') {
            incomeSum += transaction.amount;
        } else {
            expenseSum += transaction.amount;
        }

        const matchesSearch = transaction.description.toLowerCase().includes(filterText.toLowerCase().trim());
        if (!matchesSearch) {
            return;
        }

        const row = document.createElement('tr');
        const typeBa = transaction.type === 'income' ? '<span class="badge income">Income</span>' : '<span class="badge expense">Expense</span>';
        const amountClass = transaction.type === 'income' ? 'text-income' : 'text-expense';
        const amountSign = transaction.type === 'income' ? '+ $' : '- $';

        row.innerHTML = `
            <td>${transaction.description}</td>
            <td>${typeBa}</td>
            <td class="${amountClass}">${amountSign}${transaction.amount.toFixed(2)}</td>
            <td>${formatDate(transaction.date)}</td>
            <td>
                <button type="button" class="action-btn edit-btn" onclick="editTransaction(${index})" title="Edit">
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button type="button" class="action-btn delete-btn" onclick="deleteTransaction(${index})" title="Delete">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        `;
        transactionList.appendChild(row);
    });

    const totalBalance = incomeSum - expenseSum;
    totalBalanceEl.innerText = `$ ${totalBalance.toFixed(0)}`;
    totalIncomeEl.innerText = `$ ${incomeSum.toFixed(0)}`;
    totalExpenseEl.innerText = `$ ${expenseSum.toFixed(0)}`;

    localStorage.setItem('transactions', JSON.stringify(transactions));
}

if (searchInput) {
    searchInput.addEventListener('input', function(e) {
        updateDashboard(e.target.value);
    });
}

transactionForm.addEventListener('submit', function(e) {
    e.preventDefault();

    if(descriptionInput.value.trim() === "" || amountInput.value === "" || dateInput.value === "") {
        alert("Please fill all the fields!");
        return;
    }

    const transactionData = {
        description: descriptionInput.value,
        amount: parseFloat(amountInput.value),
        type: typeInput.value,
        date: dateInput.value
    };

    if (editIndex !== null) {
        transactions[editIndex] = transactionData;
        editIndex = null; 
        document.querySelector('.submit-btn').innerHTML = '<i class="fa-solid fa-square-plus"></i> Add transaction';
    } else {
        transactions.push(transactionData);
    }

    if (searchInput) searchInput.value = '';
    updateDashboard();

    descriptionInput.value = '';
    amountInput.value = '';
    dateInput.value = '';
});

function editTransaction(index) {
    const item = transactions[index];
    
    descriptionInput.value = item.description;
    amountInput.value = item.amount;
    typeInput.value = item.type;
    dateInput.value = item.date;

    editIndex = index; 
    document.querySelector('.submit-btn').innerHTML = '<i class="fa-solid fa-pen"></i> Update Transaction';
}

function deleteTransaction(index) {
        transactions.splice(index, 1);
        editIndex = null;
        document.querySelector('.submit-btn').innerHTML = '<i class="fa-solid fa-square-plus"></i> Add transaction';
        if (searchInput) searchInput.value = '';
        updateDashboard();
}

updateDashboard();
