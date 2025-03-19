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

/* ------------------------------
YouTube再生モーダル
------------------------------ */
document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  // p-movie-modalのclass名がつく要素を全取得
  document.querySelectorAll(".p-movie-modal").forEach((imgTag) => {
    imgTag.addEventListener("click", function () {
      openModal(imgTag.getAttribute("data-video-id"));
    });
  });

  // モーダルの要素を作成
  let modal = document.createElement("div");
  modal.id = "modal";
  modal.className = "p-movie-modal__modal";

  // モーダルの要素をクリックしたら、モーダルを閉じる
  modal.addEventListener("click", function (event) {
    if (event.target === modal) {
      closeModal();
    }
  });

  // p-movie-modal__modal-contentの要素を作成
  let modalContent = document.createElement("div");
  modalContent.className = "p-movie-modal__modal-content";

  // iframeのYouTube要素を作成
  let videoPlayer = document.createElement("iframe");
  videoPlayer.id = "videoPlayer";
  videoPlayer.width = "560";
  videoPlayer.height = "315";
  videoPlayer.frameBorder = "0";
  videoPlayer.allow =
    "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture";
  videoPlayer.setAttribute("allowfullscreen", "");

  // 閉じるボタンを作成
  let closeBtn = document.createElement("button");
  closeBtn.className = "p-movie-modal__close";
  closeBtn.addEventListener("click", closeModal);

  // モーダルの要素を追加
  modalContent.appendChild(videoPlayer);
  modalContent.appendChild(closeBtn);
  modal.appendChild(modalContent);
  body.appendChild(modal);
});

// モーダル関数
function openModal(videoId) {
  let modal = document.getElementById("modal");
  let videoPlayer = document.getElementById("videoPlayer");

  if (!modal || !videoPlayer) return;

  videoPlayer.src =
    "https://www.youtube.com/embed/" + videoId + "?autoplay=1&rel=0";

  modal.style.display = "flex";
  modal.style.animation = "fadeIn 0.3s forwards";
  document.body.style.overflow = "hidden";
}

// モーダルを閉じる関数を作成
function closeModal() {
  let modal = document.getElementById("modal");
  let videoPlayer = document.getElementById("videoPlayer");

  if (!modal || !videoPlayer) return;

  modal.style.animation = "fadeOut 0.3s forwards";

  setTimeout(() => {
    videoPlayer.src = "";
    modal.style.display = "none";
  }, 700);

  document.body.style.overflow = "visible";
}