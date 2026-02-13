import { Test } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { internalLogger } from './httpLogger';



describe('internalLogger', () => {
  let logger: Logger;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [Logger],
    }).compile();

    logger = moduleRef.get<Logger>(Logger);
  });

  it('should log with logger.log() on successful internal operation', (done) => {
    jest.spyOn(logger, 'log').mockImplementation(() => { });
    const { internalLogger } = require('./httpLogger');
    const { of } = require('rxjs');

    const response = {
      result: { data: 'success', ruleId: '123' },
    };

    const source$ = of(response);
    const logSpy = jest.spyOn(logger, 'log');

    internalLogger(
      logger,
      true,
      'process-1',
      'doc-1',
      { input: 'test' },
      { 'x-header': 'value' },
      'ZEN_ENGINE',
    )(source$).subscribe({
      next: (result: any) => {
        expect(result).toEqual({ data: 'success', ruleId: '123' });
        expect(logSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            code: 200,
            processId: 'process-1',
            document: 'doc-1',
            operation: 'ZEN_ENGINE',
          }),
        );
        done();
      },
      error: (err: any) => done(err),
    });
  });

  it('should throw NotFoundException when result is empty', (done) => {
    jest.spyOn(logger, 'warn').mockImplementation(() => { });
    const { internalLogger } = require('./httpLogger');
    const { of } = require('rxjs');

    const response = {
      result: {},
    };

    const source$ = of(response);

    internalLogger(logger)(source$).subscribe({
      next: () => done(new Error('Should have thrown NotFoundException')),
      error: (err: any) => {
        expect(err.status).toBe(404);
        expect(err.message).toContain('No se encontraron resultados');
        done();
      },
    });
  });

  it('should throw NotFoundException when result is null', (done) => {
    const { internalLogger } = require('./httpLogger');
    const { of } = require('rxjs');

    const response = {
      result: null,
    };

    const source$ = of(response);

    internalLogger(logger)(source$).subscribe({
      next: () => done(new Error('Should have thrown NotFoundException')),
      error: (err: any) => {
        expect(err.status).toBe(404);
        done();
      },
    });
  });

  it('should log with logger.warn() on 404 errors', (done) => {
    jest.spyOn(logger, 'warn').mockImplementation(() => { });
    const { internalLogger } = require('./httpLogger');
    const { throwError } = require('rxjs');
    const { NotFoundException } = require('@nestjs/common');

    const error = new NotFoundException('Resource not found');
    const source$ = throwError(() => error);
    const logSpy = jest.spyOn(logger, 'warn');

    internalLogger(
      logger,
      false,
      'proc-2',
      'doc-2',
      null,
      null,
      'SERVICE_BUS',
    )(source$).subscribe({
      next: () => done(new Error('Should have thrown error')),
      error: (err: any) => {
        expect(logSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            code: 404,
            processId: 'proc-2',
            document: 'doc-2',
            operation: 'SERVICE_BUS',
          }),
        );
        done();
      },
    });
  });

  it('should log with logger.error() on 500 errors', (done) => {
    jest.spyOn(logger, 'error').mockImplementation(() => { });
    const { internalLogger } = require('./httpLogger');
    const { throwError } = require('rxjs');
    const { HttpException } = require('@nestjs/common');

    const error = new HttpException('Internal Server Error', 500);
    const source$ = throwError(() => error);
    const logSpy = jest.spyOn(logger, 'error');

    internalLogger(
      logger,
      true,
      'proc-3',
      'doc-3',
      { data: 'test' },
      { 'auth': 'token' },
      'OCR_SERVICE',
    )(source$).subscribe({
      next: () => done(new Error('Should have thrown error')),
      error: (err: any) => {
        expect(logSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            code: 500,
            processId: 'proc-3',
            document: 'doc-3',
            operation: 'OCR_SERVICE',
          }),
        );
        done();
      },
    });
  });

  it('should log with logger.error() on generic errors', (done) => {
    jest.spyOn(logger, 'error').mockImplementation(() => { });
    const { internalLogger } = require('./httpLogger');
    const { throwError } = require('rxjs');

    const error = new Error('Generic error');
    const source$ = throwError(() => error);
    const logSpy = jest.spyOn(logger, 'error');

    internalLogger(logger)(source$).subscribe({
      next: () => done(new Error('Should have thrown error')),
      error: (err: any) => {
        expect(logSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            code: 503,
            response: 'Generic error',
          }),
        );
        done();
      },
    });
  });
});
