/* /public/js/reports.js */

//daily
const dateInput = document.getElementById("date");
const dateShowBtn = document.getElementById("dateShowBtn");
const tbodyDaily = document.getElementById("tbodyDailyId"); 
const tfootDaily = document.getElementById("tfootDailyId");

//flexi
const weekStartDateInput = document.getElementById("weekStartDate");
const weekEndDateInput = document.getElementById("weekEndDate");
const weeklyForm = document.getElementById("weeklyForm");
const tbodyWeekly = document.getElementById("tbodyWeeklyId");
const weeklyTotalAmount = document.getElementById("weeklyTotalAmount");

//monthly
const monthInput = document.getElementById("month");
const monthShowBtn = document.getElementById("monthShowBtn");
const tbodyMonthly = document.getElementById("tbodyMonthlyId");
const tfootMonthly = document.getElementById("tfootMonthlyId");

// yearly
const yearInput = document.getElementById("year-input");
const yearShowBtn = document.getElementById("yearShowBtn");
const tbodyYearly = document.getElementById("tbodyYearlyId");
const tfootYearly = document.getElementById("tfootYearlyId");

const downloadReportBtn = document.getElementById("downloadReportBtn");
const logoutBtn = document.getElementById("logout-btn");

//daily report
async function getDailyReport(e) {
  try {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const date = new Date(dateInput.value);
    const formattedDate = date.toISOString().split("T")[0]; // Format date as YYYY-MM-DD

    let totalAmount = 0;
    const res = await axios.post(
      "http://localhost:3000/reports/dailyReports",
      {
        date: formattedDate,
      },
      { headers: { Authorization: token } }
    );

    tbodyDaily.innerHTML = "";
    tfootDaily.innerHTML = "";

    if (res.data.length === 0) {
      tbodyDaily.innerHTML =
        "<tr><td colspan='4'>No expenses found for this date</td></tr>";
      return;
    }

    res.data.forEach((expense) => {
      totalAmount += expense.amount;

      const tr = document.createElement("tr");
      tr.setAttribute("class", "trStyle");
      tbodyDaily.appendChild(tr);

      const th = document.createElement("th");
      th.setAttribute("scope", "row");
      th.appendChild(document.createTextNode(expense.date));

      const td1 = document.createElement("td");
      td1.appendChild(document.createTextNode(expense.category));

      const td2 = document.createElement("td");
      td2.appendChild(document.createTextNode(expense.description));

      const td3 = document.createElement("td");
      td3.appendChild(document.createTextNode(expense.amount));

      tr.appendChild(th);
      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
    });

    const tr = document.createElement("tr");
    tr.setAttribute("class", "trStyle");
    tfootDaily.appendChild(tr);

    const td1 = document.createElement("td");
    const td2 = document.createElement("td");
    const td3 = document.createElement("td");
    const td4 = document.createElement("td");

    td3.setAttribute("id", "dailyTotal");
    td4.setAttribute("id", "dailyTotalAmount");
    td3.appendChild(document.createTextNode("Total"));
    td4.appendChild(document.createTextNode(totalAmount));

    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
  } catch (error) {
    console.log(error);
    tbodyDaily.innerHTML =
      "<tr><td colspan='4'>An error occurred. Please try again later.</td></tr>";
  }
}

//Flexible dates reports
async function getFlexiReport(e) {
  e.preventDefault();
  const token = localStorage.getItem("token");
  const startDate = weekStartDateInput.value;
  const endDate = weekEndDateInput.value;

  try {
    const res = await axios.post(
      "http://localhost:3000/reports/flexiReports",
      { startDate, endDate },
      { headers: { Authorization: token } }
    );

    let totalAmount = 0;
    tbodyWeekly.innerHTML = "";
    res.data.forEach((expense) => {
      totalAmount += expense.amount;

      const tr = document.createElement("tr");
      tr.setAttribute("class", "trStyle");
      tbodyWeekly.appendChild(tr);

      const th = document.createElement("th");
      th.setAttribute("scope", "row");
      th.appendChild(document.createTextNode(expense.date));

      const td1 = document.createElement("td");
      td1.appendChild(document.createTextNode(expense.category));

      const td2 = document.createElement("td");
      td2.appendChild(document.createTextNode(expense.description));

      const td3 = document.createElement("td");
      td3.appendChild(document.createTextNode(expense.amount));

      tr.appendChild(th);
      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
    });

    weeklyTotalAmount.innerText = totalAmount;
  } catch (error) {
    console.log(error);
  }
}

//Montly report
async function getMonthlyReport(e) {
    try {
      e.preventDefault();
      const token = localStorage.getItem("token");
      const selectedMonth = monthInput.value;
      const month = selectedMonth.split('-')[1]; // Extract month part from YYYY-MM format
  
      const res = await axios.post(
        "http://localhost:3000/reports/monthlyReports",
        { month },
        { headers: { Authorization: token } }
      );
  
      let totalAmount = 0;
      tbodyMonthly.innerHTML = "";
      res.data.forEach((expense) => {
        totalAmount += expense.amount;

        const tr = document.createElement("tr");
        tr.setAttribute("class", "trStyle");
        tbodyMonthly.appendChild(tr);
  
        const th = document.createElement("th");
        th.setAttribute("scope", "row");
        th.appendChild(document.createTextNode(expense.date));
  
        const td1 = document.createElement("td");
        td1.appendChild(document.createTextNode(expense.category));
  
        const td2 = document.createElement("td");
        td2.appendChild(document.createTextNode(expense.description));
  
        const td3 = document.createElement("td");
        td3.appendChild(document.createTextNode(expense.amount));
  
        tr.appendChild(th);
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
      });
  
      const tr = document.createElement("tr");
      tr.setAttribute("class", "trStyle");
      tfootMonthly.innerHTML = "";
      tfootMonthly.appendChild(tr);
  
      const td1 = document.createElement("td");
      const td2 = document.createElement("td");
      const td3 = document.createElement("td");
      const td4 = document.createElement("td");
  
      td3.setAttribute("id", "monthlyTotal");
      td4.setAttribute("id", "monthlyTotalAmount");
      td3.appendChild(document.createTextNode("Total"));
      td4.appendChild(document.createTextNode(totalAmount));
  
      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
      tr.appendChild(td4);
    } catch (error) {
      console.log(error);
      tbodyMonthly.innerHTML = "<tr><td colspan='4'>An error occurred. Please try again later.</td></tr>";
    }
  }
  
//Showing the income and savings
async function getCreditExpenseData() {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:3000/credit/creditExpense", {
      headers: { Authorization: token },
    });
    const totalIncomeSum = res.data.totalIncomeSum;
    const totalSavingsSum = res.data.totalSavingsSum;

    // Update the elements with the new values
    const totalIncomeElement = document.getElementById("income");
    const totalSavingsElement = document.getElementById("saving");

    if (totalIncomeElement && totalSavingsElement) {
      totalIncomeElement.innerText = `Income: Rs. ${totalIncomeSum}`;
      totalSavingsElement.innerText = `Savings: Rs. ${totalSavingsSum}`;
    }
  } catch (err) {
    console.error("Error getting credit expense data:", err);
  }
}

document.addEventListener("DOMContentLoaded", getCreditExpenseData);

dateShowBtn.addEventListener("click", getDailyReport);

weeklyForm.addEventListener("submit", getFlexiReport);

monthShowBtn.addEventListener("click", getMonthlyReport);

async function downloadReport() {
  try {
    const token = localStorage.getItem("token");
    const premiumUserRes = await axios.get("http://localhost:3000/user/isPremiumUser", {
      headers: { Authorization: token },
    });

    if (premiumUserRes.data.isPremiumUser) {
      const downloadRes = await axios.get("http://localhost:3000/expense/downloadReport", {
        headers: { Authorization: token },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([downloadRes.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "ExpenseReport.csv");
      document.body.appendChild(link);
      link.click();
      link.remove(); // Remove the link after download
    } else {
      alert("This feature is only available for premium members.");
    }
  } catch (err) {
    console.error("Error downloading report:", err);
  }
}

downloadReportBtn.addEventListener("click", downloadReport);

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



