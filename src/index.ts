export interface IEtagObject<T = unknown> {
	readonly etag: string | null;
	readonly data: T;
}

interface IWithEtagObject<T = unknown> extends IEtagObject<T> {
	readonly etag: string;
}

/**
 * Build ETag Object
 * @param data data inside of object
 * @param etag ETag or null
 * @return {IEtagObject<T>}
 */
export function wrapEtag<T = unknown>(data: T, etag: string | null = null): IEtagObject<T> {
	return {
		data,
		etag,
	};
}

/**
 * return data from Etag Object
 * @param etagData ETag Object
 * @return {<T>} object data
 */
export function unWrapEtag<T = unknown>(etagData: IEtagObject<T>): T {
	if (!isEtagObject(etagData)) {
		throw new TypeError('data is not ETag object');
	}
	return etagData.data;
}

/**
 * return data from Etag Object
 * @param etagData ETag Object
 * @return {<T>} object data
 */
export function getETag<T = unknown>(etagData: IWithEtagObject<T>): string {
	if (!isEtagObject(etagData)) {
		throw new TypeError('data is not ETag object');
	}
	return etagData.etag;
}

/**
 * check if we have ETag set
 * @param etagData ETag Object
 * @return {boolean}
 */
export function haveETag<T = unknown>(etagData: IEtagObject<T>): etagData is IWithEtagObject<T> {
	if (!isEtagObject(etagData)) {
		return false;
	}
	return etagData.etag !== null;
}

/**
 * validates Etag Object
 */
export function isEtagObject<T = unknown>(data: IEtagObject<T>): data is IEtagObject<T> {
	return data && typeof data === 'object' && data !== null && 'etag' in data && 'data' in data;
}

/**
 * get ETag from response header
 */
export function getEtagHeader(res: Response): string | null {
	return res.headers.get('ETag');
}
