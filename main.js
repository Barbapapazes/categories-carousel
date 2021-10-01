import './style.css'

const slider = document.querySelector('#slider')
const sliderTransitionClass = ['transform', 'duration-300']
const cards = document.querySelectorAll('#slider li')
const arrowLeft = document.querySelector('#arrow-left')
const arrowRight = document.querySelector('#arrow-right')
const dataset = []

let isMoving = false
let totalMovement = 0
let count = 0

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
  element.style.transform = `translateX(-${total}px)`
  return total
}

/**
 * Translate cards on X to 0
 *
 * @param {HTMLElement} element
 * @param {array} transitionClass
 *
 * @return {number}
 */
function resetSlider(element, transitionClass, total = 0) {
  element.classList.add(...transitionClass)
  translateCards(element, total, 0)
  return total
}

cards.forEach((card, index) => {
  const offsetWidth = card.previousElementSibling ? card.previousElementSibling.offsetWidth : 0
  dataset.push({
    width: card.offsetWidth,
    height: card.offsetHeight,
    totalWidth: count,
    totalMargin: index * 24,
    // Get the next card if 20% if out of the viewport
    withPrevious: count + 0.2 * offsetWidth,
  })
  // Remove, because translate is negative, the margin
  count += card.offsetWidth
})

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

// slider.addEventListener('mousedown', () => {
//   isMoving = true
//   // Remove transition class to avoid animation on mousemove
//   slider.classList.remove(...sliderTransitionClass)
// })

// slider.addEventListener('mousemove', (e) => {
//   if (isMoving) {
//     const { movementX } = e
//     totalMovement = translateCards(slider, totalMovement, movementX)
//   }
// })

// slider.addEventListener('mouseup', (e) => {
//   isMoving = false

//   const lastCard = cards[cards.length - 1]
//   const windowSize = window.innerWidth
//   const posLastCard = lastCard.getBoundingClientRect().right
//   if (posLastCard < windowSize) {
//     totalMovement = resetSlider(
//       slider,
//       sliderTransitionClass,
//       // Get distance between last card right and window right
//       totalMovement + (windowSize - posLastCard) - 16
//     )
//   } else if (totalMovement > 0) {
//     totalMovement = resetSlider(slider, sliderTransitionClass)
//   } else {
//     const indexItem = dataset.findIndex(({ withPrevious }) => -totalMovement < withPrevious)
//     const item = dataset[indexItem]
//     const margin = 24 * indexItem
//     console.table(dataset)
//     console.log(item)
//     slider.classList.add(...sliderTransitionClass)
//     totalMovement = translateCards(slider, -item.total - margin, 0)
//   }
// })

// document.addEventListener('mouseout', (e) => {
//   const from = e.relatedTarget || e.toElement
//   // Trigger only if mouseout from the page
//   if (!from || from.nodeName === 'HTML') {
//     isMoving = false
//     const lastCard = cards[cards.length - 1]
//     const windowSize = window.innerWidth
//     const posLastCard = lastCard.getBoundingClientRect().right
//     if (posLastCard < windowSize) {
//       totalMovement = resetSlider(
//         slider,
//         sliderTransitionClass,
//         // Get distance between last card right and window right
//         totalMovement + (windowSize - posLastCard) - 16
//       )
//     } else if (totalMovement > 0) {
//       totalMovement = resetSlider(slider, sliderTransitionClass)
//     }
//   }
// })

// il faut faire la gestion de l'aimantation en utilisant un find dans le mousemove dans le dataset avec le totalMovement
// il fuat ajouter transform duration-500 lorsuqe il revient à 0 ou lorsqu'il se calera (et commencer à faire du fonctionnel)

// Voir les events de dispo parce qu'il va falloir gérer la sourie et le touche
// Ensuite, il faut jouer avec la quantité de déplacement pour modifier le translate dans le style
// Il faudra aussi voir la gestion des arrows
// Voir la gestion au clavier ensuite
