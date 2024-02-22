/* /public/js/reports.js */

const dateInput = document.getElementById("date");
const dateShowBtn = document.getElementById("dateShowBtn");
const tbodyDaily = document.getElementById("tbodyDailyId"); // Updated variable name
const tfootDaily = document.getElementById("tfootDailyId");

async function getDailyReport(e) {
    try {
      e.preventDefault();
      const token = localStorage.getItem("token");
      const date = new Date(dateInput.value);
      const formattedDate = date.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
  
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
        tbodyDaily.innerHTML = "<tr><td colspan='4'>No expenses found for this date</td></tr>";
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
      tbodyDaily.innerHTML = "<tr><td colspan='4'>An error occurred. Please try again later.</td></tr>";
    }
  }

  dateShowBtn.addEventListener("click", getDailyReport);
