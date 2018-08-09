import isNil from "lodash/isNil"
import isNull from "lodash/isNull"
import isUndefined from "lodash/isUndefined"
import isArray from "lodash/isArray"
import isObject from "lodash/isObject"
import cloneDeep from "lodash/cloneDeep"
import includes from "lodash/includes"
import uniq from "lodash/uniq"
import uniqWith from "lodash/uniqWith"
import intersection from "lodash/intersection"
import mapValues from "lodash/mapValues"
import values from "lodash/values"
import isPlainObject from "lodash/isPlainObject"
import isNumber from "lodash/isNumber"
import isBoolean from "lodash/isBoolean"
import isString from "lodash/isString"
import isDate from "lodash/isDate"
import find from "lodash/find"

export {
  isNil,
  isNull,
  isUndefined,
  isArray,
  isObject,

	cloneDeep,
	includes,
  uniq,
  uniqWith,
	intersection,
  mapValues,
  values,
	isPlainObject,
	isNumber,
	isBoolean,
	isString,
	isDate,
	find
}

export const isIndexFound = ( index: number ) => index !== -1

export const notIndexFound = ( index: number ) => isIndexFound( index )

export const notNil = ( value: any ) => !isNil( value )
export const notUndefined = ( value: any ) => !isUndefined( value )
