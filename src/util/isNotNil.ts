import isNil from "lodash/isNil"

export default function ( value: any ) {
	const res = ! isNil( value )
	return res
}
