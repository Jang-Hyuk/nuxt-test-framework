namespace ifBase {
	export type AxiosInstance = import('@nuxtjs/axios').NuxtAxiosInstance;
	// export type AxiosReponse = import('axios').AxiosResponse;
	export type AxiosReponse<T = any, D = any> = {
		data: T;
		status?: number;
		statusText?: string;
		headers?: import('axios').AxiosResponseHeaders;
		config?: import('axios').AxiosRequestConfig<D>;
		request?: any;
	};
}
