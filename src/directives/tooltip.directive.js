export default {
   mounted(el, {value}) {
      M.Tooltip.init(el, {html: value})
   },
   unmounted(el) {
      const tooltip = M.Tooltip.getInstance(el)
      if (tooltip && tooltip.destroy) {
         tooltip.destroy()
      }
   },
   name: 'tooltip'
}
