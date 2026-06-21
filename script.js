const form = document.querySelector("form");

form.addEventListener("submit", function(event) {
  event.preventDefault();

  const enteredCode = document.getElementById("studentCode").value;
  const enteredPassword = document.getElementById("password").value;

  db.collection("students").doc(enteredCode).get().then(function(docSnap) {
    if (docSnap.exists) {
      checkPassword(docSnap.data(), enteredPassword);
    } else {
      db.collection("students").where("name", "==", enteredCode).get().then(function(querySnap) {
        if (!querySnap.empty) {
          checkPassword(querySnap.docs[0].data(), enteredPassword);
        } else {
          alert("الكود أو الاسم غير موجود ❌");
        }
      });
    }
  });
});

function checkPassword(student, enteredPassword) {
  if (student.password === enteredPassword) {
    // نحفظ بيانات الطالب في "دفتر الملاحظات" بتاع المتصفح
    localStorage.setItem("loggedInStudent", JSON.stringify(student));
    // ونوديه للصفحة الرئيسية
    window.location.href = "home.html";
  } else {
    alert("كلمة المرور غلط ❌");
  }
}