import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  HttpStatusCode,
} from "axios";
import { getToken } from "../../stores/User.store";
import Response from "./response";

const envVars = import.meta.env;

class Fetcher {
  private static URL =
    (envVars.VITE_ENV === "DEV"
      ? envVars.VITE_URL_DEV
      : envVars.VITE_URL_PROD) + envVars.VITE_BASE_URI;

  public static async makeRequest<T>(
    options: AxiosRequestConfig
  ): Promise<Response<T>> {
    try {
      const response = await axios(options);
      return Fetcher.formatResponse<T>(response, true);
    } catch (error_) {
      const error = error_ as any;
      const errorMsg = JSON.parse(error.request.response).message;

      return this.handleError<T>(error as AxiosError);
    }
  }

  public static async get<T>(
    uri: string,
    params: object = {},
    headers: object = {},
    isAuth = true
  ): Promise<Response<T>> {
    // Build request
    const options: AxiosRequestConfig = {
      url: this.buildURL(uri, params),
      method: "get",
      headers: this.getFinalHeaders(headers, isAuth),
    };

    return this.makeRequest<T>(options);
  }

  public static async post<T>(
    uri: string,
    params: object = {},
    headers: object = {},
    isAuth = true
  ): Promise<Response<T>> {
    // Build request
    const options: AxiosRequestConfig = {
      url: this.buildURL(uri, {}),
      method: "post",
      headers: this.getFinalHeaders(headers, isAuth),
      data: params,
    };

    return this.makeRequest<T>(options);
  }

  public static async patch<T>(
    uri: string,
    params: object = {},
    headers: object = {},
    isAuth = true
  ): Promise<Response<T>> {
    // Build request
    const options: AxiosRequestConfig = {
      url: this.buildURL(uri, {}),
      method: "patch",
      headers: this.getFinalHeaders(headers, isAuth),
      data: params,
    };

    return this.makeRequest<T>(options);
  }

  public static async put<T>(
    uri: string,
    params: object = {},
    headers: object = {},
    isAuth = true
  ): Promise<Response<T>> {
    // Build request
    const options: AxiosRequestConfig = {
      url: this.buildURL(uri, {}),
      method: "put",
      headers: this.getFinalHeaders(headers, isAuth),
      data: params,
    };

    return this.makeRequest<T>(options);
  }

  public static async delete<T>(
    uri: string,
    params: object = {},
    headers: object = {},
    isAuth = true
  ): Promise<Response<T>> {
    // Build request
    const options: AxiosRequestConfig = {
      url: this.buildURL(uri, params),
      method: "delete",
      headers: this.getFinalHeaders(headers, isAuth),
    };

    return this.makeRequest<T>(options);
  }

  private static getFinalHeaders(headers: object, isAuth: boolean): object {
    let finalHeaders = { ...headers };
    const token = getToken();

    isAuth = isAuth && token !== null;

    if (isAuth) {
      finalHeaders = {
        Authorization: `Bearer ${token}`,
        ...headers,
      };
    }
    return finalHeaders;
  }

  private static buildURL(pathname: string, search: object) {
    return this.URL + pathname + this.buildURLParamsFromObject(search);
  }

  private static isRequestSuccess = (code: number): boolean => {
    return code >= 200 && code < 300;
  };

  private static formatResponse<T>(
    axiosResponse: AxiosResponse<any, any>,
    noMessage = false
  ): Response<T> {
    const data = axiosResponse.data.data ?? axiosResponse.data;

    if (noMessage) {
      return {
        ok: this.isRequestSuccess(axiosResponse.status),
        code: axiosResponse.status,
        data,
      };
    }

    return {
      ok: this.isRequestSuccess(axiosResponse.status),
      message: axiosResponse.statusText,
      code: axiosResponse.status,
      data,
    };
  }

  private static buildURLParamsFromObject(params: object): string {
    if (Object.keys(params).length > 0) {
      const strParams: Record<string, string> = {};
      for (const [key, value] of Object.entries(params)) {
        if (value?.toString()?.length > 0) {
          strParams[key] = value.toString();
        }
      }
      return "?" + new URLSearchParams(strParams).toString();
    }
    return "";
  }

  private static handleError<T>(error: AxiosError): Promise<Response<T>> {
    const message = ((error.response?.data as any) ?? { message: "" }).message;

    if (error.response)
      return Promise.reject({
        message,
        ok: false,
        code: error.response.status,
      });
    return Promise.reject({
      message: error.message,
      ok: false,
      code: HttpStatusCode.InternalServerError,
    });
  }
}

export default Fetcher;
