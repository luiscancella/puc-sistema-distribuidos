import { Colors } from "../constants/brand";

export const AVATAR_COLORS = [
	Colors.peach,
	Colors.mint,
	Colors.lav,
	Colors.sky,
	Colors.gold,
	Colors.rose,
] as const;

export function getInitials(name: string): string {
	return name
		.split(/\s+/)
		.map((w) => w[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();
}
