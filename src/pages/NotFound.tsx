import React from 'react';

const NotFound: React.FC = () => {
	return (
		<div>
			<h1>404 - Page Not Found</h1>
			<p>The page you are looking for does not exist.</p>
			<a href='/'>回到首页</a>
		</div>
	);
};

export default NotFound;
