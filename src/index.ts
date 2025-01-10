import {Err, type IResult, Ok} from '@luolapeikko/result-option';

const notValidEtag = 'data is not ETag object';

export interface IEtagObject<T = unknown> {
	readonly etag: string | null;
	readonly data: T;
}

interface IWithEtagObject<T = unknown> extends IEtagObject<T> {
	readonly etag: string;
}

/**
 * Creates a new ETag object.
 * @example
 * wrapEtag('asd', '123') // {data: 'asd', etag: '123'}
 * @param data data inside of object
 * @param etag ETag or null
 * @template T data
 * @return {IEtagObject<T>}
 */
export function wrapEtag<T = unknown>(data: T, etag: string): IWithEtagObject<T>;
export function wrapEtag<T = unknown>(data: T, etag?: null): IEtagObject<T>;
export function wrapEtag<T = unknown>(data: T, etag: string | null = null): IEtagObject<T> {
	return {
		data,
		etag,
	};
}

/**
 * Unwraps the data from an ETag object.
 * @example
 * unWrapEtag({data: 'asd', etag: '123'}) // 'asd'
 * @param etagObject ETag Object
 * @template T data
 * @return {<T>} object data
 * @throws {TypeError} if `etagObject` is not an ETag object type
 */
export function unWrapEtag<T = unknown>(etagObject: IEtagObject<T>): T {
	if (!isEtagObject(etagObject)) {
		throw new TypeError(notValidEtag);
	}
	return etagObject.data;
}

/**
 * Retrieves the ETag value [Result](https://luolapeikko.github.io/result-option/types/IResult.html) from an ETag object.
 * @example
 * unWrapEtagResult({data: 'asd', etag: '123'}).unwrap() // 'asd'
 * @param etagObject ETag Object
 * @template T data
 * @return {IResult<T, TypeError>} object data as Result
 */
export function unWrapEtagResult<T = unknown>(etagObject: IEtagObject<T>): IResult<T, TypeError> {
	if (!isEtagObject(etagObject)) {
		return Err(new TypeError(notValidEtag));
	}
	return Ok(etagObject.data);
}

/**
 * Retrieves the ETag value from an ETag object.
 * @example
 * getETag({data: 'asd', etag: '123'}) // '123'
 * @param etagObject ETag Object
 * @template T data
 * @return {string} The ETag value.
 * @throws {TypeError} If the input is not an ETag object.
 */
export function getETag<T = unknown>(etagObject: IWithEtagObject<T>): string {
	if (!isEtagObject(etagObject)) {
		throw new TypeError(notValidEtag);
	}
	return etagObject.etag;
}

/**
 * Retrieves the ETag value as [Result](https://luolapeikko.github.io/result-option/types/IResult.html) from an ETag object.
 * @example
 * getETagResult({data: 'asd', etag: '123'}).unwrap() // '123'
 * @param etagData ETag Object
 * @template T data
 * @return {IResult<string, TypeError>} ETag value as Result
 */
export function getETagResult<T = unknown>(etagData: IWithEtagObject<T>): IResult<string, TypeError> {
	if (!isEtagObject(etagData)) {
		return Err(new TypeError(notValidEtag));
	}
	return Ok(etagData.etag);
}

/**
 * Type guard to check if an object is an IWithEtagObject shape object.
 * @example
 * haveETag({data: 'asd', etag: '123'}) // true
 * @param {IEtagObject<T>} etagData - The ETag object to check.
 * @template T data
 * @return {etagData is IWithEtagObject<T>} True if the ETag value is set, false otherwise.
 */
export function haveETag<T = unknown>(etagData: IEtagObject<T>): etagData is IWithEtagObject<T> {
	if (!isEtagObject(etagData)) {
		return false;
	}
	return etagData.etag !== null;
}

/**
 * Type guard to check if an object is an IEtagObject shape object.
 * @param {IEtagObject} data - The object to validate.
 * @template T data
 * @return {data is IEtagObject<T>} True if the object is an ETag object, false otherwise.
 */
export function isEtagObject<T = unknown>(data: IEtagObject<T>): data is IEtagObject<T> {
	return typeof data === 'object' && data !== null && 'etag' in data && 'data' in data;
}

/**
 * Retrieves the ETag value from a Response object's headers.
 *
 * @param {Response} res - The Response object to retrieve the ETag from.
 * @return {string | null} The ETag value, or null if not found.
 */
export function getEtagHeader(res: Response): string | null {
	return res.headers.get('ETag');
}
