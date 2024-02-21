/* /public/js/forgetPassword.js */

document.addEventListener("DOMContentLoaded", function() {
  const resetPasswordLinkBtn = document.getElementById("resetPasswordLinkBtn");

  async function sendMail() {
    try {
      const email = document.getElementById("email").value;
      const res = await axios.post("http://localhost:3000/password/sendMail", {
        email: email,
      });
      console.log('Email from forgot password.js :', email);
      alert(res.data.message);
      window.location.href = "/";
    } catch (error) {
      console.log(error);
      alert(error.response.data.message);
      window.location.reload();
    }
  }

  if (resetPasswordLinkBtn) {
    resetPasswordLinkBtn.addEventListener("click", sendMail);
  }
});
