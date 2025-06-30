// モーダル関連の処理
const modalBtns = document.querySelectorAll("[data-target]"); 
modalBtns.forEach(function (btn) {
  let touchStartX = 0;
  let touchStartY = 0;
  let touchStartTime = 0;
  
  // クリックイベントの処理
  const openModal = function() {
    var modal = btn.getAttribute("data-target");
    document.getElementById(modal).classList.add("is-show");
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
  };
  
  // タッチ開始位置を記録
  btn.addEventListener('touchstart', function(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    touchStartTime = Date.now();
  });
  
  // デスクトップおよびタッチデバイス用のクリックイベント
  btn.addEventListener('click', function(e) {
    // タッチデバイスでのタップ後のクリックイベントを防ぐためのフラグ
    let touchHandled = false;

    // タッチイベントが処理された場合はクリックを無視
    if (!touchHandled) {
      openModal();
    }
  });
  
  // タッチ終了時に移動距離をチェック
  btn.addEventListener('touchend', function(e) {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const touchEndTime = Date.now();
    
    // 移動距離を計算
    const deltaX = Math.abs(touchEndX - touchStartX);
    const deltaY = Math.abs(touchEndY - touchStartY);
    const deltaTime = touchEndTime - touchStartTime;
    
    // 移動距離が10px未満かつタッチ時間が300ms未満の場合のみタップと判定
    if (deltaX < 10 && deltaY < 10 && deltaTime < 300) {
      e.preventDefault();
      openModal();
      touchHandled = true; // タッチイベントが処理されたことを記録
    }
  });
});

// 1つ目のモーダルを常時表示 // test
const firstModal = document.querySelector("[data-modal]");
if (firstModal) {
  firstModal.classList.add("is-show");
  document.documentElement.style.overflow = "hidden";
  document.body.style.overflow = "hidden";
}

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