import { isNull, isString, isNumber, isBoolean, isArray, isPlainObject, values } from "../lodash/index"

export default function isBasicJsonDataType( value ) {
  return isBasic( value ) || ( isArray( value ) && value.every( isBasic ) ) || isPlainObject( value ) && ( values( value ).every( isBasic ) )
}


function isBasic( value ) {
  return isString( value ) || isNumber( value ) || isBoolean( value ) || isNull( value ) 
}