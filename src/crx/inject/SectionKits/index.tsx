import React from 'react';
import styled from 'styled-components';
import {
	BookOutlined,
	SoundOutlined,
	TranslationOutlined,
} from '@ant-design/icons';

const StyledDiv = styled.div`
	position: absolute;

	.section-kits {
		position: absolute;
		display: flex;
		align-items: center;
		gap: 8px;
		background: #fff;
		border-radius: 4px;
		border: 0.5px solid #ccc;
		box-shadow: 0 2px 4px #dddddd;
		padding: 4px;

		.feature {
			.icon {
				font-size: 12px;
			}
		}
	}
`;

interface SectionKitsProps {
	rect: DOMRect;
	sectionText: string;
}
const SectionKits: React.FC<SectionKitsProps> = ({ rect, sectionText }) => {
	const { top, left } = rect;
	return (
		<StyledDiv>
			<div className='section-kits' style={{ top: top + window.scrollY, left }}>
				<div className='feature'>
					<TranslationOutlined className='icon' />
				</div>
				<div className='feature'>
					<BookOutlined className='icon' />
				</div>
				<div className='feature'>
					<SoundOutlined className='icon' />
				</div>
			</div>
		</StyledDiv>
	);
};
export default SectionKits;
