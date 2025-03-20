import React, { useEffect, useState, useRef } from 'react';
import { Space, Card, Tag, Row, Col } from 'antd';
import { useDrag, useDrop } from 'react-dnd';
import styles from './index.module.less';
import { KitFeature } from '~/crx/types';
import { map } from 'lodash';

// 拖拽接口定义
const cardType = 'card';

interface DraggableCardProps {
	current: KitFeature;
	index: number;
	groupId: 'visible' | 'collapsed';
	groupItems: KitFeature[];
	setGroupItems: (items: KitFeature[]) => void;
	anotherGroupItems: KitFeature[];
	setAnotherGroupItems: (items: KitFeature[]) => void;
	onDragEnd?: () => void;
}

// 卡片组件
const DraggableCard = ({
	current,
	index,
	groupId,
	groupItems: targetGroupItems,
	anotherGroupItems,
	setGroupItems,
	setAnotherGroupItems,
	onDragEnd,
}: DraggableCardProps) => {
	const cardRef = useRef<HTMLDivElement>(null);

	const [{ handlerId }, drop] = useDrop({
		accept: cardType,
		collect(monitor) {
			return {
				handlerId: monitor.getHandlerId(),
			};
		},
		hover(dragItem: any, monitor) {
			if (!cardRef.current) {
				return;
			}
			const hoverBoundingRect = cardRef.current?.getBoundingClientRect();
			if (!hoverBoundingRect) {
				return;
			}

			const hoverMiddleY =
				(hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
			const clientOffset = monitor.getClientOffset();
			const hoverClientY = (clientOffset as any)?.y - hoverBoundingRect.top;

			const dragIndex = dragItem.index;
			const hoverIndex = index;
			// 只处理同组排序
			if (dragItem.groupId === groupId) {
				if (dragIndex === hoverIndex) {
					return;
				}
				if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
					return;
				}
				if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
					return;
				}

				const [removed] = targetGroupItems.splice(dragIndex, 1);
				if (removed) {
					targetGroupItems.splice(hoverIndex, 0, removed);
				}
				setGroupItems([...targetGroupItems]);
				dragItem.index = hoverIndex;
				return;
			}

			// 跨组排序
			const [removed] = anotherGroupItems.splice(dragIndex, 1);
			if (hoverClientY > hoverMiddleY) {
				// 追加 dragItem 到 hoverIndex 后面
				targetGroupItems.splice(hoverIndex, 0, removed);
			} else {
				// 追加 dragItem 到 hoverIndex 前面
				targetGroupItems.splice(hoverIndex + 1, 0, removed);
			}
			setGroupItems([...targetGroupItems]);
			setAnotherGroupItems([...anotherGroupItems]);

			dragItem.index = hoverIndex;
			dragItem.groupId = groupId;
		},
	});

	const [{ isDragging }, drag] = useDrag({
		type: cardType,
		item: { ...current, index, groupId },
		collect: (monitor) => ({
			isDragging: monitor.isDragging(),
		}),
		end: () => {
			// 生成新的 KitFeatures
			onDragEnd?.();
		},
	});

	const opacity = isDragging ? 0 : 1;

	// 使用 ref 确保 drag(drop(ref.current)) 是有效的 DOM 元素
	drag(drop(cardRef));

	return (
		<Card
			ref={cardRef}
			className={styles.card}
			key={current.key}
			size='small'
			title={
				<Space>
					<div>{current.label}</div>
					{current.isDefault && (
						<Tag bordered={false} style={{ fontWeight: 400, fontSize: 12 }}>
							预置
						</Tag>
					)}
				</Space>
			}
			content={null}
			style={{ opacity }}
		>
			{current.description && <pre>{current.description}</pre>}
		</Card>
	);
};

interface FeaturesManagerProps {
	kitFeatures: KitFeature[];
	updateKitFeatures: (values: any) => void;
}

const FeatureManager = ({
	kitFeatures = [],
	updateKitFeatures,
}: FeaturesManagerProps) => {
	const [visibleGroup, setVisibleGroup] = useState<KitFeature[]>([]);
	const [collapsedGroup, setCollapsedGroup] = useState<KitFeature[]>([]);

	useEffect(() => {
		const collapsedGroup = kitFeatures.filter((item) => item.isCollapsed);
		const visibleGroup = kitFeatures.filter((item) => !item.isCollapsed);
		setVisibleGroup(visibleGroup);
		setCollapsedGroup(collapsedGroup);
	}, [kitFeatures]);

	const handleResetKitFeatures = () => {
		updateKitFeatures({
			kitFeatures: [
				...map(visibleGroup, (item) => ({ ...item, isCollapsed: false })),
				...map(collapsedGroup, (item) => ({ ...item, isCollapsed: true })),
			],
		});
	};

	return (
		<Row className={styles.manager}>
			<Col span={8}>
				<div className={styles.coTitle}>在快捷菜单显示</div>
				<div className={styles.list}>
					{visibleGroup.map((feature, index) => (
						<DraggableCard
							key={feature.key}
							index={index}
							current={feature}
							groupId='visible'
							groupItems={visibleGroup}
							setGroupItems={setVisibleGroup}
							anotherGroupItems={collapsedGroup}
							setAnotherGroupItems={setCollapsedGroup}
							onDragEnd={handleResetKitFeatures}
						/>
					))}
				</div>
			</Col>
			<Col span={8}>
				<div className={styles.coTitle}>在快捷菜单收起</div>
				<div className={styles.list}>
					{collapsedGroup.map((feature, index) => (
						<DraggableCard
							key={feature.key}
							index={index}
							current={feature}
							groupId='collapsed'
							groupItems={collapsedGroup}
							setGroupItems={setCollapsedGroup}
							anotherGroupItems={visibleGroup}
							setAnotherGroupItems={setVisibleGroup}
							onDragEnd={handleResetKitFeatures}
						/>
					))}
				</div>
			</Col>
		</Row>
	);
};

export default FeatureManager;
