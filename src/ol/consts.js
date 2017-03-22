import Sphere from 'ol/sphere'

/**
 * @type {string} Default map projection.
 */
export const MAP_PROJECTION = 'EPSG:3857'
/**
 * @type {string} Default data source projection.
 */
export const DATA_PROJECTION = 'EPSG:4326'
/**
 * @type {number} Default map max zoom
 */
export const MAX_ZOOM = 28
/**
 * @type {number} Default map min zoom
 */
export const MIN_ZOOM = 0
/**
 * @type {number} Default tile size
 */
export const TILE_SIZE = 256
/**
 * @type {number} Default zoom factor
 */
export const ZOOM_FACTOR = 2
/**
 * @type {number}
 */
export const CACHE_SIZE = 2048
/**
 * @type {number}
 */
export const PIXEL_RATIO = 1
/**
 * @type {number} Earth radius in meters
 */
export const EARTH_RADIUS = 6378137
export const WGS84_SPHERE = new Sphere(EARTH_RADIUS)

export const GEOMETRY_TYPE = {
  POINT: 'Point',
  LINE_STRING: 'LineString',
  POLYGON: 'Polygon',
  MULTI_POINT: 'MultiPoint',
  MULTI_LINE_STRING: 'MultiLineString',
  MULTI_POLYGON: 'MultiPolygon',
  GEOMETRY_COLLECTION: 'GeometryCollection',
  CIRCLE: 'Circle'
}

/**
 * @type {string} Default WMS version
 */
export const WMS_VERSION = '1.3.0'
// todo try with Symbol to prevent conflicts with user provided properties
export const LAYER_PROP = 'layer'