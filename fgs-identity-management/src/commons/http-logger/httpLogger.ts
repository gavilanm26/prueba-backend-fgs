import { HttpException, Logger, NotFoundException } from '@nestjs/common';
import { catchError, tap, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

export function internalLogger(
  logger: Logger,
  responseShow?: boolean,
  processId?: any,
  document?: any,
  request?: any,
  headers?: any,
  operation?: string,
) {
  return (source$: Observable<any>): Observable<any> =>
    source$.pipe(
      map((res: any) => {
        const isEmpty = !res.result || (typeof res.result === 'object' && Object.keys(res.result).length === 0);

        if (isEmpty) {
          throw new NotFoundException(`No se encontraron resultados para la operación solicitada`);
        }

        return { ...res, data: res.result, status: 200 };
      }),
      tap((response: any) => {
        logger.log({
          code: response.status,
          processId: processId,
          document: document,
          operation: operation,
          response:
            responseShow === true
              ? Buffer.from(JSON.stringify(response.data), 'utf8').toString('base64')
              : undefined,
          request: request ? Buffer.from(JSON.stringify(request), 'utf8').toString('base64') : undefined,
          headers: headers,
        });
      }),
      catchError((error: any) => {
        const isHttpException = error instanceof HttpException;

        let statusCode = 503;
        let errorResponse = error.message || 'Unexpected Error';

        if (isHttpException) {
          statusCode = error.getStatus();
          errorResponse = error.getResponse();
        }

        const logData = {
          code: statusCode,
          processId: processId,
          document: document,
          operation: operation,
          response: errorResponse,
          request: request ? Buffer.from(JSON.stringify(request), 'utf8').toString('base64') : undefined,
          headers: headers,
        };

        if (statusCode >= 400 && statusCode < 500) {
          logger.warn(logData);
        } else {
          logger.error(logData);
        }

        return throwError(() => error);
      }),
      map((res: any) => res.data),
    );
}
