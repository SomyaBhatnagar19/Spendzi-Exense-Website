/* /public/js/homePage.js */

const categoryItems = document.querySelectorAll(".dropdown-item");
const categoryInput = document.querySelector("#categoryInput");
const categoryBtn = document.querySelector("#categoryBtn");
const form = document.getElementById("form1");
const addExpenseBtn = document.getElementById("submitBtn");
const table = document.getElementById("tbodyId");

categoryItems.forEach((item) => {
  item.addEventListener("click", (e) => {
    const selectedCategory = e.target.getAttribute("data-value");
    categoryBtn.textContent = e.target.textContent;
    categoryInput.value = selectedCategory;
  });
});

async function addExpense() {
  try {
    const date = document.getElementById("dateInput").value; // Extracting the value of the date input field
    const category = document.getElementById("categoryBtn");
    const description = document.getElementById("descriptionValue");
    const amount = document.getElementById("amountValue");
    const categoryValue = category.textContent.trim();
    const descriptionValue = description.value.trim();
    const amountValue = amount.value.trim();

    if (!date) {
      alert("Add the Date!");
      return; // Return here to prevent further execution
    }
    if (categoryValue == "Select Category") {
      alert("Select the Category!");
      return; // Return here to prevent further execution
    }
    if (!descriptionValue) {
      alert("Add the Description!");
      return; // Return here to prevent further execution
    }
    if (!parseInt(amountValue)) {
      alert("Please enter the valid amount!");
      return; // Return here to prevent further execution
    }

    const res = await axios
      .post("http://localhost:3000/expense/addExpense", {
        date: date, // Pass the extracted date value
        category: categoryValue,
        description: descriptionValue,
        amount: parseInt(amountValue),
      })
      .then((res) => {
        if (res.status == 200) {
          window.location.reload();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  } catch {
    console.error("AddExpense went wrong");
  }
}

async function getAllExpenses() {
  // e.preventDefault();
  try {
    const res = await axios.get("http://localhost:3000/expense/getAllExpenses");
    console.log(res.data);
    res.data.forEach((expenses) => {
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
      deleteBtn.className = "editDelete btn btn-danger delete ";
      deleteBtn.innerHTML = "&#128465;"; // 🗑️

      let editBtn = document.createElement("button");
      editBtn.className = "editDelete btn btn-success edit";
      editBtn.innerHTML = "&#128395;"; // ✏️

      td4.appendChild(deleteBtn);
      td4.appendChild(editBtn);

      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
      tr.appendChild(td4);
    });
  } catch {
    (err) => console.log(err);
  }
}

async function deleteExpense(e) {
  try {
    if (e.target.classList.contains("delete")) {
      let tr = e.target.parentElement.parentElement;
      let id = tr.children[0].textContent;
      const res = await axios.get(
        `http://localhost:3000/expense/deleteExpense/${id}`
      );
      window.location.reload();
    }
  } catch {
    (err) => console.log(err);
  }
}

async function editExpense(e) {
  try {
    const categoryValue = document.getElementById("categoryBtn");
    const descriptionValue = document.getElementById("descriptionValue");
    const amountValue = document.getElementById("amountValue");
    const addExpenseBtn = document.getElementById("submitBtn");
    if (e.target.classList.contains("edit")) {
      let tr = e.target.parentElement.parentElement;
      let id = tr.children[0].textContent;
      //Fill the input values with the existing values
      const res = await axios.get(
        "http://localhost:3000/expense/getAllExpenses"
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
              }
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

addExpenseBtn.addEventListener("click", addExpense);

document.addEventListener("DOMContentLoaded", getAllExpenses);

table.addEventListener("click", (e) => {
  deleteExpense(e);
});

table.addEventListener("click", (e) => {
  editExpense(e);
});
