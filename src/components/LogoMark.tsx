import Svg, { Circle, Rect } from "react-native-svg";
import { Colors } from "../constants/brand";

interface Props {
    size?: number;
}

export default function LogoMark({ size = 72 }: Props) {
    return (
        <Svg width={size} height={size} viewBox="0 0 32 32">
            <Rect width={32} height={32} rx={10} fill={Colors.peach} />
            <Circle cx={14} cy={14} r={7} fill="none" stroke={Colors.ink} strokeWidth={3} />
            <Circle cx={22} cy={22} r={3} fill={Colors.ink} />
        </Svg>
    );
}
