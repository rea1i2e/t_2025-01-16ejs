// トップスライダー関連の処理
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