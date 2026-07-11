const form = document.querySelector("form");

form.addEventListener("submit", function(event) {
  event.preventDefault();

  const enteredCode = document.getElementById("studentCode").value.trim();
  const enteredPassword = document.getElementById("password").value;

  db.collection("students").doc(enteredCode).get().then(function(docSnap) {
    if (docSnap.exists) {
      // مهم: doc.data() بترجع بيانات الدكيومنت بس من غير الـ ID بتاعه
      // فلازم نضيف الكود (ID) يدويًا عشان نستخدمه صح في باقي الصفحات (home/store/الخ)
      checkPassword(Object.assign({}, docSnap.data(), { code: docSnap.id }), enteredPassword);
    } else {
      db.collection("students").where("name", "==", enteredCode).get().then(function(querySnap) {
        if (!querySnap.empty) {
          const matchedDoc = querySnap.docs[0];
          checkPassword(Object.assign({}, matchedDoc.data(), { code: matchedDoc.id }), enteredPassword);
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
