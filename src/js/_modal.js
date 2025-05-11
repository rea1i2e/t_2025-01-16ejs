// モーダル関連の処理
const modalBtns = document.querySelectorAll("[data-target]"); 
modalBtns.forEach(function (btn) {
  btn.onclick = function () {
    var modal = btn.getAttribute("data-target");
    document.getElementById(modal).classList.add("is-show");
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
  };
});

const closeBtns = document.querySelectorAll("[data-modal-close]");
closeBtns.forEach(function (btn) {
  btn.onclick = function () {
    var modal = btn.closest("[data-modal]");
    modal.classList.remove("is-show");
    if (document.querySelectorAll(".is-show").length === 0) {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }
  };
});

window.onclick = function (event) {
  if (event.target.getAttribute("data-modal") !== null) {
    event.target.classList.remove("is-show");
    if (document.querySelectorAll(".is-show").length === 0) {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }
  }
}; 