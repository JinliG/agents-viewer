import { ToastContainer } from 'react-toastify';

import styles from './index.module.less';

import 'react-toastify/dist/ReactToastify.css';

import Router from './routes';

function IndexSidePanel() {
	return (
		<div className={styles.sidePanel}>
			<Router />
			<ToastContainer />
		</div>
	);
}

export default IndexSidePanel;
