<script>
  import ol from 'openlayers'
  import { isEqual } from 'lodash/fp'
  import { Observable } from 'rxjs/Observable'
  import 'rxjs/add/observable/combineLatest'
  import 'rxjs/add/operator/distinctUntilChanged'
  import 'rxjs/add/operator/throttleTime'
  import 'vuelayers/src/rx'
  import { round } from 'vuelayers/src/utils/func'
  import exposeContext from 'vuelayers/src/mixins/expose-context'
  import rxSubs from 'vuelayers/src/mixins/rx-subs'
  import positionMarker from './position-marker.svg'

  const props = {
    tracking: {
      type: Boolean,
      default: true
    }
  }

  const methods = {
    context () {
      return {
        ...this.$parent.context()
      }
    }
  }

  const watch = {
    tracking (value) {
      this.geoloc.setTracking(value)
    }
  }

  export default {
    name: 'vl-geoloc',
    mixins: [ exposeContext, rxSubs ],
    props,
    watch,
    methods,
    render: h => h(),
    data () {
      return {
        currentPosition: undefined,
        currentAccuracy: undefined
      }
    },
    created () {
      this::createGeolocApi()

      this::subscribeToGeolocation()
    },
    beforeDestroy () {
      this.geoloc.setTracking(false)
      this.context().serviceOverlay.getSource().removeFeature(this.positionFeature)

      this.geoloc = this.positionFeature = undefined
    }
  }

  /**
   * @return {ol.Geolocation}
   */
  function createGeolocApi () {
    /**
     * @type {ol.Geolocation}
     * @protected
     */
    this.geoloc = new ol.Geolocation({
      tracking: this.tracking,
      projection: this.projection
    })

    this.geoloc.vm = this
    /**
     * @type {ol.Feature}
     * @protected
     */
    this.positionFeature = new ol.Feature({
      internal: true
    })
    this.positionFeature.setStyle(new ol.style.Style({
      image: new ol.style.Icon({
        src: positionMarker,
        scale: 0.85,
        anchor: [ 0.5, 1 ]
      })
    }))
    this.context().serviceOverlay.getSource().addFeature(this.positionFeature)

    return this.geoloc
  }

  function subscribeToGeolocation () {
    const geolocChanges = Observable.fromOlEvent(this.geoloc, 'change', () => {
      const position = ol.proj.toLonLat(this.geoloc.getPosition(), this.projection)
        .map(x => round(x, 6))
      const accuracy = round(this.geoloc.getAccuracy(), 6)

      return [ position, accuracy ]
    }).throttleTime(100)
      .distinctUntilChanged((a, b) => isEqual(a, b))

    this.subs.geoloc = geolocChanges.subscribe(
      ([ position, accuracy ]) => {
        this.currentPosition = position
        this.currentAccuracy = accuracy

        this.$emit('change', [ position, accuracy ])
      },
      ::console.error
    )
  }
</script>