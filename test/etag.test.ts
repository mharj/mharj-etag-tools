import {describe, expect, it} from 'vitest';
import {getETag, getEtagHeader, getETagResult, haveETag, type IEtagObject, unWrapEtag, unWrapEtagResult, wrapEtag} from '../src/index';

describe('etag utils', function () {
	describe('wrapEtag', function () {
		it('test wrap data without etag', function () {
			expect(wrapEtag('hello')).to.be.eql({data: 'hello', etag: null});
			expect(wrapEtag('hello', null)).to.be.eql({data: 'hello', etag: null});
			expect(wrapEtag(['hello'], null)).to.be.eql({data: ['hello'], etag: null});
		});
		it('test wrap data with etag', function () {
			expect(wrapEtag('hello', '123')).to.be.eql({data: 'hello', etag: '123'});
		});
	});
	describe('unWrapEtag', function () {
		it('test unwrap data', function () {
			expect(unWrapEtag({data: 'hello', etag: '123'})).to.be.eql('hello');
			expect(unWrapEtag({data: ['hello'], etag: '123'})).to.be.eql(['hello']);
		});
		it('should not unwrap data from broken object', function () {
			expect(() => unWrapEtag('123123123' as any)).to.throw(TypeError, 'data is not ETag object');
		});
		it('should not get etag from broken object', function () {
			expect(() => getETag('123123123' as any)).to.throw(TypeError, 'data is not ETag object');
		});
	});
	describe('unWrapEtagResult', function () {
		it('test unwrap data', function () {
			expect(unWrapEtagResult({data: 'hello', etag: '123'}).unwrap()).to.be.eql('hello');
			expect(unWrapEtagResult({data: ['hello'], etag: '123'}).unwrap()).to.be.eql(['hello']);
		});
		it('should not unwrap data from broken object', function () {
			expect(() => unWrapEtagResult('123123123' as any).unwrap()).to.throw(TypeError, 'data is not ETag object');
		});
		it('should not get etag from broken object', function () {
			expect(() => unWrapEtagResult('123123123' as any).unwrap()).to.throw(TypeError, 'data is not ETag object');
		});
	});
	describe('haveETag', function () {
		it('test object have etag', function () {
			const undefinedData = undefined as any;
			const nullData = null as any;
			expect(haveETag({data: 'asd', etag: '123'})).to.be.eql(true);
			expect(haveETag({data: 'asd', etag: null})).to.be.eql(false);
			expect(haveETag(undefinedData)).to.be.eql(false);
			expect(haveETag(nullData)).to.be.eql(false);
		});
	});
	describe('getETag', function () {
		it('tests to read etag', function () {
			const data: IEtagObject<string> = {data: 'asd', etag: '123'};
			if (!haveETag(data)) {
				throw new Error('should not happen');
			}
			expect(getETag(data)).to.be.eql('123');
		});
	});
	describe('getETagResult', function () {
		it('tests to read etag', function () {
			const data: IEtagObject<string> = {data: 'asd', etag: '123'};
			if (!haveETag(data)) {
				throw new Error('should not happen');
			}
			expect(getETagResult(data).unwrap()).to.be.eql('123');
		});
		it('tests to read etag', function () {
			expect(() => getETagResult('123123123' as any).unwrap()).to.throw(TypeError, 'data is not ETag object');
		});
	});
	describe('getEtagHeader', function () {
		it('tests to read etag from header', function () {
			const headers = new Headers();
			headers.set('ETag', '123');
			const res = new Response('body', {headers});
			expect(getEtagHeader(res)).to.be.eql('123');
		});
		it('tests to read no etag from header', function () {
			const headers = new Headers();
			const res = new Response('body', {headers});
			expect(getEtagHeader(res)).to.be.eql(null);
		});
	});
});
