import { ToastContainer } from 'react-toastify';
import '~/styles/index.less';
import AuthContextProvider from './context/AuthContextProvider';
import AntdProvider from './context/AntdProvider';
import 'react-toastify/dist/ReactToastify.css';
import Router from './routes';

function App() {
	return (
		<AntdProvider>
			<AuthContextProvider>
				<div
					style={{
						height: '100%',
						position: 'fixed',
						top: 0,
						right: 0,
						left: 0,
						bottom: 0,
					}}
				>
					<Router />
					<ToastContainer />
				</div>
			</AuthContextProvider>
		</AntdProvider>
	);
}

export default App;
