const caruseljs = (carusel, data = [], options = {}) => {

  if (!carusel && !carusel.nodeName) return

  addArrow(carusel)

  const itemsWrap = document.createElement("div")
  itemsWrap.classList.add("caruseljs-items")
  carusel.insertAdjacentElement("afterbegin", itemsWrap)

  options = {
    width: options.width || 180,
    height: options.height || 180,
    countItems: options.countItems || 300,
    animationAdd: options.animationAdd || "slideDown",
    animationTime: options.animationTime || 400,
  }

  let runningAnimation = false
  let newItemIdx = 0
  let isMobile = false

  

  const $arrows = carusel.querySelectorAll(".caruseljs-arrow")

  const onMouseEnter = () => {
    showArrows($arrows)
  }
  const onMouseLeave = () => {
    for (let $arrow of $arrows) {
      $arrow.style.opacity = 0
    }
  }

  create(options, data, carusel, itemsWrap)

  /// arrows

  if (
    /Android|webOS|iPhone|iPad|Mac|Macintosh|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  ) {
    isMobile = true
    showArrows($arrows)
  } else {
    carusel.addEventListener("mouseenter", onMouseEnter)
    carusel.addEventListener("mouseleave", onMouseLeave)
  }
  function showArrows($arrows) {
    for (let $arrow of $arrows) {
      $arrow.style.opacity = 1
    }
  }
  /// arrows end

  const onClickCarusel = (e) =>  {
    if (runningAnimation) return

    if (e.target.dataset.arrow === "left") {
 
      removeItem(e.target.dataset.arrow)
    } else if (e.target.dataset.arrow === "right") {

      removeItem(e.target.dataset.arrow)
    }
  }

  carusel.addEventListener("click", onClickCarusel)

  const onResizeWindow = () => {
    clearItems()
    create(options, data, carusel, itemsWrap)
  }

  window.addEventListener("resize",  onResizeWindow)

  function removeItem(pos) {
    runningAnimation = true
    const countItems = getCountItems(options, carusel)
    const distance = getDistance(countItems, options, carusel)

    const $items = itemsWrap.querySelectorAll(".caruseljs-item")
    let $removeItem = pos === "right" ? $items[countItems - 1] : $items[0]

    // animationSlideFolding($removeItem, options, distance, pos);
    animationSlideUp($removeItem, options, distance, pos)
    const removeItemId = $removeItem.id
    setTimeout(() => {
      movingAll(options, distance, $items, pos)
      $removeItem.remove()
    }, options.animationTime)

    const maxIdx = data.length - 1

    setTimeout(() => {
      const removeIdx = data.findIndex((d) => d.id === +removeItemId)

      if (pos === "right") {
        newItemIdx = removeIdx - (countItems - 1) - 1
        if (Math.sign(newItemIdx) === -1) {
          newItemIdx = data.length - newItemIdx * -1
        }
      } else {
        newItemIdx = removeIdx + (countItems - 1) + 1
        if (newItemIdx > maxIdx) {
          newItemIdx = (maxIdx - newItemIdx) * -1 - 1
        }
      }
      const position = {
        left: pos === "right" ? 0 : carusel.offsetWidth - options.width,
      }
      addItem(
        options,
        itemsWrap,
        data[newItemIdx],
        position,
        pos,
        options.animationAdd
      )

      runningAnimation = false
    }, options.animationTime * 2)
  }


  const remove = () => {
    carusel.removeEventListener("mouseenter", onMouseEnter)
    carusel.removeEventListener("mouseleave", onMouseLeave)
    carusel.removeEventListener("click", onClickCarusel)
    window.removeEventListener("resize", onResizeWindow)
    carusel.remove()
  }

  return { remove }

}



//animatioms
function animationSlideFolding($item, options, distance, move = 'left') {  
 const $itemWrap = $item.firstChild
  $itemWrap.style.transform = `translateX(${move === 'right' ? '' : '-'}${options.width + distance }px)`;
}

function animationSlideUp($item, options, distance, move = 'left') {  
    
    $item.classList.add('slideUp');
   }

//animations end

function addArrow(carusel) {
  carusel.insertAdjacentHTML(
    "afterbegin",
    '<div data-arrow="left" class="caruseljs-arrow caruseljs-arrow-left">&#8249;</div>'
  );
  carusel.insertAdjacentHTML(
    "beforeend",
    '<div data-arrow="right" class="caruseljs-arrow caruseljs-arrow-right">&#8250;</div>'
  );
}

function create(options, data, carusel, itemsWrap) {

 

  let step = 0;
  const countItems =  getCountItems(options, carusel)

  data = data.slice(0 + step, countItems );


  let position = {
    left: 0,
  };

  for (let i = 0; i < data.length; i++) {
    addItem(options, itemsWrap, data[i], position);

    if (data.length - 2 === i) {
      position.left = carusel.offsetWidth - options.width;
    } else {
      position.left += options.width + getDistance(countItems, options, carusel);
    }
  }
}

function addItem(options, itemsWrap, item, position, posAdd = 'left' , animation = false ) {
  const $item = createDomItem(options, item);
  $item.style.left = position.left + "px";
 const pos = posAdd === 'left' ? "beforeend" : "afterbegin"
 if(animation){
    $item.classList.add(animation)
 }
  
  itemsWrap.insertAdjacentElement(pos, $item);
  return $item;
}

function createDomItem(options, item) {
  
  const $item = document.createElement("div");
  $item.setAttribute('id', item.id)
  $item.classList.add("caruseljs-item");
  const $itemContent = document.createElement("div");
  $itemContent.classList.add("caruseljs-item__content");
  $item.insertAdjacentElement("beforeend", $itemContent);

  $itemContent.insertAdjacentHTML(
    "afterbegin",
    `
     <img
     width="${options.width}"
     height="${options.height}"   
     src="${item.thumbnailUrl}" alt="${item.title}" />
    `
  );

  return $item;
}

function clearItems() {
  const carusel = document.querySelector(".caruseljs-items");
  if (!carusel) return false;
  carusel.innerHTML = "";
}


function getDistance(countItems, options, carusel){
    const sizeAllItems = countItems * options.width;
    const emptyZone = carusel.offsetWidth - sizeAllItems;
    const distance = emptyZone / (countItems - 1);
       return distance
  }

  
  function getCountItems(options,carusel ){
    let countItems = options.countItems;
    // console.log('(options.width * options.countItems)', (options.width * options.countItems))
    // console.log('carusel.offsetWidth', carusel.offsetWidth)
    if ((options.width * options.countItems) > carusel.offsetWidth) {
       
      countItems = Math.floor(carusel.offsetWidth / options.width);
    }
    return countItems
  }

  function movingAll(options,distance,$items, pos = 'left'){
    for (let item of $items) {
        const position = item.style.left.replace("px", "");
       
        if(pos === 'right'){
        item.style.left = +position + (options.width + distance) +"px";
        } else {
            item.style.left = +position - (options.width + distance) +"px";
        }
      }
  }









export default caruseljs



