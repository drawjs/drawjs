import { notNil, notUndefined } from '../lodash/index';

export default function ( classObject: any, props: any = {}, key: string, defaultValue: any ) {
	defaultValue = notUndefined( defaultValue ) ? defaultValue : classObject[ key ]
	const propsValue =props[ key ]
	classObject[ key ] = notUndefined( propsValue ) ? propsValue : defaultValue
}
