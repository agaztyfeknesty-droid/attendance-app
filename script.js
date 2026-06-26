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
// طلبات المتجر لايف
db.collection("orders").where("status", "==", "pending").onSnapshot(function(snapshot) {
  const container = document.getElementById("ordersContainer");
  const counter = document.getElementById("ordersCounter");
  counter.textContent = snapshot.size + " طلب";

  if (snapshot.empty) {
    container.innerHTML = '<p style="text-align:center; color:#94a3b8; font-size:13px;">مفيش طلبات جديدة ✅</p>';
    return;
  }

  container.innerHTML = "";
  snapshot.forEach(function(doc) {
    const order = doc.data();
    const div = document.createElement("div");
    div.style.cssText = "background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.08); border-radius:14px; padding:12px; margin-bottom:10px;";
    div.innerHTML =
      "<div style='display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;'>" +
      "<span style='font-size:20px;'>" + (order.itemEmoji || "🎁") + "</span>" +
      "<span style='background:" + (order.isLimited ? "#7c3aed" : "#065f46") + "; color:white; padding:2px 8px; border-radius:10px; font-size:10px;'>" +
      (order.isLimited ? "Limited" : "Unlimited") + "</span>" +
      "</div>" +
      "<p style='color:white; font-weight:bold; font-size:14px; margin:0 0 3px 0;'>" + order.itemName + "</p>" +
      "<p style='color:#00f2fe; font-size:12px; margin:0 0 3px 0;'>👤 " + order.studentName + " (" + order.studentCode + ")</p>" +
      "<p style='color:#94a3b8; font-size:11px; margin:0 0 10px 0;'>⏰ " + order.timestamp + "</p>" +
      "<button onclick='deliverOrder(\"" + doc.id + "\")' style='width:100%; background:#10b981; color:white; border:none; padding:9px; border-radius:10px; font-family:Cairo; font-size:13px; font-weight:bold; cursor:pointer;'>✅ تم التسليم</button>";
    container.appendChild(div);
  });
});

function deliverOrder(orderId) {
  db.collection("orders").doc(orderId).update({ status: "delivered" }).then(function() {
    alert("✅ تم تسليم الهدية بنجاح!");
  });
}