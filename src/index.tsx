import { ToastContainer } from 'react-toastify';

import styles from './index.module.less';

import 'react-toastify/dist/ReactToastify.css';

import Router from './routes';
function IndexSider() {
	return (
		<div className={styles.sider}>
			<Router />
			<ToastContainer />
		</div>
	);
}

export default IndexSider;
