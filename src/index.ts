export interface IEtagObject<T = any> {
	etag: string | null;
	data: T;
}

interface IWithEtagObject<T = any> extends IEtagObject<T> {
	etag: string;
}

/**
 * Build ETag Object
 * @param data data inside of object
 * @param etag ETag or null
 * @return {IEtagObject<T>}
 */
export const wrapEtag = <T = any>(data: T, etag: string | null = null): IEtagObject<T> => {
	return {
		data,
		etag,
	};
};

/**
 * return data from Etag Object
 * @param etagData ETag Object
 * @return {<T>} object data
 */
export const unWrapEtag = <T = any>(etagData: IEtagObject<T>): T => {
	if (!isEtagObject(etagData)) {
		throw new TypeError('data is not ETag object');
	}
	return etagData.data;
};

/**
 * return data from Etag Object
 * @param etagData ETag Object
 * @return {<T>} object data
 */
export const getETag = <T = any>(etagData: IWithEtagObject<T>): string => {
	if (!isEtagObject(etagData)) {
		throw new TypeError('data is not ETag object');
	}
	return etagData.etag;
};

/**
 * check if we have ETag set
 * @param etagData ETag Object
 * @return {boolean}
 */
export const haveETag = <T = any>(etagData: IEtagObject<T>): etagData is IWithEtagObject<T> => {
	if (!isEtagObject(etagData)) {
		return false;
	}
	return etagData.etag !== null;
};

/**
 * validates Etag Object
 */
export const isEtagObject = <T = any>(data: IEtagObject<T>): data is IEtagObject<T> => {
	return data && typeof data === 'object' && 'etag' in data && 'data' in data;
};

/**
 * get ETag from response header
 */
export const getEtagHeader = (res: Response): string | null => {
	let etag: string | null = null;
	if (res.headers.has('ETag')) {
		etag = res.headers.get('ETag');
	}
	return etag;
};
