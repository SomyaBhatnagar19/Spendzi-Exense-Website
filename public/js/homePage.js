/* /public/js/homePage.js */

const categoryItems = document.querySelectorAll(".dropdown-item");
const categoryInput = document.querySelector("#categoryInput");
const categoryBtn = document.querySelector("#categoryBtn");
const form = document.getElementById("form1");
const addExpenseBtn = document.getElementById("submitBtn");
const table = document.getElementById("tbodyId");

//for premium
const buyPremiumBtn = document.getElementById("buyPremiumBtn");
const reportsLink = document.getElementById("reportsLink");
const leaderboardLink = document.getElementById("leaderboardLink");
const downloadReportBtn = document.getElementById("downloadReportBtn");


const logoutBtn = document.getElementById("logout-btn");

categoryItems.forEach((item) => {
  item.addEventListener("click", (e) => {
    const selectedCategory = e.target.getAttribute("data-value");
    categoryBtn.textContent = e.target.textContent;
    categoryInput.value = selectedCategory;
  });
});

async function addExpense() {
  try {
    const date = document.getElementById("dateInput").value;
    const category = document.getElementById("categoryBtn");
    const description = document.getElementById("descriptionValue");
    const amount = document.getElementById("amountValue");
    const categoryValue = category.textContent.trim();
    const descriptionValue = description.value.trim();
    const amountValue = amount.value.trim();

    if (!date) {
      alert("Add the Date!");
      return;
    }
    if (categoryValue == "Select Category") {
      alert("Select the Category!");
      return;
    }
    if (!descriptionValue) {
      alert("Add the Description!");
      return;
    }
    if (!parseInt(amountValue)) {
      alert("Please enter the valid amount!");
      return;
    }

    const token = localStorage.getItem("token");

    const res = await axios.post(
      "http://localhost:3000/expense/addExpense",
      {
        date: date,
        category: categoryValue,
        description: descriptionValue,
        amount: parseInt(amountValue),
      },
      { headers: { Authorization: token } }
    );

    // Handle the response
    if (res.status === 200) {
      window.location.reload();
    }
  } catch (err) {
    console.error("Error adding expense:", err);
  }
}

async function getAllExpenses() {
  // e.preventDefault();
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      "http://localhost:3000/expense/getAllExpenses/1",
      { headers: { Authorization: token } }
    );
    res.data.expenses.forEach((expenses) => {
      const id = expenses.id;
      const date = expenses.date;
      const categoryValue = expenses.category;
      const descriptionValue = expenses.description;
      const amountValue = expenses.amount;

      let tr = document.createElement("tr");
      tr.className = "trStyle";

      table.appendChild(tr);

      let idValue = document.createElement("th");
      idValue.setAttribute("scope", "row");
      idValue.setAttribute("style", "display: none");

      let th = document.createElement("th");
      th.setAttribute("scope", "row");

      tr.appendChild(idValue);
      tr.appendChild(th);

      idValue.appendChild(document.createTextNode(id));
      th.appendChild(document.createTextNode(date));

      let td1 = document.createElement("td");
      td1.appendChild(document.createTextNode(categoryValue));

      let td2 = document.createElement("td");
      td2.appendChild(document.createTextNode(descriptionValue));

      let td3 = document.createElement("td");
      td3.appendChild(document.createTextNode(amountValue));

      let td4 = document.createElement("td");

      let deleteBtn = document.createElement("button");
      deleteBtn.className = "editDelete btn btn-danger delete";
      deleteBtn.innerHTML = "&#128465;"; // 🗑️
      deleteBtn.style.marginRight = "0.5rem";
      deleteBtn.style.backgroundColor = "#ef4444";

      let editBtn = document.createElement("button");
      editBtn.className = "editDelete btn btn-success edit";
      editBtn.innerHTML = "&#128395;"; // ✏️
      editBtn.style.backgroundColor = "#047857";

      // Append buttons to the td element
      td4.appendChild(deleteBtn);
      td4.appendChild(editBtn);

      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
      tr.appendChild(td4);
    });
    const ul = document.getElementById("paginationUL");
    for (let i = 1; i <= res.data.totalPages; i++) {
      const li = document.createElement("li");
      const a = document.createElement("a");
      li.setAttribute("class", "page-item");
      a.setAttribute("class", "page-link");
      a.setAttribute("href", "#");
      a.appendChild(document.createTextNode(i));
      li.appendChild(a);
      ul.appendChild(li);
      a.addEventListener("click", paginationBtn);
    }
  } catch {
    (err) => console.log(err);
  }
}

//pagination function
async function paginationBtn(e) {
  try {
    const pageNo = e.target.textContent;
    const token = localStorage.getItem("token");
    const res = await axios.get(
      `http://localhost:3000/expense/getAllExpenses/${pageNo}`,
      { headers: { Authorization: token } }
    );

    table.innerHTML = "";

    res.data.expenses.forEach((expenses) => {
      const id = expenses.id;
      const date = expenses.date;
      const categoryValue = expenses.category;
      const descriptionValue = expenses.description;
      const amountValue = expenses.amount;

      let tr = document.createElement("tr");
      tr.className = "trStyle";

      table.appendChild(tr);

      let idValue = document.createElement("th");
      idValue.setAttribute("scope", "row");
      idValue.setAttribute("style", "display: none");

      let th = document.createElement("th");
      th.setAttribute("scope", "row");

      tr.appendChild(idValue);
      tr.appendChild(th);

      idValue.appendChild(document.createTextNode(id));
      th.appendChild(document.createTextNode(date));

      let td1 = document.createElement("td");
      td1.appendChild(document.createTextNode(categoryValue));

      let td2 = document.createElement("td");
      td2.appendChild(document.createTextNode(descriptionValue));

      let td3 = document.createElement("td");
      td3.appendChild(document.createTextNode(amountValue));

      let td4 = document.createElement("td");

      let deleteBtn = document.createElement("button");
      deleteBtn.className = "editDelete btn btn-danger delete";
      deleteBtn.innerHTML = "&#128465;"; // 🗑️
      deleteBtn.style.marginRight = "0.5rem";
      deleteBtn.style.backgroundColor = "#ef4444";

      let editBtn = document.createElement("button");
      editBtn.className = "editDelete btn btn-success edit";
      editBtn.innerHTML = "&#128395;"; // ✏️
      editBtn.style.backgroundColor = "#047857";

      // Append buttons to the td element
      td4.appendChild(deleteBtn);
      td4.appendChild(editBtn);

      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
      tr.appendChild(td4);
    });
  } catch (error) {
    console.log(error);
  }
}

async function deleteExpense(e) {
  try {
    const token = localStorage.getItem("token");
    if (e.target.classList.contains("delete")) {
      let tr = e.target.parentElement.parentElement;
      let id = tr.children[0].textContent;
      const res = await axios.get(
        `http://localhost:3000/expense/deleteExpense/${id}`,
        { headers: { Authorization: token } }
      );
      window.location.reload();
    }
  } catch {
    (err) => console.log(err);
  }
}

async function editExpense(e) {
  try {
    const token = localStorage.getItem("token");
    const categoryValue = document.getElementById("categoryBtn");
    const descriptionValue = document.getElementById("descriptionValue");
    const amountValue = document.getElementById("amountValue");
    const addExpenseBtn = document.getElementById("submitBtn");
    if (e.target.classList.contains("edit")) {
      let tr = e.target.parentElement.parentElement;
      let id = tr.children[0].textContent;
      //Fill the input values with the existing values
      const res = await axios.get(
        "http://localhost:3000/expense/getAllExpenses",
        { headers: { Authorization: token } }
      );
      res.data.forEach((expense) => {
        if (expense.id == id) {
          console.log("Yeh id aayi hai res main: " + expense.id);
          categoryValue.textContent = expense.category;
          descriptionValue.value = expense.description;
          amountValue.value = expense.amount;
          addExpenseBtn.textContent = "Update";

          addExpenseBtn.removeEventListener("click", addExpense);

          addExpenseBtn.addEventListener("click", async function update(e) {
            e.preventDefault();
            console.log("request to backend for edit");
            const res = await axios.post(
              `http://localhost:3000/expense/editExpense/${id}`,
              {
                category: categoryValue.textContent.trim(),
                description: descriptionValue.value,
                amount: amountValue.value,
              },
              { headers: { Authorization: token } }
            );
            window.location.reload();
          });
        }
      });
    }
  } catch {
    (err) => console.log(err);
  }
}

document.addEventListener("DOMContentLoaded", getAllExpenses);

async function buyPremium(e) {
  const token = localStorage.getItem("token");
  const res = await axios.get(
    "http://localhost:3000/purchase/premiumMembership",
    { headers: { Authorization: token } }
  );
  console.log(res);
  var options = {
    key: res.data.key_id,
    order_id: res.data.order.id, // For one time payment

    // This handler function will handle the success payment
    handler: async function (response) {
      const res = await axios.post(
        "http://localhost:3000/purchase/updateTransactionStatus",
        {
          order_id: options.order_id,
          payment_id: response.razorpay_payment_id,
        },
        { headers: { Authorization: token } }
      );

      console.log(res);
      alert(
        "Welcome to our Premium Membership, You can now see Reports and have a comparitive analysis of your expenses through LeaderBoard."
      );
      window.location.reload();
      localStorage.setItem("token", res.data.token);
    },
  };
  const rzp1 = new Razorpay(options);
  rzp1.open();
  e.preventDefault();
}

async function isPremiumUser() {
  const token = localStorage.getItem("token");
  const res = await axios.get("http://localhost:3000/user/isPremiumUser", {
    headers: { Authorization: token },
  });
  if (res.data.isPremiumUser) {
    buyPremiumBtn.innerHTML = "Premium Member &#128081";
    reportsLink.removeAttribute("onclick");
    leaderboardLink.removeAttribute("onclick");
    downloadReportBtn.removeAttribute("onclick");
    
    //for leaderboard functionality
    leaderboardLink.setAttribute("href", "/premium/getLeaderboardPage");

    //for expense report functionality
    reportsLink.setAttribute("href", "/reports/getReportsPage");

    //for s3 download services
    downloadReportBtn.setAttribute("href", "/expense/downloadReport");
    downloadReportBtn.innerHTML = "Download Report &#x1F4E5;";

    buyPremiumBtn.removeEventListener("click", buyPremium);
  } else {
  }
}

buyPremiumBtn.addEventListener("click", buyPremium);
addExpenseBtn.addEventListener("click", addExpense);
document.addEventListener("DOMContentLoaded", isPremiumUser);
document.addEventListener("DOMContentLoaded", getAllExpenses);
table.addEventListener("click", (e) => {
  deleteExpense(e);
});

table.addEventListener("click", (e) => {
  editExpense(e);
});

//Functionality for Credit Expense data
async function getCreditExpenseData() {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:3000/credit/creditExpense", {
      headers: { Authorization: token },
    });
    const totalIncomeSum = res.data.totalIncomeSum;
    const totalSavingsSum = res.data.totalSavingsSum;

    // Update the elements with the new values
    const totalIncomeElement = document.getElementById("totalIncome");
    const totalSavingsElement = document.getElementById("totalSavings");

    if (totalIncomeElement && totalSavingsElement) {
      totalIncomeElement.innerText = totalIncomeSum;
      totalSavingsElement.innerText = totalSavingsSum;
    }
  } catch (err) {
    console.error("Error getting credit expense data:", err);
  }
}

document.addEventListener("DOMContentLoaded", getCreditExpenseData);


//Functionality to add credit expense data
async function addCreditExpense(e) {
  e.preventDefault();
  try {
    const token = localStorage.getItem("token");
    const description = document
      .getElementById("creditDescriptionInput")
      .value.trim();
    const totalIncome = document
      .getElementById("totalIncomeInput")
      .value.trim();
    if (!description || !totalIncome) {
      alert("Please fill in all fields.");
      return;
    }
    const res = await axios.post(
      "http://localhost:3000/credit/creditExpense",
      { description: description, totalIncome: totalIncome, totalSavings: totalSavings },
      { headers: { Authorization: token } }
    );
    console.log(res.data);
     // Clear the input fields
     document.getElementById("creditDescriptionInput").value = "";
     document.getElementById("totalIncomeInput").value = "";
    
    // Update the totalIncome and totalSavings in the UI if the elements exist
    const totalIncomeElement = document.getElementById("totalIncome");
    const totalSavingElement = document.getElementById("totalSavings");
    if (totalIncomeElement && totalSavingElement) {
      totalIncomeElement.textContent = res.data.totalIncomeSum;
      totalSavingElement.textContent = res.data.totalSavingsSum;
    }
    
    getCreditExpenseData();
   
  } catch (err) {
    console.error("Error adding credit expense:", err);
  }
}
document
  .getElementById("addCreditBtn")
  .addEventListener("click", addCreditExpense);

//download report button functionality
downloadReportBtn.addEventListener("click", async (e) => {
  try {
    const token = localStorage.getItem("token");
    console.log("download report ka token: ", token);
    
    const res = await axios.get("http://localhost:3000/user/isPremiumUser", {
      headers: { Authorization: token },
    });
    // Checking if user has premium membership
    if (res.data.isPremiumUser) {
      const downloadRes = await axios.get("http://localhost:3000/expense/downloadReport", {
        headers: { Authorization: token },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([downloadRes.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'ExpenseReport.csv'); // Set the file name to .csv
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      // Redirect to homepage after download
      window.location.href = "/homePage";
    } else {
      alert("This feature is only available for premium members.");
    }
  } catch (err) {
    console.error("Error downloading report:", err);
  }
});

  //logout function
  async function logout() {
    try {
      localStorage.clear();
      window.location.href = "/";
    } catch (error) {
      console.log(error);
    }
  }
  
  logoutBtn.addEventListener("click", logout);