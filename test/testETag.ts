/* eslint-disable import/first */
process.env.NODE_ENV = 'testing';
import {expect} from 'chai';
import 'mocha';

import {wrapEtag, unWrapEtag, getETag, haveETag} from '../src/index';

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
			expect(haveETag({data: 'asd', etag: '123'})).to.be.eql(true);
			expect(haveETag({data: 'asd', etag: null})).to.be.eql(false);
			expect(haveETag(undefined)).to.be.eql(false);
			expect(haveETag(null)).to.be.eql(false);
		});
	});
	describe('getETag', () => {
		it('tests to read etag', async () => {
			expect(getETag({data: 'asd', etag: '123'})).to.be.eql('123');
		});
	});
});
