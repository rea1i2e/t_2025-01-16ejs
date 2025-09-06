import '@splidejs/splide/dist/css/splide-core.min.css';
import { Splide } from '@splidejs/splide';
import { AutoScroll } from '@splidejs/splide-extension-auto-scroll';

/**
 * トップページ メインビジュアル
 * フェードで切り替え
 */
const topMvSplide = document.getElementById("js-top-mv-splide");
if (topMvSplide) {
  new Splide(topMvSplide, {
    type: "fade",
    rewind: true,
    autoplay: true,
    speed: 1000,
    pauseOnHover: false, // カーソルが乗ってもスクロールを停止させない
    perPage: 1,
    perMove: 1,
    gap: 0,
    pagination: false,
    arrows: false,
  }).mount();
}

/**
 * 無限ループスライダー
 * @codex https://splidejs.com/extensions/auto-scroll/
 */
const loopSplideOptions = {
  arrows: false, // 矢印ボタンを非表示
  pagination: false, // ページネーションを非表示
  type: "loop", // ループさせる
  autoWidth: true, // cssで幅指定
  // gap: "calc(24 / 16 * 1rem)", // スライド間の余白
  drag: "free", // フリードラッグモード
  drag: true, // スマホで動作が不安定なので、実機確認必須
  autoScroll: {
    speed: 0.5, // スクロール速度
    pauseOnHover: false, // カーソルが乗ってもスクロールを停止させない
  },
};

const loopSliderElement = document.querySelector("#js-loop-slider");
if (loopSliderElement) {
  const loopSplide = new Splide(loopSliderElement, loopSplideOptions);
  loopSplide.mount({ AutoScroll });
}