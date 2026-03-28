import { throwError } from 'rxjs';
import { ajax, AjaxError } from 'rxjs/ajax';
import { catchError } from 'rxjs/operators';
import Cookies from 'js-cookie';
import { v4 as uuidv4 } from 'uuid';
import { APP_URL_PREFIX, ROUTES } from 'constants/routes';
import { omit } from 'lodash';
import { getAppLanguage } from '#shared/utils/common';

const CSRF_TOKEN = 'XSRF-TOKEN';
interface ApiInterface {
  baseUrl: string;
  headers: Record<string, string>;
}

interface PostOptions {
  isFormData?: boolean;
}
interface HttpOptions {
  headers?: Record<string, string>
}

type RequestBody<T = Record<string, unknown>> = T;
export class Api implements ApiInterface {
  baseUrl = '';

  headers: Record<string, string> = {};

  constructor(baseUrl: string, headers: Record<string, string>) {
    this.baseUrl = baseUrl;
    this.headers = headers;
  }

  private isXmlRequest() {
    return this.headers?.['Content-Type'] === 'text/xml';
  }

  private getHttpHeaders() {
    return {
      ...this.headers,
      'Accept-Language': getAppLanguage(ENVIRONMENT_VARIABLES.language, ENVIRONMENT_VARIABLES.supportedLanguages),
    };
  }

  // eslint-disable-next-line class-methods-use-this
  errorInterceptor = (response: AjaxError) => {
    if (response.status === 401 && window.location.pathname !== `${APP_URL_PREFIX}${ROUTES.LOGIN}`) {
      window.location.assign(`${APP_URL_PREFIX}${ROUTES.LOGIN}`);
    }

    return throwError(response);
  };

  get$<T = unknown>(appendixUrl: string) {
    return ajax<T>({
      url: `${this.baseUrl}/${appendixUrl}`,
      headers: this.getHttpHeaders(),
      method: 'GET',
      withCredentials: true,
      ...(this.isXmlRequest() && { responseType: 'text' }),
    }).pipe(
      catchError(this.errorInterceptor),
    );
  }

  post$<T = unknown>(appendixUrl: string, body: RequestBody | FormData | string, options?: PostOptions) {
    Cookies.set(CSRF_TOKEN, uuidv4());
    let headers = {
      ...this.getHttpHeaders(),
      [`X-${CSRF_TOKEN}`]: Cookies.get(CSRF_TOKEN),
    };
    if (options?.isFormData) {
      headers = omit(headers, ['Content-Type']) as typeof headers;
    }

    return ajax<T>({
      url: `${this.baseUrl}/${appendixUrl}`,
      headers,
      body,
      method: 'POST',
      withCredentials: true,
    }).pipe(
      catchError(this.errorInterceptor),
    );
  }

  put$<T = unknown>(appendixUrl: string, body: Record<string, unknown> | string, options?: HttpOptions) {
    Cookies.set(CSRF_TOKEN, uuidv4());

    return ajax<T>({
      url: `${this.baseUrl}/${appendixUrl}`,
      headers: {
        ...this.getHttpHeaders(),
        [`X-${CSRF_TOKEN}`]: Cookies.get(CSRF_TOKEN),
        ...(options?.headers),
      },
      body,
      method: 'PUT',
      withCredentials: true,
      ...(this.isXmlRequest() && { responseType: 'text' }),
    }).pipe(
      catchError(this.errorInterceptor),
    );
  }

  delete$(appendixUrl: string, options?: HttpOptions) {
    Cookies.set(CSRF_TOKEN, uuidv4());

    return ajax({
      url: `${this.baseUrl}/${appendixUrl}`,
      headers: {
        ...this.getHttpHeaders(),
        [`X-${CSRF_TOKEN}`]: Cookies.get(CSRF_TOKEN),
        ...(options?.headers),
      },
      method: 'DELETE',
      withCredentials: true,
    }).pipe(
      catchError(this.errorInterceptor),
    );
  }
}
