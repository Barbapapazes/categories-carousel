import './style.css'

const slider = document.querySelector('#slider')
const sliderTransitionClass = ['transform', 'duration-300']
const cards = document.querySelectorAll('#slider li')
const arrowLeft = document.querySelector('#arrow-left')
const arrowRight = document.querySelector('#arrow-right')
const dataset = []

let isMoving = false
let totalMovement = 0 // Is positive if moving to the right
let count = 0 // Use as a memory to record previous offset

/**
 * Translater cards on X using a movement
 *
 * @param {HTMLElement} element
 * @param {number} total Movement total
 * @param {number} movement Relative movement to the previous
 *
 * @return {number}
 */
function translateCards(element, total, movement) {
  total += movement
  element.style.transform = `translateX(${-1 * total}px)`
  return total
}

/**
 * Translate cards on X to the total
 *
 * @param {HTMLElement} element
 * @param {array} transitionClass
 * @param {number} total
 *
 * @return {number}
 */
function resetSlider(element, transitionClass, total = 0) {
  element.classList.add(...transitionClass)
  translateCards(element, total, 0)
  return total
}

/**
 * Translate to the max right
 *
 * @param {DOMRect} element - The element to place
 */
function clipToRight(element) {
  // Right
  const finalOffset = totalMovement - (window.innerWidth - element.right) + 16
  totalMovement = resetSlider(
    slider,
    sliderTransitionClass,
    // Fixed last card to the right
    finalOffset
  )

  arrowRight.disabled = true
}

/**
 * Translate to the max left
 *
 * @param {HTMLElement} element - The element to translate
 */
function clipToLeft(element) {
  // Fix to the left
  totalMovement = resetSlider(element, sliderTransitionClass)

  arrowLeft.disabled = true
}

// Create a dataset to move cards
cards.forEach((card, index) => {
  const margin = index * 24
  const total = count + margin
  dataset.push({
    width: card.offsetWidth,
    height: card.offsetHeight,
    totalWidth: count,
    totalMargin: margin,
    // Get the next card if 50% if out of the viewport
    totalMiddle: total + 0.5 * card.offsetWidth,
  })
  count += card.offsetWidth
})

// Arrow
arrowRight.addEventListener('click', () => {
  const indexItem = dataset.findIndex(
    ({ totalWidth, totalMargin }) => totalMovement <= totalMargin + totalWidth
  )
  const item = dataset[indexItem + 1]

  const lastCard = cards[cards.length - 1]
  const leftLastCard = lastCard.getBoundingClientRect().left
  const widthLastCard = lastCard.getBoundingClientRect().width

  // Last card can't unplug from the right
  if (leftLastCard < window.innerWidth + widthLastCard) {
    const lastMovement = leftLastCard - window.innerWidth + widthLastCard + 16

    slider.classList.add(...sliderTransitionClass)
    totalMovement = translateCards(slider, totalMovement, lastMovement)

    if (arrowRight === document.activeElement) {
      arrowLeft.focus()
    }
    arrowRight.disabled = true
    arrowLeft.disabled = false
    return
  }

  slider.classList.add(...sliderTransitionClass)
  totalMovement = translateCards(slider, item.totalMargin + item.totalWidth, 0)

  if (totalMovement >= 0) {
    arrowLeft.disabled = false
  }
})

// Arrow
arrowLeft.addEventListener('click', () => {
  const indexItem = dataset.findIndex(
    ({ totalWidth, totalMargin }) => totalMovement <= totalMargin + totalWidth
  )

  const item = dataset[indexItem - 1]
  slider.classList.add(...sliderTransitionClass)
  totalMovement = translateCards(slider, item.totalMargin + item.totalWidth, 0)

  if (totalMovement <= 0) {
    if (arrowLeft === document.activeElement) {
      arrowRight.focus()
    }
    arrowLeft.disabled = true
    arrowRight.disabled = false
    return
  } else {
    arrowRight.disabled = false
  }
})

// Mouse
slider.addEventListener('mousedown', () => {
  isMoving = true
  // Remove transition class to avoid animation on mousemove
  slider.classList.remove(...sliderTransitionClass)
})

// Mouse
slider.addEventListener('mousemove', (e) => {
  if (isMoving) {
    const { movementX } = e
    totalMovement = translateCards(slider, totalMovement, -1 * movementX)
  }
})

// Mouse
slider.addEventListener('mouseup', () => {
  isMoving = false

  const lastCard = cards[cards.length - 1]
  const posLastCard = lastCard.getBoundingClientRect()
  const windowSize = window.innerWidth

  if (posLastCard.right < windowSize) {
    clipToRight(posLastCard)
  } else if (totalMovement < 0) {
    clipToLeft(slider)
  } else {
    // Follow

    // Find the nearest card
    const item = dataset.find(({ totalMiddle }) => totalMovement < totalMiddle)

    slider.classList.add(...sliderTransitionClass)
    totalMovement = translateCards(slider, item.totalWidth + item.totalMargin, 0)

    arrowLeft.disabled = false
    arrowRight.disabled = false
  }
})

// Mouse
document.addEventListener('mouseout', (e) => {
  const from = e.relatedTarget || e.toElement
  // Trigger only if mouseout from the page
  if (!from || from.nodeName === 'HTML') {
    isMoving = false

    const lastCard = cards[cards.length - 1]
    const posLastCard = lastCard.getBoundingClientRect()
    const windowSize = window.innerWidth

    if (posLastCard.right < windowSize) {
      clipToRight(posLastCard)
    } else if (totalMovement < 0) {
      clipToLeft(slider)
    } else {
      // Find the nearest card
      const item = dataset.find(({ totalMiddle }) => totalMovement < totalMiddle)

      slider.classList.add(...sliderTransitionClass)
      totalMovement = translateCards(slider, item.totalWidth + item.totalMargin, 0)

      arrowLeft.disabled = false
      arrowRight.disabled = false
    }
  }
})

// Touch
let previousTouchX = 0
slider.addEventListener('touchstart', (e) => {
  isMoving = true
  previousTouchX = e.touches[0].clientX
  // Remove transition class to avoid animation on touchmove
  slider.classList.remove(...sliderTransitionClass)
})

// Touch
slider.addEventListener('touchmove', (e) => {
  e.preventDefault()
  if (isMoving) {
    const startX = previousTouchX
    const touch = e.touches[0]
    const movementX = touch.clientX - startX

    totalMovement = translateCards(slider, totalMovement, -1 * movementX)

    previousTouchX = touch.clientX
  }
})

// Touch
slider.addEventListener('touchend', () => {
  isMoving = false

  const lastCard = cards[cards.length - 1]
  const posLastCard = lastCard.getBoundingClientRect()
  const windowSize = window.innerWidth

  if (posLastCard.right < windowSize) {
    clipToRight(posLastCard)
  } else if (totalMovement < 0) {
    clipToLeft(slider)
  } else {
    // Follow

    // Find the nearest card
    const item = dataset.find(({ totalMiddle }) => totalMovement < totalMiddle)

    slider.classList.add(...sliderTransitionClass)
    totalMovement = translateCards(slider, item.totalWidth + item.totalMargin, 0)

    arrowLeft.disabled = false
    arrowRight.disabled = false
  }
})
