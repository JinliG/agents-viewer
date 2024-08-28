import React from 'react';
import { WechatWorkOutlined, TranslationOutlined } from '@ant-design/icons';
import { Affix } from 'antd';
import styled from 'styled-components';
import classNames from 'classnames';

const StyledDiv = styled.div`
	.test {
		background-color: red;
	}
`;

const ToolKits: React.FC<any> = () => {
	return (
		<StyledDiv>
			<Affix offsetBottom={100}>
				<div>
					<div className={classNames('marker', 'main-entry')}>
						<WechatWorkOutlined />
					</div>
					<div className='marker'>
						<TranslationOutlined />
					</div>
				</div>
			</Affix>
		</StyledDiv>
	);
};
export default ToolKits;
