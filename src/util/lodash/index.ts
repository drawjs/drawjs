import { isNil, isUndefined } from 'lodash';

export const isIndexFound = ( index: number ) => index !== -1

export const notIndexFound = ( index: number ) => isIndexFound( index )


export const notNil = ( value: any ) => ! isNil( value )
export const notUndefined = ( value: any ) => ! isUndefined( value )
