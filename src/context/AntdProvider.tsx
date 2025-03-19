import { ConfigProvider } from 'antd';
import { FC, PropsWithChildren } from 'react';

const AntdProvider: FC<PropsWithChildren> = ({ children }) => {
	return (
		<ConfigProvider
			theme={{
				components: {
					Segmented: {
						trackBg: 'transparent',
						boxShadowTertiary: undefined,
						borderRadiusLG: 16,
						borderRadiusSM: 16,
						borderRadiusXS: 16,
					},
					Menu: {
						activeBarBorderWidth: 0,
						darkItemBg: 'transparent',
					},
					Button: {
						boxShadow: 'none',
						boxShadowSecondary: 'none',
						defaultShadow: 'none',
						dangerShadow: 'none',
						primaryShadow: 'none',
					},
				},
				token: {
					colorPrimary: '#fc5f3a',
				},
			}}
		>
			{children}
		</ConfigProvider>
	);
};

export default AntdProvider;
