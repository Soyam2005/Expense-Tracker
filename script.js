// TrackGuy Budget App JavaScript
// Global variables for data storage
let transactions = [];
let bills = [];
let expenses = [];
let incomeData = {
  paycheck: 80000,
  rent: 20000,
  partTime: 25000,
};
let spentAmount = 25000;
let monthlyExpenses = {
  clothes: 5000,
  groceries: 10000,
};

let selectedTransactionId = null;
let expenseChart = null;
let budgetPieChart = null;

// Local Storage Keys
const STORAGE_KEYS = {
  TRANSACTIONS: "TrackGuy_transactions",
  BILLS: "TrackGuy_bills",
  EXPENSES: "TrackGuy_expenses",
  INCOME: "TrackGuy_income",
  SPENT: "TrackGuy_spent",
  MONTHLY_EXPENSES: "TrackGuy_monthly_expenses",
};

// Initialize app when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  loadDataFromStorage();
  initializeApp();
});

// Local Storage Functions
function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
    showNotification("Error saving data. Storage may be full.", "error");
  }
}

function loadFromStorage(key, defaultValue = []) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error("Error loading from localStorage:", error);
    return defaultValue;
  }
}

function loadDataFromStorage() {
  transactions = loadFromStorage(STORAGE_KEYS.TRANSACTIONS, []);
  bills = loadFromStorage(STORAGE_KEYS.BILLS, []);
  expenses = loadFromStorage(STORAGE_KEYS.EXPENSES, []);
  incomeData = loadFromStorage(STORAGE_KEYS.INCOME, {
    paycheck: 80000,
    rent: 20000,
    partTime: 25000,
  });
  spentAmount = loadFromStorage(STORAGE_KEYS.SPENT, 25000);
  monthlyExpenses = loadFromStorage(STORAGE_KEYS.MONTHLY_EXPENSES, {
    clothes: 5000,
    groceries: 10000,
  });

  // If no data exists, create some sample data
  if (transactions.length === 0) {
    createSampleData();
  }
}

function createSampleData() {
  transactions = [
    {
      id: 1,
      name: "Grocery Shopping",
      date: "2025-08-15",
      category: "food",
      amount: 2500,
      description: "Weekly groceries",
    },
    {
      id: 2,
      name: "Bus Fare",
      date: "2025-08-16",
      category: "transport",
      amount: 50,
      description: "Daily commute",
    },
    {
      id: 3,
      name: "Electricity Bill",
      date: "2025-08-10",
      category: "utilities",
      amount: 1200,
      description: "Monthly bill",
    },
    {
      id: 4,
      name: "Restaurant",
      date: "2025-08-18",
      category: "food",
      amount: 800,
      description: "Dinner out",
    },
    {
      id: 5,
      name: "Gas Bill",
      date: "2025-08-12",
      category: "utilities",
      amount: 600,
      description: "Monthly gas",
    },
  ];

  bills = [
    { due: "2025-09-05", budget: 1500, actual: 1200 },
    { due: "2025-09-10", budget: 800, actual: 750 },
    { due: "2025-09-15", budget: 2000, actual: 0 },
  ];

  expenses = [
    { category: "Food", budget: 8000, actual: 3300 },
    { category: "Transport", budget: 2000, actual: 50 },
    { category: "Entertainment", budget: 3000, actual: 0 },
  ];

  // Save sample data to localStorage
  saveAllData();
}

function saveAllData() {
  saveToStorage(STORAGE_KEYS.TRANSACTIONS, transactions);
  saveToStorage(STORAGE_KEYS.BILLS, bills);
  saveToStorage(STORAGE_KEYS.EXPENSES, expenses);
  saveToStorage(STORAGE_KEYS.INCOME, incomeData);
  saveToStorage(STORAGE_KEYS.SPENT, spentAmount);
  saveToStorage(STORAGE_KEYS.MONTHLY_EXPENSES, monthlyExpenses);
}

function initializeApp() {
  populateIncomeInputs();
  updateDashboard();
  loadTransactions();
  loadBudgetData();
  initializeCharts();
  setupEventListeners();
}

function populateIncomeInputs() {
  // Set income values from stored data
  const incomeInputs = document.querySelectorAll(
    '.income-row input[type="number"]'
  );
  if (incomeInputs.length >= 3) {
    incomeInputs[0].value = incomeData.paycheck;
    incomeInputs[1].value = incomeData.rent;
    incomeInputs[2].value = incomeData.partTime;
  }

  // Set spent amount
  const spentInput = document.getElementById("spentInput");
  if (spentInput) spentInput.value = spentAmount;

  // Set monthly expenses
  const clothesInput = document.getElementById("clothesInput");
  const groceriesInput = document.getElementById("groceriesInput");
  if (clothesInput) clothesInput.value = monthlyExpenses.clothes;
  if (groceriesInput) groceriesInput.value = monthlyExpenses.groceries;
}

// Navigation function
function showSection(sectionName) {
  // Remove active class from all sections and nav items
  document.querySelectorAll(".section").forEach((section) => {
    section.classList.remove("active");
  });
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.remove("active");
  });

  // Add active class to selected section and nav item
  document.getElementById(sectionName).classList.add("active");

  // Find and activate corresponding nav item
  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach((item) => {
    if (item.textContent.toLowerCase().includes(sectionName.toLowerCase())) {
      item.classList.add("active");
    }
  });

  // Update charts when switching to dashboard or budget
  if (sectionName === "dashboard") {
    setTimeout(() => updateExpenseChart(), 100);
  } else if (sectionName === "budget") {
    setTimeout(() => updateBudgetPieChart(), 100);
  }
}

// Dashboard functions
function updateDashboard() {
  // Calculate total income
  const totalIncome =
    incomeData.paycheck + incomeData.rent + incomeData.partTime;

  // Update total salary display
  document.getElementById(
    "totalSalary"
  ).textContent = `Monthly Income: ₹${totalIncome.toLocaleString()}`;

  // Calculate expenses
  const totalExpenses = monthlyExpenses.clothes + monthlyExpenses.groceries;

  // Update expenses total
  document.getElementById(
    "expensesTotal"
  ).textContent = `₹${totalExpenses.toLocaleString()}`;

  // Calculate remaining amount
  const remaining = totalIncome - spentAmount;
  document.getElementById(
    "remainingDisplay"
  ).textContent = `₹${remaining.toLocaleString()}`;
}

function setupEventListeners() {
  // Edit buttons functionality
  document
    .getElementById("editBtn")
    .addEventListener("click", toggleIncomeEdit);
  document
    .getElementById("editSpentBtn")
    .addEventListener("click", toggleSpentEdit);
  document
    .getElementById("editExpensesBtn")
    .addEventListener("click", toggleExpensesEdit);

  // Range select for expense chart
  document
    .getElementById("rangeSelect")
    .addEventListener("change", updateExpenseChart);

  // Filter for transactions
  document
    .getElementById("filter")
    .addEventListener("change", filterTransactions);

  // Input change listeners for real-time updates
  document.querySelectorAll('input[type="number"]').forEach((input) => {
    input.addEventListener("input", handleInputChange);
  });
}

function handleInputChange(event) {
  const input = event.target;
  const value = parseFloat(input.value) || 0;

  // Update income data
  const incomeInputs = document.querySelectorAll(
    '.income-row input[type="number"]'
  );
  if (input === incomeInputs[0]) {
    incomeData.paycheck = value;
  } else if (input === incomeInputs[1]) {
    incomeData.rent = value;
  } else if (input === incomeInputs[2]) {
    incomeData.partTime = value;
  }

  // Update spent amount
  if (input.id === "spentInput") {
    spentAmount = value;
  }

  // Update monthly expenses
  if (input.id === "clothesInput") {
    monthlyExpenses.clothes = value;
  } else if (input.id === "groceriesInput") {
    monthlyExpenses.groceries = value;
  }

  updateDashboard();
  saveAllData();
}

// Edit functionality
function toggleIncomeEdit() {
  const inputs = document.querySelectorAll(".income-row input");
  const btn = document.getElementById("editBtn");

  if (btn.textContent.includes("Edit")) {
    inputs.forEach((input) => (input.disabled = false));
    btn.textContent = "💾 Save Income";
    btn.style.background = "linear-gradient(135deg, #10b981 0%, #059669 100%)";
  } else {
    inputs.forEach((input) => (input.disabled = true));
    btn.textContent = "✏️ Edit Income";
    btn.style.background = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";

    // Save income data
    const incomeInputs = document.querySelectorAll(
      '.income-row input[type="number"]'
    );
    incomeData.paycheck = parseFloat(incomeInputs[0].value) || 0;
    incomeData.rent = parseFloat(incomeInputs[1].value) || 0;
    incomeData.partTime = parseFloat(incomeInputs[2].value) || 0;

    updateDashboard();
    saveAllData();
  }
}

function toggleSpentEdit() {
  const input = document.getElementById("spentInput");
  const btn = document.getElementById("editSpentBtn");

  if (btn.textContent.includes("Edit")) {
    input.disabled = false;
    btn.textContent = "💾 Save";
    btn.style.background = "linear-gradient(135deg, #10b981 0%, #059669 100%)";
  } else {
    input.disabled = true;
    btn.textContent = "✏️ Edit Spending";
    btn.style.background = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";

    spentAmount = parseFloat(input.value) || 0;
    updateDashboard();
    saveAllData();
  }
}

function toggleExpensesEdit() {
  const inputs = [
    document.getElementById("clothesInput"),
    document.getElementById("groceriesInput"),
  ];
  const btn = document.getElementById("editExpensesBtn");

  if (btn.textContent.includes("Edit")) {
    inputs.forEach((input) => (input.disabled = false));
    btn.textContent = "💾 Save";
    btn.style.background = "linear-gradient(135deg, #10b981 0%, #059669 100%)";
  } else {
    inputs.forEach((input) => (input.disabled = true));
    btn.textContent = "✏️ Edit";
    btn.style.background = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";

    monthlyExpenses.clothes = parseFloat(inputs[0].value) || 0;
    monthlyExpenses.groceries = parseFloat(inputs[1].value) || 0;

    updateDashboard();
    saveAllData();
  }
}

// Transaction functions
function loadTransactions() {
  const tbody = document.getElementById("transactionsBody");
  tbody.innerHTML = "";

  transactions.forEach((transaction) => {
    const row = createTransactionRow(transaction);
    tbody.appendChild(row);
  });
}

function createTransactionRow(transaction) {
  const row = document.createElement("tr");
  row.dataset.id = transaction.id;
  row.addEventListener("click", () => selectTransaction(transaction.id));

  const categoryIcon = getCategoryIcon(transaction.category);

  row.innerHTML = `
    <td>${transaction.name}</td>
    <td>${formatDate(transaction.date)}</td>
    <td>${categoryIcon} ${capitalizeFirst(transaction.category)}</td>
    <td>₹${transaction.amount.toLocaleString()}</td>
    <td>${transaction.description}</td>
  `;

  return row;
}

function getCategoryIcon(category) {
  const icons = {
    food: "🍔",
    transport: "🚗",
    utilities: "⚡",
    entertainment: "🎬",
    shopping: "🛍️",
    health: "🏥",
    default: "💰",
  };
  return icons[category] || icons.default;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function selectTransaction(id) {
  // Remove previous selection
  document.querySelectorAll(".transactions-table tr").forEach((row) => {
    row.classList.remove("selected");
  });

  // Add selection to clicked row
  const row = document.querySelector(`tr[data-id="${id}"]`);
  if (row) {
    row.classList.add("selected");
    selectedTransactionId = id;
  }
}

function addTransaction() {
  const name = prompt("Enter transaction name:");
  if (!name) return;

  const amount = parseFloat(prompt("Enter amount:"));
  if (!amount || amount <= 0) {
    showNotification("Please enter a valid amount", "error");
    return;
  }

  const category =
    prompt(
      "Enter category (food/transport/utilities/entertainment/shopping/health):"
    ) || "other";
  const description = prompt("Enter description:") || "";

  const newTransaction = {
    id: Date.now(),
    name: name,
    date: new Date().toISOString().split("T")[0],
    category: category.toLowerCase(),
    amount: amount,
    description: description,
  };

  transactions.unshift(newTransaction);
  saveToStorage(STORAGE_KEYS.TRANSACTIONS, transactions);
  loadTransactions();
  updateDashboard();
  showNotification("Transaction added successfully!", "success");
}

function editTransaction() {
  if (!selectedTransactionId) {
    showNotification("Please select a transaction to edit", "warning");
    return;
  }

  const transaction = transactions.find((t) => t.id === selectedTransactionId);
  if (!transaction) return;

  const name = prompt("Edit transaction name:", transaction.name);
  if (name !== null && name.trim()) transaction.name = name.trim();

  const amount = prompt("Edit amount:", transaction.amount);
  if (amount !== null && !isNaN(amount) && amount > 0) {
    transaction.amount = parseFloat(amount);
  }

  const category = prompt("Edit category:", transaction.category);
  if (category !== null && category.trim())
    transaction.category = category.trim().toLowerCase();

  const description = prompt("Edit description:", transaction.description);
  if (description !== null) transaction.description = description.trim();

  saveToStorage(STORAGE_KEYS.TRANSACTIONS, transactions);
  loadTransactions();
  updateDashboard();
  showNotification("Transaction updated successfully!", "success");
}

function deleteTransaction() {
  if (!selectedTransactionId) {
    showNotification("Please select a transaction to delete", "warning");
    return;
  }

  if (confirm("Are you sure you want to delete this transaction?")) {
    transactions = transactions.filter((t) => t.id !== selectedTransactionId);
    selectedTransactionId = null;
    saveToStorage(STORAGE_KEYS.TRANSACTIONS, transactions);
    loadTransactions();
    updateDashboard();
    showNotification("Transaction deleted successfully!", "success");
  }
}

function filterTransactions() {
  const filterValue = document.getElementById("filter").value;
  const tbody = document.getElementById("transactionsBody");

  let filteredTransactions = transactions;
  if (filterValue !== "all") {
    filteredTransactions = transactions.filter(
      (t) => t.category === filterValue
    );
  }

  tbody.innerHTML = "";
  filteredTransactions.forEach((transaction) => {
    const row = createTransactionRow(transaction);
    tbody.appendChild(row);
  });
}

// Budget functions
function loadBudgetData() {
  loadBillsTable();
  loadExpensesTable();
  updateBudgetSummary();
}

function loadBillsTable() {
  const tbody = document.querySelector("#billTable tbody");
  tbody.innerHTML = "";

  bills.forEach((bill, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><input type="date" value="${bill.due}" onchange="updateBill(${index}, 'due', this.value)"></td>
      <td><input type="number" value="${bill.budget}" onchange="updateBill(${index}, 'budget', this.value)"></td>
      <td><input type="number" value="${bill.actual}" onchange="updateBill(${index}, 'actual', this.value)"></td>
    `;
    tbody.appendChild(row);
  });
}

function loadExpensesTable() {
  const tbody = document.querySelector("#expenseTable tbody");
  tbody.innerHTML = "";

  expenses.forEach((expense, index) => {
    const row = document.createElement("tr");
    const remaining = expense.budget - expense.actual;
    row.innerHTML = `
      <td><input type="number" value="${
        expense.budget
      }" onchange="updateExpense(${index}, 'budget', this.value)"></td>
      <td><input type="number" value="${
        expense.actual
      }" onchange="updateExpense(${index}, 'actual', this.value)"></td>
      <td style="color: ${
        remaining >= 0 ? "#10b981" : "#ef4444"
      }">₹${remaining.toLocaleString()}</td>
    `;
    tbody.appendChild(row);
  });
}

function updateBill(index, field, value) {
  if (field === "budget" || field === "actual") {
    bills[index][field] = parseFloat(value) || 0;
  } else {
    bills[index][field] = value;
  }
  saveToStorage(STORAGE_KEYS.BILLS, bills);
  updateBudgetSummary();
  updateBudgetPieChart();
}

function updateExpense(index, field, value) {
  expenses[index][field] = parseFloat(value) || 0;
  loadExpensesTable();
  saveToStorage(STORAGE_KEYS.EXPENSES, expenses);
  updateBudgetSummary();
  updateBudgetPieChart();
}

function addBill() {
  const due = prompt("Enter due date (YYYY-MM-DD):");
  if (!due) return;

  // Validate date format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(due)) {
    showNotification("Please enter date in YYYY-MM-DD format", "error");
    return;
  }

  const budget = parseFloat(prompt("Enter budget amount:"));
  if (!budget || budget <= 0) {
    showNotification("Please enter a valid budget amount", "error");
    return;
  }

  bills.push({
    due: due,
    budget: budget,
    actual: 0,
  });

  saveToStorage(STORAGE_KEYS.BILLS, bills);
  loadBillsTable();
  updateBudgetSummary();
  updateBudgetPieChart();
  showNotification("Bill added successfully!", "success");
}

function addExpense() {
  const category = prompt("Enter expense category:");
  if (!category || !category.trim()) {
    showNotification("Please enter a valid category name", "error");
    return;
  }

  const budget = parseFloat(prompt("Enter budget amount:"));
  if (!budget || budget <= 0) {
    showNotification("Please enter a valid budget amount", "error");
    return;
  }

  expenses.push({
    category: category.trim(),
    budget: budget,
    actual: 0,
  });

  saveToStorage(STORAGE_KEYS.EXPENSES, expenses);
  loadExpensesTable();
  updateBudgetSummary();
  updateBudgetPieChart();
  showNotification("Expense category added successfully!", "success");
}

function updateBudgetSummary() {
  // Calculate totals
  const totalIncome = calculateTotalIncome();
  const totalBills = bills.reduce((sum, bill) => sum + bill.actual, 0);
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.actual,
    0
  );

  // Update display
  document.getElementById(
    "incomeValue"
  ).textContent = `₹${totalIncome.toLocaleString()}`;
  document.getElementById(
    "billsValue"
  ).textContent = `₹${totalBills.toLocaleString()}`;
  document.getElementById(
    "expensesValue"
  ).textContent = `₹${totalExpenses.toLocaleString()}`;
}

function calculateTotalIncome() {
  return incomeData.paycheck + incomeData.rent + incomeData.partTime;
}

// Chart functions
function initializeCharts() {
  initializeExpenseChart();
  initializeBudgetPieChart();
}

function initializeExpenseChart() {
  const ctx = document.getElementById("expenseChart");
  if (!ctx) return;

  const chartData = getExpenseChartData("month");

  expenseChart = new Chart(ctx, {
    type: "line",
    data: chartData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: "top",
          labels: {
            usePointStyle: true,
            padding: 20,
            font: {
              family: "Inter",
              size: 12,
            },
          },
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            font: {
              family: "Inter",
              size: 11,
            },
          },
        },
        y: {
          beginAtZero: true,
          grid: {
            color: "rgba(0, 0, 0, 0.05)",
          },
          ticks: {
            font: {
              family: "Inter",
              size: 11,
            },
            callback: function (value) {
              return "₹" + value.toLocaleString();
            },
          },
        },
      },
      elements: {
        point: {
          radius: 6,
          hoverRadius: 8,
        },
        line: {
          tension: 0.4,
          borderWidth: 3,
        },
      },
    },
  });
}

function updateExpenseChart() {
  const range = document.getElementById("rangeSelect").value;
  const newData = getExpenseChartData(range);

  if (expenseChart) {
    expenseChart.data = newData;
    expenseChart.update("active");
  }
}

function getExpenseChartData(range) {
  let labels, data;

  switch (range) {
    case "day":
      labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      // Calculate daily expenses from transactions
      data = calculateDailyExpenses();
      break;
    case "year":
      labels = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      data = calculateMonthlyExpenses();
      break;
    default: // month
      labels = ["Week 1", "Week 2", "Week 3", "Week 4"];
      data = calculateWeeklyExpenses();
  }

  return {
    labels: labels,
    datasets: [
      {
        label: "Expenses",
        data: data,
        borderColor: "rgb(102, 126, 234)",
        backgroundColor: "rgba(102, 126, 234, 0.1)",
        fill: true,
        borderWidth: 3,
        pointBackgroundColor: "rgb(102, 126, 234)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
      },
    ],
  };
}

function calculateDailyExpenses() {
  // Group transactions by day of week
  const dailyTotals = [0, 0, 0, 0, 0, 0, 0]; // Mon-Sun

  transactions.forEach((transaction) => {
    const date = new Date(transaction.date);
    const dayOfWeek = (date.getDay() + 6) % 7; // Convert Sunday=0 to Monday=0
    dailyTotals[dayOfWeek] += transaction.amount;
  });

  return dailyTotals;
}

function calculateWeeklyExpenses() {
  // Simple weekly breakdown based on current month
  const currentMonth = new Date().getMonth();
  const weeklyTotals = [0, 0, 0, 0];

  transactions.forEach((transaction) => {
    const date = new Date(transaction.date);
    if (date.getMonth() === currentMonth) {
      const week = Math.floor((date.getDate() - 1) / 7);
      if (week < 4) {
        weeklyTotals[week] += transaction.amount;
      }
    }
  });

  return weeklyTotals;
}

function calculateMonthlyExpenses() {
  // Group transactions by month
  const monthlyTotals = new Array(12).fill(0);

  transactions.forEach((transaction) => {
    const date = new Date(transaction.date);
    const month = date.getMonth();
    monthlyTotals[month] += transaction.amount;
  });

  return monthlyTotals;
}

function initializeBudgetPieChart() {
  const ctx = document.getElementById("budgetPie");
  if (!ctx) return;

  const totalIncome = calculateTotalIncome();
  const totalBills = bills.reduce((sum, bill) => sum + bill.actual, 0);
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.actual,
    0
  );
  const remaining = totalIncome - totalBills - totalExpenses;

  budgetPieChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Bills", "Expenses", "Available"],
      datasets: [
        {
          data: [totalBills, totalExpenses, Math.max(0, remaining)],
          backgroundColor: ["#ef4444", "#f59e0b", "#10b981"],
          borderWidth: 0,
          cutout: "60%",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  });
}

function updateBudgetPieChart() {
  if (!budgetPieChart) return;

  const totalIncome = calculateTotalIncome();
  const totalBills = bills.reduce((sum, bill) => sum + bill.actual, 0);
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.actual,
    0
  );
  const remaining = totalIncome - totalBills - totalExpenses;

  budgetPieChart.data.datasets[0].data = [
    totalBills,
    totalExpenses,
    Math.max(0, remaining),
  ];
  budgetPieChart.update("active");
}

// Utility functions
function showNotification(message, type = "info") {
  // Create notification element
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.textContent = message;

  // Style the notification
  Object.assign(notification.style, {
    position: "fixed",
    top: "20px",
    right: "20px",
    padding: "15px 25px",
    borderRadius: "10px",
    color: "white",
    fontWeight: "500",
    zIndex: "9999",
    transform: "translateX(400px)",
    transition: "all 0.3s ease",
    maxWidth: "300px",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
    fontFamily: "Inter, sans-serif",
  });

  // Set background color based on type
  const colors = {
    success: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    warning: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    error: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
    info: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  };
  notification.style.background = colors[type] || colors.info;

  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)";
  }, 100);

  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.transform = "translateX(400px)";
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// Data export/import functions
function exportData() {
  const data = {
    transactions: transactions,
    bills: bills,
    expenses: expenses,
    incomeData: incomeData,
    spentAmount: spentAmount,
    monthlyExpenses: monthlyExpenses,
    exportDate: new Date().toISOString(),
    version: "1.0",
  };

  const dataStr = JSON.stringify(data, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `TrackGuy-backup-${
    new Date().toISOString().split("T")[0]
  }.json`;
  link.click();

  URL.revokeObjectURL(url);
  showNotification("Data exported successfully!", "success");
}

function importData(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const data = JSON.parse(e.target.result);

      // Validate and import data
      if (data.transactions && Array.isArray(data.transactions)) {
        transactions = data.transactions;
        saveToStorage(STORAGE_KEYS.TRANSACTIONS, transactions);
      }

      if (data.bills && Array.isArray(data.bills)) {
        bills = data.bills;
        saveToStorage(STORAGE_KEYS.BILLS, bills);
      }

      if (data.expenses && Array.isArray(data.expenses)) {
        expenses = data.expenses;
        saveToStorage(STORAGE_KEYS.EXPENSES, expenses);
      }

      if (data.incomeData && typeof data.incomeData === "object") {
        incomeData = { ...incomeData, ...data.incomeData };
        saveToStorage(STORAGE_KEYS.INCOME, incomeData);
      }

      if (data.spentAmount && typeof data.spentAmount === "number") {
        spentAmount = data.spentAmount;
        saveToStorage(STORAGE_KEYS.SPENT, spentAmount);
      }

      if (data.monthlyExpenses && typeof data.monthlyExpenses === "object") {
        monthlyExpenses = { ...monthlyExpenses, ...data.monthlyExpenses };
        saveToStorage(STORAGE_KEYS.MONTHLY_EXPENSES, monthlyExpenses);
      }

      // Reload all data and refresh UI
      initializeApp();
      showNotification("Data imported successfully!", "success");
    } catch (error) {
      console.error("Import error:", error);
      showNotification(
        "Error importing data. Please check file format.",
        "error"
      );
    }
  };
  reader.readAsText(file);
}

// Clear all data function
function clearAllData() {
  if (
    confirm(
      "Are you sure you want to clear all data? This action cannot be undone."
    )
  ) {
    // Clear localStorage
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });

    // Reset to default values
    transactions = [];
    bills = [];
    expenses = [];
    incomeData = { paycheck: 80000, rent: 20000, partTime: 25000 };
    spentAmount = 25000;
    monthlyExpenses = { clothes: 5000, groceries: 10000 };

    // Create new sample data
    createSampleData();
    initializeApp();

    showNotification("All data cleared and reset to defaults", "info");
  }
}

// Enhanced animations and interactions
function addInteractiveEffects() {
  // Add loading state to buttons
  const buttons = document.querySelectorAll("button");
  buttons.forEach((button) => {
    button.addEventListener("click", function () {
      if (!this.classList.contains("loading")) {
        this.classList.add("loading");
        setTimeout(() => {
          this.classList.remove("loading");
        }, 1000);
      }
    });
  });

  // Add smooth scroll to tables
  const tables = document.querySelectorAll(
    ".transactions-table-wrapper, .budget-table tbody"
  );
  tables.forEach((table) => {
    table.style.scrollBehavior = "smooth";
  });

  // Add form validation feedback
  const inputs = document.querySelectorAll('input[type="number"]');
  inputs.forEach((input) => {
    input.addEventListener("invalid", function () {
      this.style.borderColor = "#ef4444";
      this.style.boxShadow = "0 0 0 3px rgba(239, 68, 68, 0.1)";
      showNotification("Please enter a valid number", "error");
    });

    input.addEventListener("input", function () {
      if (this.validity.valid) {
        this.style.borderColor = "#10b981";
        this.style.boxShadow = "0 0 0 3px rgba(16, 185, 129, 0.1)";
      }
    });
  });
}

// Auto-save functionality with localStorage
function setupAutoSave() {
  const inputs = document.querySelectorAll('input[type="number"]');
  inputs.forEach((input) => {
    let timeoutId;
    input.addEventListener("input", function () {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        // Auto-save to localStorage
        saveAllData();
        showNotification("Changes saved automatically", "info");
      }, 2000);
    });
  });
}

// Performance optimization
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Debounced update functions for better performance
const debouncedUpdateDashboard = debounce(() => {
  updateDashboard();
  saveAllData();
}, 300);

const debouncedUpdateBudgetSummary = debounce(() => {
  updateBudgetSummary();
  saveAllData();
}, 300);

// Analytics and reporting functions
function getExpenseAnalytics() {
  const analytics = {
    totalTransactions: transactions.length,
    totalSpent: transactions.reduce((sum, t) => sum + t.amount, 0),
    averageTransaction:
      transactions.length > 0
        ? transactions.reduce((sum, t) => sum + t.amount, 0) /
          transactions.length
        : 0,
    categoryBreakdown: {},
    monthlyTrend: calculateMonthlyTrend(),
  };

  // Calculate category breakdown
  transactions.forEach((transaction) => {
    if (analytics.categoryBreakdown[transaction.category]) {
      analytics.categoryBreakdown[transaction.category] += transaction.amount;
    } else {
      analytics.categoryBreakdown[transaction.category] = transaction.amount;
    }
  });

  return analytics;
}

function calculateMonthlyTrend() {
  const monthlyData = {};

  transactions.forEach((transaction) => {
    const date = new Date(transaction.date);
    const monthKey = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;

    if (monthlyData[monthKey]) {
      monthlyData[monthKey] += transaction.amount;
    } else {
      monthlyData[monthKey] = transaction.amount;
    }
  });

  return monthlyData;
}

// Budget health check
function checkBudgetHealth() {
  const totalIncome = calculateTotalIncome();
  const totalBills = bills.reduce((sum, bill) => sum + bill.budget, 0);
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.budget,
    0
  );
  const totalAllocated = totalBills + totalExpenses;

  const health = {
    status: "good",
    message: "Your budget looks healthy!",
    recommendations: [],
  };

  if (totalAllocated > totalIncome) {
    health.status = "critical";
    health.message = "Your allocated budget exceeds your income!";
    health.recommendations.push(
      "Consider reducing expenses or increasing income"
    );
  } else if (totalAllocated > totalIncome * 0.9) {
    health.status = "warning";
    health.message = "You're using most of your income. Consider saving more.";
    health.recommendations.push("Try to allocate at least 10% for savings");
  }

  // Check for overdue bills
  const overdueBills = bills.filter((bill) => {
    const dueDate = new Date(bill.due);
    const today = new Date();
    return dueDate < today && bill.actual < bill.budget;
  });

  if (overdueBills.length > 0) {
    health.recommendations.push(
      `You have ${overdueBills.length} overdue bill(s)`
    );
  }

  return health;
}

// Search functionality for transactions
function searchTransactions(query) {
  if (!query.trim()) {
    loadTransactions();
    return;
  }

  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.name.toLowerCase().includes(query.toLowerCase()) ||
      transaction.description.toLowerCase().includes(query.toLowerCase()) ||
      transaction.category.toLowerCase().includes(query.toLowerCase())
  );

  const tbody = document.getElementById("transactionsBody");
  tbody.innerHTML = "";
  filteredTransactions.forEach((transaction) => {
    const row = createTransactionRow(transaction);
    tbody.appendChild(row);
  });
}

// Backup and restore functions
function createBackup() {
  const backup = {
    data: {
      transactions: transactions,
      bills: bills,
      expenses: expenses,
      incomeData: incomeData,
      spentAmount: spentAmount,
      monthlyExpenses: monthlyExpenses,
    },
    metadata: {
      backupDate: new Date().toISOString(),
      version: "1.0",
      totalTransactions: transactions.length,
      totalIncome: calculateTotalIncome(),
    },
  };

  saveToStorage("TrackGuy_backup_" + Date.now(), backup);
  showNotification("Backup created successfully!", "success");
  return backup;
}

function restoreFromBackup(backupKey) {
  try {
    const backup = loadFromStorage(backupKey);
    if (backup && backup.data) {
      // Restore all data
      transactions = backup.data.transactions || [];
      bills = backup.data.bills || [];
      expenses = backup.data.expenses || [];
      incomeData = backup.data.incomeData || {
        paycheck: 80000,
        rent: 20000,
        partTime: 25000,
      };
      spentAmount = backup.data.spentAmount || 25000;
      monthlyExpenses = backup.data.monthlyExpenses || {
        clothes: 5000,
        groceries: 10000,
      };

      // Save restored data
      saveAllData();
      initializeApp();

      showNotification("Data restored successfully!", "success");
      return true;
    }
  } catch (error) {
    console.error("Restore error:", error);
    showNotification("Error restoring backup", "error");
    return false;
  }
}

// Initialize enhanced features when DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  setTimeout(() => {
    addInteractiveEffects();
    setupAutoSave();
  }, 500);
});

// Keyboard shortcuts
document.addEventListener("keydown", function (e) {
  if (e.ctrlKey || e.metaKey) {
    switch (e.key) {
      case "1":
        e.preventDefault();
        showSection("dashboard");
        break;
      case "2":
        e.preventDefault();
        showSection("transactions");
        break;
      case "3":
        e.preventDefault();
        showSection("budget");
        break;
      case "s":
        e.preventDefault();
        createBackup();
        break;
      case "e":
        e.preventDefault();
        exportData();
        break;
    }
  }

  // ESC key to deselect transaction
  if (e.key === "Escape") {
    if (selectedTransactionId) {
      document.querySelectorAll(".transactions-table tr").forEach((row) => {
        row.classList.remove("selected");
      });
      selectedTransactionId = null;
    }
  }
});

// Window beforeunload event to save data
window.addEventListener("beforeunload", function () {
  saveAllData();
});

// Periodic auto-save every 30 seconds
setInterval(() => {
  saveAllData();
}, 30000);

// Storage event listener for sync across tabs
window.addEventListener("storage", function (e) {
  if (Object.values(STORAGE_KEYS).includes(e.key)) {
    // Reload data if another tab modified it
    loadDataFromStorage();
    initializeApp();
    showNotification("Data synchronized from another tab", "info");
  }
});

// Initialize data validation
function validateData() {
  // Validate transactions
  transactions = transactions.filter(
    (t) => t.id && t.name && t.date && t.amount && typeof t.amount === "number"
  );

  // Validate bills
  bills = bills.filter(
    (b) => b.due && typeof b.budget === "number" && typeof b.actual === "number"
  );

  // Validate expenses
  expenses = expenses.filter(
    (e) =>
      e.category && typeof e.budget === "number" && typeof e.actual === "number"
  );

  // Validate income data
  if (!incomeData || typeof incomeData !== "object") {
    incomeData = { paycheck: 80000, rent: 20000, partTime: 25000 };
  }

  // Validate spent amount
  if (typeof spentAmount !== "number" || isNaN(spentAmount)) {
    spentAmount = 25000;
  }

  // Validate monthly expenses
  if (!monthlyExpenses || typeof monthlyExpenses !== "object") {
    monthlyExpenses = { clothes: 5000, groceries: 10000 };
  }
}

// Storage quota management
function checkStorageQuota() {
  try {
    const testKey = "storage_test";
    const testData = "x".repeat(1024); // 1KB test
    localStorage.setItem(testKey, testData);
    localStorage.removeItem(testKey);
    return true;
  } catch (error) {
    if (error.name === "QuotaExceededError") {
      showNotification(
        "Storage quota exceeded. Consider exporting and clearing old data.",
        "warning"
      );
      return false;
    }
    return true;
  }
}

// Advanced search with multiple criteria
function advancedSearch(criteria) {
  let filtered = transactions;

  if (criteria.category && criteria.category !== "all") {
    filtered = filtered.filter((t) => t.category === criteria.category);
  }

  if (criteria.minAmount) {
    filtered = filtered.filter((t) => t.amount >= criteria.minAmount);
  }

  if (criteria.maxAmount) {
    filtered = filtered.filter((t) => t.amount <= criteria.maxAmount);
  }

  if (criteria.dateFrom) {
    filtered = filtered.filter(
      (t) => new Date(t.date) >= new Date(criteria.dateFrom)
    );
  }

  if (criteria.dateTo) {
    filtered = filtered.filter(
      (t) => new Date(t.date) <= new Date(criteria.dateTo)
    );
  }

  if (criteria.searchText) {
    const query = criteria.searchText.toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.name.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query)
    );
  }

  return filtered;
}

// Budget recommendations AI
function getBudgetRecommendations() {
  const analytics = getExpenseAnalytics();
  const totalIncome = calculateTotalIncome();
  const recommendations = [];

  // 50/30/20 rule check
  const totalExpenses = analytics.totalSpent;
  const needsPercentage = (totalExpenses / totalIncome) * 100;

  if (needsPercentage > 50) {
    recommendations.push({
      type: "warning",
      message:
        "Consider reducing expenses to follow the 50/30/20 budgeting rule",
      action: "Review your largest expense categories",
    });
  }

  // Category-specific recommendations
  Object.entries(analytics.categoryBreakdown).forEach(([category, amount]) => {
    const percentage = (amount / totalIncome) * 100;

    if (category === "food" && percentage > 15) {
      recommendations.push({
        type: "tip",
        message:
          "Food expenses are high. Consider meal planning to reduce costs.",
        action: "Set a weekly food budget",
      });
    }

    if (category === "entertainment" && percentage > 10) {
      recommendations.push({
        type: "tip",
        message: "Entertainment spending is above recommended 10% of income.",
        action: "Look for free or low-cost entertainment options",
      });
    }
  });

  return recommendations;
}

// Report generation
function generateMonthlyReport() {
  const analytics = getExpenseAnalytics();
  const totalIncome = calculateTotalIncome();
  const budgetHealth = checkBudgetHealth();
  const recommendations = getBudgetRecommendations();

  const report = {
    month: new Date().toLocaleDateString("en-IN", {
      month: "long",
      year: "numeric",
    }),
    income: totalIncome,
    expenses: analytics.totalSpent,
    savings: totalIncome - analytics.totalSpent,
    savingsRate: (
      ((totalIncome - analytics.totalSpent) / totalIncome) *
      100
    ).toFixed(1),
    transactionCount: analytics.totalTransactions,
    averageTransaction: analytics.averageTransaction.toFixed(0),
    topCategory: Object.keys(analytics.categoryBreakdown).reduce(
      (a, b) =>
        analytics.categoryBreakdown[a] > analytics.categoryBreakdown[b] ? a : b,
      ""
    ),
    budgetHealth: budgetHealth,
    recommendations: recommendations,
    generatedAt: new Date().toISOString(),
  };

  return report;
}

// Data synchronization across browser tabs
function syncDataAcrossTabs() {
  // Listen for storage changes from other tabs
  window.addEventListener("storage", function (e) {
    if (Object.values(STORAGE_KEYS).includes(e.key)) {
      console.log("Data changed in another tab, syncing...");
      loadDataFromStorage();
      validateData();
      initializeApp();
    }
  });
}

// Error handling and data recovery
function handleDataCorruption() {
  try {
    validateData();
    saveAllData();
  } catch (error) {
    console.error("Data corruption detected:", error);

    // Attempt recovery from backup
    const backupKeys = Object.keys(localStorage).filter((key) =>
      key.startsWith("TrackGuy_backup_")
    );

    if (backupKeys.length > 0) {
      // Get most recent backup
      const latestBackup = backupKeys.sort().pop();
      if (confirm("Data corruption detected. Restore from latest backup?")) {
        restoreFromBackup(latestBackup);
      }
    } else {
      // Reset to defaults
      if (
        confirm(
          "Data corruption detected and no backups available. Reset to defaults?"
        )
      ) {
        clearAllData();
      }
    }
  }
}

// Initialize comprehensive error handling
document.addEventListener("DOMContentLoaded", function () {
  // Check storage availability
  if (typeof Storage === "undefined") {
    showNotification(
      "Local storage not supported. Data will not persist.",
      "warning"
    );
  } else {
    checkStorageQuota();
    syncDataAcrossTabs();
  }

  // Validate data integrity
  validateData();

  // Setup periodic backup
  setInterval(createBackup, 300000); // Every 5 minutes

  // Handle errors gracefully
  window.addEventListener("error", function (e) {
    console.error("Application error:", e.error);
    showNotification("An error occurred. Your data has been saved.", "error");
    saveAllData();
  });

  setTimeout(() => {
    addInteractiveEffects();
    setupAutoSave();
  }, 500);
});

// Cleanup function for memory management
function cleanup() {
  // Destroy charts to prevent memory leaks
  if (expenseChart) {
    expenseChart.destroy();
    expenseChart = null;
  }

  if (budgetPieChart) {
    budgetPieChart.destroy();
    budgetPieChart = null;
  }
}

// Page visibility API for better performance
document.addEventListener("visibilitychange", function () {
  if (document.hidden) {
    // Save data when tab becomes hidden
    saveAllData();
  } else {
    // Refresh data when tab becomes visible
    loadDataFromStorage();
    updateDashboard();
    updateBudgetSummary();
  }
});
