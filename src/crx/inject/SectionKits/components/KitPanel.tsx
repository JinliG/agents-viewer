import React from 'react';
import { styled } from 'styled-components';
import { KitFeature } from '..';

const StyledDiv = styled.div``;

interface KitPanelProps {
	[key: string]: any;
	selectionText: string;
	feature: KitFeature;
}

const KitPanel: React.FC<KitPanelProps> = ({ feature }) => {
	const { label } = feature;
	return (
		<StyledDiv>
			<div className='header'>{label}</div>
			<div className='content'></div>
			<div className='footer'></div>
		</StyledDiv>
	);
};
export default KitPanel;
