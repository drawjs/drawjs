import { isString, isNumber, isBoolean, isNull, isArray, isObject, values } from "lodash";

export default function isJsonDataType( value: any ) {
  let res: boolean = false


  
  if ( isString( value ) || isNumber( value ) || isBoolean( value ) || isNull( value ) ) {
    res = true
  }  

  if ( isArray( value ) ) {
    value.every( ( subValue: any ) => isJsonDataType( subValue ) )  && setResTrue()
  }

  if ( isObject( value ) ) {
    const keys = Object.keys( value )
    const data = values( value )
    keys.every( ( subValue: any ) => isJsonDataType( subValue ) )  && setResTrue()
    data.every( ( subValue: any ) => isJsonDataType( subValue ) )  && setResTrue()
  }
  

  return res

  function setResTrue() {
    res = true
  }
}