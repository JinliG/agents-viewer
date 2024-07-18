import { ToastContainer } from 'react-toastify';

import AuthContextProvider from '~/context/AuthContextProvider';
import FeaturesContextProvider from '~/context/FeaturesContextProvider';

import styles from './index.module.less';

import 'react-toastify/dist/ReactToastify.css';

import Router from './routes';

function IndexSidePanel() {
	return (
		<AuthContextProvider>
			<FeaturesContextProvider>
				<div className={styles.sidePanel}>
					<Router />
					<ToastContainer />
				</div>
			</FeaturesContextProvider>
		</AuthContextProvider>
	);
}

export default IndexSidePanel;
