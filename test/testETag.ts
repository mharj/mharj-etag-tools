/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/first */
process.env.NODE_ENV = 'testing';
import {expect} from 'chai';
import 'mocha';

import {Headers} from 'cross-fetch';

import {wrapEtag, unWrapEtag, getETag, haveETag, IEtagObject, getEtagHeader} from '../src/index';

describe('etag utils', () => {
	describe('wrapEtag', () => {
		it('test wrap data without etag', async () => {
			expect(wrapEtag('hello')).to.be.eql({data: 'hello', etag: null});
			expect(wrapEtag('hello', null)).to.be.eql({data: 'hello', etag: null});
			expect(wrapEtag(['hello'], null)).to.be.eql({data: ['hello'], etag: null});
		});
		it('test wrap data with etag', async () => {
			expect(wrapEtag('hello', '123')).to.be.eql({data: 'hello', etag: '123'});
		});
	});
	describe('unWrapEtag', () => {
		it('test unwrap data', async () => {
			expect(unWrapEtag({data: 'hello', etag: '123'})).to.be.eql('hello');
			expect(unWrapEtag({data: ['hello'], etag: '123'})).to.be.eql(['hello']);
		});
		it('should not unwrap data from broken object', async () => {
			expect(unWrapEtag.bind(null, '123123123')).to.throw(TypeError, 'data is not ETag object');
		});
		it('should not get etag from broken object', async () => {
			expect(getETag.bind(null, '123123123')).to.throw(TypeError, 'data is not ETag object');
		});
	});
	describe('haveETag', () => {
		it('test object have etag', async () => {
			const undefinedData = undefined as any;
			const nullData = null as any;
			expect(haveETag({data: 'asd', etag: '123'})).to.be.eql(true);
			expect(haveETag({data: 'asd', etag: null})).to.be.eql(false);
			expect(haveETag(undefinedData)).to.be.eql(false);
			expect(haveETag(nullData)).to.be.eql(false);
		});
	});
	describe('getETag', () => {
		it('tests to read etag', async () => {
			const data: IEtagObject<string> = {data: 'asd', etag: '123'};
			if (!haveETag(data)) {
				throw new Error('should not happen');
			}
			expect(getETag(data)).to.be.eql('123');
		});
	});
	describe('getEtagHeader', () => {
		it('tests to read etag from header', async () => {
			const headers = new Headers();
			headers.set('ETag', '123');
			const res: Response = {
				headers,
				ok: true,
				redirected: false,
				status: 200,
				statusText: 'ok',
				trailer: Promise.resolve(headers),
				type: 'default',
				url: 'http://localhost',
				clone: () => res,
				body: null,
				bodyUsed: false,
				arrayBuffer: () => Promise.resolve(new ArrayBuffer(1)),
				blob: () => Promise.resolve(new Blob()),
				formData: () => Promise.resolve(new FormData()),
				json: () => Promise.resolve(''),
				text: () => Promise.resolve(''),
			};
			expect(getEtagHeader(res)).to.be.eql('123');
		});
		it('tests to read no etag from header', async () => {
			const headers = new Headers();
			const res: Response = {
				headers,
				ok: true,
				redirected: false,
				status: 200,
				statusText: 'ok',
				trailer: Promise.resolve(headers),
				type: 'default',
				url: 'http://localhost',
				clone: () => res,
				body: null,
				bodyUsed: false,
				arrayBuffer: () => Promise.resolve(new ArrayBuffer(1)),
				blob: () => Promise.resolve(new Blob()),
				formData: () => Promise.resolve(new FormData()),
				json: () => Promise.resolve(''),
				text: () => Promise.resolve(''),
			};
			expect(getEtagHeader(res)).to.be.eql(null);
		});
	});
});
