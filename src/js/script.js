/* ------------------------------
ドロワーメニュー
------------------------------ */
const menuButton = document.getElementById("js-menu");
const drawerMenu = document.getElementById("js-drawer");
const anchorLinks = document.querySelectorAll('a[href^="#"]');
const body = document.body;
const html = document.documentElement;

// ドロワーメニューを展開する処理
function openDrawerMenu() {
  menuButton.setAttribute("aria-expanded", "true");
  drawerMenu.setAttribute("aria-hidden", "false");
  body.classList.add("is-drawerActive");
  body.style.overflow = "hidden";
  html.style.overflow = "hidden";
}

// ドロワーメニューを閉じる処理
function closeDrawerMenu() {
  menuButton.setAttribute("aria-expanded", "false");
  drawerMenu.setAttribute("aria-hidden", "true");
  body.classList.remove("is-drawerActive");
  body.style.overflow = "visible";
  html.style.overflow = "visible";
}

// ハンバーガーメニューをクリックした時の処理
menuButton.addEventListener("click", function () {
  if (menuButton.getAttribute("aria-expanded") === "true") {
    closeDrawerMenu();
  } else {
    openDrawerMenu();
  }
});

// ページ内リンクをクリックしたとき、ドロワーメニューを閉じる
anchorLinks.forEach(function (link) {
  link.addEventListener("click", function () {
    closeDrawerMenu();
  });
});

// ドロワーメニュー以外の要素をクリックしたとき、ドロワーメニューを閉じる
document.addEventListener("click", function (event) {
  if (
    (!drawerMenu || (drawerMenu && !drawerMenu.contains(event.target))) &&
    (!menuButton || (menuButton && !menuButton.contains(event.target)))
  ) {
    closeDrawerMenu();
  }
});

// ブレイクポイントを超えたとき、ドロワーメニューを閉じる
window.addEventListener("resize", function () {
  if (window.innerWidth >= 768) {
    closeDrawerMenu();
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
