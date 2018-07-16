import { isString, isNumber, isBoolean, isNull, isArray, isPlainObject, values } from "lodash";

export default function isBasicJsonDataType( value ) {
  return isBasic( value ) || ( isArray( value ) && value.every( isBasic ) ) || isPlainObject( value ) && ( values( value ).every( isBasic ) )
}


function isBasic( value ) {
  return isString( value ) || isNumber( value ) || isBoolean( value ) || isNull( value ) 
}