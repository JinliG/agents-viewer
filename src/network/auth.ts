import { createAxiosInstance } from '~/network/instance';

const { get, post } = createAxiosInstance(import.meta.env.VITE_CMS_BASE, {});

const userApiPath = '/api/customers';
const v1ApiPath = '/api/v1';

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

	googleAuth = (redirectUrl: string) => {
		return get<any>(`${v1ApiPath}/auth/google?redirectUrl=${redirectUrl}`);
	};

	googleAuthCallback = (data: any) => {
		return post<any>(`${v1ApiPath}/auth/google/callback`, data);
	};

	logout = () => {
		return post<any>(`${userApiPath}/logout`).then(() => {
			this.removeToken();
		});
	};

	refreshToken = () => {
		return post<any>(`${userApiPath}/refresh-token`).then((res) => {
			this.storeToken(res);
			return res;
		});
	};

	getCurrentUser = () => {
		return get<any>(
			`${userApiPath}/me`,
			{},
			{
				headers: {
					Authorization: `Bearer ${this.getToken()}`,
				},
			}
		);
	};
}

export default new AuthService();
