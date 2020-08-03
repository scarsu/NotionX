import $ from 'jquery'

export function scrollToTop () {
  $('.notion-scroller').animate(
    {
      scrollTop: 0
    },
    200,
    null
  )
}
