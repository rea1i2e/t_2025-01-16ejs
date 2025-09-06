// ドロワーメニュー関連の処理
const menuButton = document.getElementById("js-menu");
const menuButtonRight = window.getComputedStyle(menuButton).right;
const drawer = document.getElementById("js-drawer");
const drawerMenu = document.getElementById("js-drawer-menu");
const drawerAnchorLinks = drawerMenu.querySelectorAll('a[href*="#"]');

// ドロワーメニューを展開する処理
function openDrawer() {
  const scrollbarWidth =
    window.innerWidth - document.documentElement.clientWidth;
  menuButton.setAttribute("aria-expanded", "true");
  drawer.setAttribute("aria-hidden", "false");
  document.documentElement.style.overflow = "hidden";
  document.body.style.overflow = "hidden";
  document.body.style.paddingRight = scrollbarWidth + "px";
  menuButton.style.right = parseFloat(menuButtonRight) + scrollbarWidth + "px";
}

// ドロワーメニューを閉じる処理
function closeDrawer() {
  menuButton.setAttribute("aria-expanded", "false");
  drawer.setAttribute("aria-hidden", "true");
  document.documentElement.style.overflow = "";
  document.body.style.overflow = "";
  document.body.style.paddingRight = "";
  menuButton.style.right = parseFloat(menuButtonRight) + "px";
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
    (drawerMenu && drawerMenu.contains(event.target)) ||
    (menuButton && menuButton.contains(event.target))
  )
    return;

  closeDrawer();
});

// ブレイクポイントを超えたとき、ドロワーメニューを閉じる
window.addEventListener("resize", function () {
  if (window.innerWidth >= 768) {
    closeDrawer();
  }
});
