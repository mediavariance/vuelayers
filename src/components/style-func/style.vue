<script>
  /**
   * Style function component for advanced styling.
   * Plays the role of both a style that mounts itself to style target component (vl-layer-vector, vl-feature & etc.)
   * and style target for inner style containers (vl-style-box) as fallback style.
   */
  import { isFunction, noop } from 'lodash/fp'
  import { debug, assert, mergeDescriptors, style, stylesContainer } from '../../core'

  const props = {
    /**
     * @type {function(): ol.StyleFunction}
     */
    factory: {
      type: Function,
      required: true,
    },
  }

  const computed = {
    styleFunc () {
      let func = this.factory()
      if (!isFunction(func)) {
        debug.warndbg(`Factory returned a value not of Function type, fallback style will be used`)
        func = noop
      }

      return func
    },
  }

  const methods = {
    /**
     * @return {ol.StyleFunction}
     * @protected
     */
    createStyle () {
      assert.hasMap(this)
      // user provided style function
      const providedStyleFunc = this.styleFunc
      // fallback style function made from inner style containers
      const fallbackStyleFunc = this.createStyleFunc()

      return function __styleFunc (feature, resolution) {
        const styles = providedStyleFunc(feature, resolution)
        // not empty or null style
        if (
          styles === null ||
          (Array.isArray(styles) && styles.length)
        ) {
          return styles
        }
        return fallbackStyleFunc(feature, resolution)
      }
    },
    /**
     * @return {void}
     * @protected
     */
    mount () {
      this.$stylesContainer && this.$stylesContainer.addStyle(this)
    },
    /**
     * @return {void}
     * @protected
     */
    unmount () {
      this.$stylesContainer && this.$stylesContainer.removeStyle(this)
    },
    /**
     * @returns {Object}
     * @protected
     */
    getServices () {
      const vm = this

      return mergeDescriptors(this::style.methods.getServices(), {
        get stylesContainer () { return vm },
      })
    },
    /**
     * Overrides stylesContainer `setStyle` method
     * @param {Array<{ style: ol.style.Style, condition: (function|boolean|undefined) }>|ol.StyleFunction|Vue|undefined} styles
     * @return {void}
     */
    setStyle (styles) {
      if (styles !== this._styles) {
        // simply save all inner styles and
        // use them later in style function as fallback
        this._styles = styles
        this.refresh()
      }
    },
    /**
     * @return {Promise}
     */
    refresh () {
      // recreate style
      return Promise.resolve(this.unmount())
        .then(this.deinit)
        .then(this.init)
        .then(this.mount)
    },
  }

  const watch = {
    factory () {
      this.refresh()
    },
  }

  export default {
    name: 'vl-style-func',
    mixins: [style, stylesContainer],
    props,
    computed,
    methods,
    watch,
    stubVNode: {
      empty: false,
      attrs () {
        return {
          class: this.$options.name,
        }
      },
    },
  }
</script>
