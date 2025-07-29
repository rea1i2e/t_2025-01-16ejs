console.log("dialog.jsからこんにちは！");

const initializeModal = (modal) => {
  // モーダル要素が見つからない場合はエラーをログに記録して早期リターン
  if (!modal) {
    console.error("Element required for initializeModal is not found.");
    return;
  }

  // モーダルを開くトリガーと閉じるトリガーを取得
  const openTriggers = document.querySelectorAll(
    `[data-modal-open="${modal.id}"]`
  );
  const closeTriggers = modal.querySelectorAll("[data-modal-close]");

  // トリガーが見つからない場合はエラーをログに記録して早期リターン
  if (openTriggers.length === 0 || closeTriggers.length === 0) {
    console.error("Elements required for modal trigger are not found.");
    return;
  }

  // 開くトリガーにイベントリスナーを追加
  openTriggers.forEach((trigger) => {
    trigger.addEventListener(
      "click",
      (event) => handleOpenTriggerClick(event, modal, trigger),
      false
    );
    trigger.addEventListener("mousedown", handleTriggerFocus, false);
    trigger.addEventListener("keydown", handleTriggerFocus, false);
  });

  // 閉じるトリガーにイベントリスナーを追加
  closeTriggers.forEach((trigger) => {
    trigger.addEventListener(
      "click",
      (event) => handleCloseTriggerClick(event, modal),
      false
    );
  });
};

// モーダルのアニメーションが完了するのを待つ
const waitModalAnimation = (modal) => {
  if (modal.getAnimations().length === 0) return Promise.resolve([]);
  return Promise.allSettled(
    [...modal.getAnimations()].map((animation) => animation.finished)
  );
};

const eventListenersMap = new Map();

// イベントリスナーの管理
const manageEventListeners = (modal, add) => {
  const backdropClickListener = (event) =>
    handleBackdropClick(event, modal);
  const keyDownListener = (event) => handleKeyDown(event, modal);

  if (add) {
    // イベントリスナーを追加
    modal.addEventListener("click", backdropClickListener, false);
    window.addEventListener("keydown", keyDownListener, false);
    eventListenersMap.set(modal, { backdropClickListener, keyDownListener });
  } else {
    // イベントリスナーを削除
    const listeners = eventListenersMap.get(modal);
    if (listeners) {
      modal.removeEventListener("click", listeners.backdropClickListener);
      window.removeEventListener("keydown", listeners.keyDownListener);
      eventListenersMap.delete(modal);
    }
  }
};

let currentOpenTrigger = null;

// トリガーのクリックイベントハンドラ
const handleOpenTriggerClick = (event, modal, trigger) => {
  event.preventDefault();
  currentOpenTrigger = trigger;
  openModal(modal);
};

const handleCloseTriggerClick = (event, modal) => {
  event.preventDefault();
  closeModal(modal);
};

// トリガーのフォーカスイベントハンドラ
const handleTriggerFocus = (event) => {
  if (event.type === "mousedown") {
    document.documentElement.setAttribute("data-mousedown", "true");
  }
  if (event.type === "keydown") {
    document.documentElement.removeAttribute("data-mousedown");
  }
};

// モーダルの背景クリックイベントハンドラ
const handleBackdropClick = (event, modal) => {
  if (event.target === modal) {
    closeModal(modal);
  }
};

// キーダウンイベントハンドラ
const handleKeyDown = (event, modal) => {
  document.documentElement.removeAttribute("data-mousedown");
  if (event.key === "Escape") {
    event.preventDefault();
    closeModal(modal);
  }
};

let isTransitioning = false;

// モーダルを開く
const openModal = (modal) => {
  if (isTransitioning) return;

  isTransitioning = true;
  modal.showModal();
  backfaceFixed(true);
  manageEventListeners(modal, true);

  requestAnimationFrame(async () => {
    modal.setAttribute("data-active", "true");
    await waitModalAnimation(modal);
    isTransitioning = false;
  });
};

// モーダルを閉じる
const closeModal = async (modal) => {
  if (isTransitioning) return;

  isTransitioning = true;
  modal.setAttribute("data-active", "false");
  backfaceFixed(false);
  manageEventListeners(modal, false);

  await waitModalAnimation(modal);
  modal.close();

  if (currentOpenTrigger) {
    currentOpenTrigger.focus();
    currentOpenTrigger = null;
  }

  isTransitioning = false;
};

// ドキュメントの書字方向を取得し、縦書きかどうかを判定
const isVerticalWritingMode = () => {
  const writingMode = window.getComputedStyle(document.documentElement)
    .writingMode;
  return writingMode.includes("vertical");
};

// スクロールバーの幅を計算する
const getScrollBarSize = () => {
  const scrollBarXSize = window.innerHeight - document.body.clientHeight;
  const scrollBarYSize = window.innerWidth - document.body.clientWidth;
  return isVerticalWritingMode() ? scrollBarXSize : scrollBarYSize;
};

// スクロール位置を取得する
const getScrollPosition = (fixed) => {
  if (fixed) {
    return isVerticalWritingMode()
      ? document.scrollingElement?.scrollLeft ?? 0
      : document.scrollingElement?.scrollTop ?? 0;
  }
  return parseInt(document.body.style.insetBlockStart || "0", 10);
};

const applyStyles = (scrollPosition, apply) => {
  const styles = {
    blockSize: "100dvb",
    insetInlineStart: "0",
    position: "fixed",
    insetBlockStart: isVerticalWritingMode()
      ? `${scrollPosition}px`
      : `${scrollPosition * -1}px`,
    inlineSize: "100dvi"
  };
  Object.keys(styles).forEach((key) => {
    const styleKey = key;
    document.body.style[styleKey] = apply ? styles[styleKey] : "";
  });
};

// スクロール位置を元に戻す
const restorePosition = (scrollPosition) => {
  const options = {
    behavior: "instant",
    [isVerticalWritingMode() ? "left" : "top"]: isVerticalWritingMode()
      ? scrollPosition
      : scrollPosition * -1
  };
  window.scrollTo(options);
};

// 背面を固定する
const backfaceFixed = (fixed) => {
  const scrollBarWidth = getScrollBarSize();
  const scrollPosition = getScrollPosition(fixed);
  document.body.style.paddingInlineEnd = fixed ? `${scrollBarWidth}px` : "";
  applyStyles(scrollPosition, fixed);
  if (!fixed) {
    restorePosition(scrollPosition);
  }
};

const targets = document.querySelectorAll(".modal");

targets?.forEach((target) => {
  initializeModal(target);
});
