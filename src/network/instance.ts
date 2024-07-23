import axios, {
	AxiosError,
	type AxiosInstance,
	type AxiosResponse,
	type CreateAxiosDefaults,
} from 'axios';

interface AxiosAPIs {
	instance: AxiosInstance;
	post: <T = any>(url: string, data?: any) => Promise<T>;
	get: <T = any>(url: string, params?: any) => Promise<T>;
}

/**
 * 创建一个基于给定基础URL的axios实例
 * @param baseUrl 基础URL
 * @returns axios实例
 */
export function createAxiosInstance(
	baseUrl: string,
	options?: CreateAxiosDefaults
): AxiosAPIs {
	const instance = axios.create({
		baseURL: baseUrl,
		timeout: 10000,
		headers: {
			'Content-Type': 'application/json',
			...(options?.headers || {}),
		},
	});

	// 添加请求拦截器
	instance.interceptors.request.use(
		(config) => {
			// 在发送请求之前做些什么，例如添加 token 到 header
			return config;
		},
		(error: AxiosError) => {
			// 处理请求错误
			return Promise.reject(error);
		}
	);

	// 添加响应拦截器
	instance.interceptors.response.use(
		(response: AxiosResponse) => {
			// 对响应数据做点什么
			return response.data;
		},
		(error: AxiosError) => {
			// 根据返回的错误码做不同的处理
			if (error.response) {
				switch (error.response.status) {
					case 400:
						// bad request
						break;
					case 401:
						// unauthorized
						break;
					case 403:
						// forbidden
						break;
					case 404:
						// not found
						break;
					default:
						// 其他错误处理
						break;
				}
			}
			return Promise.reject(error);
		}
	);

	const get = <T = any>(url: string, params?: any): Promise<T> => {
		return instance.get(url, { params });
	};

	// 封装 POST 请求
	const post = <T = any>(url: string, data?: any): Promise<T> => {
		return instance.post(url, data);
	};

	return {
		instance,
		post,
		get,
	};
}
