import { createAxiosInstance } from '~/network/instance';

const { get, post } = createAxiosInstance(import.meta.env.VITE_CMS_BASE, {
	// headers: {
	// 	Authorization: `Bearer ${import.meta.env.VITE_COZE_API_KEY}`,
	// },
});

interface RegisterParams {
	name: string;
	email: string;
	phone: string;
	[key: string]: any;
}

interface RegisterRes {
	message: string;
	doc: any;
}

interface LoginParams {
	[key: string]: any;
}

interface LoginRes {
	message: string;
	user: any;
	token: string;
	exp: number;
}

const userApiPath = '/api/customers';
const accessTokenKey = 'avr_access_token';

class AuthService {
	storeToken = (token: string) => {
		localStorage.setItem(accessTokenKey, token);
	};

	removeToken = () => {
		localStorage.removeItem(accessTokenKey);
	};

	getToken = () => {
		return localStorage.getItem(accessTokenKey);
	};
	register = (params: RegisterParams) => {
		return post<RegisterRes>(`${userApiPath}`, params);
	};

	login = (params: LoginParams) => {
		return post<LoginRes>(`${userApiPath}/login`, params).then((res) => {
			this.storeToken(res.token);
			return res;
		});
	};

	logout = (params: any) => {
		return post<any>(`${userApiPath}/logout`, params).then(() => {
			this.removeToken();
		});
	};

	refreshToken = () => {
		return post<any>(`${userApiPath}/refresh-token`).then((res) => {
			this.storeToken(res);
			return res;
		});
	};

	verifyToken = () => {
		const access_token = this.getToken();
		return post<any>(`${userApiPath}/verify/${access_token}`);
	};

	getUserInfo = () => {
		return get<any>(`${userApiPath}/me`);
	};
}

export default new AuthService();
