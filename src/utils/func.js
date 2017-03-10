import {
  reduce as lodashReduce,
  forEach as lodashForEach,
  isFunction,
  isString,
  isEmpty,
  isEqual,
  flow,
  pick,
  omit,
  upperFirst,
  lowerFirst,
  merge,
  constant,
  differenceWith,
  kebabCase,
  range,
  random
} from 'lodash/fp'

/**
 * @param {*} value
 * @return {boolean} True if value is number or numeric string.
 */
export function isNumeric (value) {
  return !isNaN(parseFloat(value)) && isFinite(value)
}

/**
 * @param {...*} [args]
 *
 * @return {*}
 */
export function coalesce (...args) {
  return args.find(val => val != null)
}

/**
 * @param {number} num
 * @param {number} [precision=0]
 * @return {number}
 */
export function round (num, precision = 0) {
  return Number(Math.round(Number(num + 'e+' + precision)) + 'e-' + precision)
}

/**
 * Replaces `tokens` in the `string` by values from the `replaces`.
 *
 * @param {string} string
 * @param {Object} replaces
 *
 * @returns {string}
 */
export function replaceTokens (string, replaces) {
  const regExp = new RegExp(Object.keys(replaces).map(field => '(\\{' + field + '\\})').join('|'), 'ig')

  return string.replace(regExp, match => replaces[ match.substr(1, match.length - 2) ] || '')
}

// Copyright 2009 Nicholas C. Zakas. All rights reserved.
// MIT Licensed
export function timedChunk (items, process, processContext, callback, callbackContext) {
  return new Promise(resolve => {
    let todo = items.slice() // create a clone of the original

    let exec = function () {
      let start = Date.now()

      do {
        process.call(processContext, todo.shift())
      } while (todo.length > 0 && (Date.now() - start < 50))

      if (todo.length > 0) {
        setTimeout(exec, 25)
      } else {
        if (typeof callback === 'function') {
          callback.call(callbackContext, items)
        }
        resolve(items)
      }
    }

    if (todo.length) {
      setTimeout(exec, 25)
    } else {
      resolve(items)
    }
  })
}

// lodash re-exports
export const reduce = lodashReduce.convert({ cap: false })
export const forEach = lodashForEach.convert({ cap: false })
export const diffById = differenceWith((a, b) => a.id === b.id)
export {
  isFunction,
  isString,
  isEmpty,
  isEqual,
  flow,
  pick,
  omit,
  upperFirst,
  lowerFirst,
  merge,
  constant,
  differenceWith,
  kebabCase,
  range,
  random
}