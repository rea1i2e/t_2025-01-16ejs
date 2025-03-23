/* ------------------------------
ドロワーメニュー
------------------------------ */
const menuButton = document.getElementById("js-menu");
const drawer = document.getElementById("js-drawer");
// const drawerMenu = document.getElementById("js-drawer");
// const drawerMenuNav = document.getElementById("js-drawer-nav");
const drawerMenu = document.getElementById("js-drawer-menu");
const drawerAnchorLinks = drawerMenu.querySelectorAll('a[href*="#"]');

// ドロワーメニューを展開する処理
function openDrawer() {
  menuButton.setAttribute("aria-expanded", "true");
  drawer.setAttribute("aria-hidden", "false");
  document.documentElement.style.overflow = "hidden";
  document.body.style.overflow = "hidden";
}

// ドロワーメニューを閉じる処理
function closeDrawer() {
  menuButton.setAttribute("aria-expanded", "false");
  drawer.setAttribute("aria-hidden", "true");
  document.documentElement.style.overflow = "";
  document.body.style.overflow = "";
}

// ハンバーガーメニューをクリックした時の処理
menuButton.addEventListener("click", function () {
  if (menuButton.getAttribute("aria-expanded") === "true") {
    closeDrawer();
  } else {
    openDrawer();
  }
});

// ページ内リンクをクリックしたとき、ドロワーメニューを閉じる
drawerAnchorLinks.forEach(function (link) {
  link.addEventListener("click", function () {
    closeDrawer();
  });
});

// ドロワーメニュー以外の要素をクリックしたとき、ドロワーメニューを閉じる
drawer.addEventListener("click", function (event) {
  if (
    drawerMenu && drawerMenu.contains(event.target) ||
    menuButton && menuButton.contains(event.target)
  ) return;
  
  closeDrawer();
});

// ブレイクポイントを超えたとき、ドロワーメニューを閉じる
window.addEventListener("resize", function () {
  if (window.innerWidth >= 768) {
    closeDrawer();
  }
});


/* ------------------------------
トップ・スライダー
------------------------------ */
const mvSplide = document.getElementById("js-mv-splide");
if (mvSplide) {
  new Splide("#js-mv-splide", {
    type: "fade",
    rewind: true,
    autoplay: true,
    perPage: 1,
    perMove: 1,
    gap: 0,
    pagination: false,
    arrows: false,
  }).mount();
}


/* ------------------------------
モーダル（複数）
------------------------------ */
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

