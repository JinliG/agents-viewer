export interface Feature {
	key: string;
	name: string;
	icon: string;
	botId?: string;
	botAvatar?: string;
	Comp: (props?: any) => React.JSX.Element;
}

export interface FeaturesContextProps {
	features: Feature[];
	currentFeature: Feature | null;
	loading: boolean;
	setCurrentFeature: (feature: Feature) => void;
}

export interface UserInfoProps {
	id: string;
	name: string;
	email: string;
	avatar: string;
	token: string;
}
