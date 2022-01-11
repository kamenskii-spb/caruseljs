import "regenerator-runtime/runtime"
import caruseljs from "./carusel-js"

import "./styles.css";
(async () => {
  const jp = await fetch("https://jsonplaceholder.typicode.com/photos")
  const responce = await jp.json()
  const images = responce.slice(4994)
  const data = images
  //////see

  const $seewrap = document.querySelector(".see")

  for (let d of data) {
    $seewrap.insertAdjacentHTML(
      "beforeend",
      `
     <img
     width="50"
     height="50"   
     src="${d.thumbnailUrl}" alt="${d.title}" />
    `
    )
  }

  /////see end


  const $carusel = document.querySelector(".caruseljs")
  const carusel = caruseljs($carusel, data)


})();


