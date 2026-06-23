import { Course, CourseSchedule } from "../types";

const DAY_INDEX: Record<CourseSchedule["day"], number> = {
	SUNDAY: 0,
	MONDAY: 1,
	TUESDAY: 2,
	WEDNESDAY: 3,
	THURSDAY: 4,
	FRIDAY: 5,
	SATURDAY: 6,
};

export const WEEKDAY_SHORT: Record<CourseSchedule["day"], string> = {
	MONDAY: "SEG",
	TUESDAY: "TER",
	WEDNESDAY: "QUA",
	THURSDAY: "QUI",
	FRIDAY: "SEX",
	SATURDAY: "SÁB",
	SUNDAY: "DOM",
};

export type ClassOccurrence = {
	course: Course;
	schedule: CourseSchedule;
	nextDate: Date;
	nextEndDate: Date | null;
};

function timeOnDate(base: Date, time: string): Date {
	const [hours, minutes, seconds] = time.split(":").map(Number);
	return new Date(
		base.getFullYear(),
		base.getMonth(),
		base.getDate(),
		hours,
		minutes,
		seconds ?? 0,
	);
}

export function getNextOccurrences(courses: Course[], now: Date): ClassOccurrence[] {
	const occurrences: ClassOccurrence[] = [];

	for (const course of courses) {
		for (const schedule of course.schedules) {
			const dayDiff = (DAY_INDEX[schedule.day] - now.getDay() + 7) % 7;
			const dayBase = new Date(now.getFullYear(), now.getMonth(), now.getDate() + dayDiff);
			const nextDate = timeOnDate(dayBase, schedule.startsAt);
			const nextEndDate = schedule.endsAt ? timeOnDate(dayBase, schedule.endsAt) : null;

			const hasEnded = nextEndDate ? now > nextEndDate : nextDate <= now;
			if (dayDiff === 0 && hasEnded) {
				nextDate.setDate(nextDate.getDate() + 7);
				nextEndDate?.setDate(nextEndDate.getDate() + 7);
			}

			occurrences.push({ course, schedule, nextDate, nextEndDate });
		}
	}

	return occurrences.sort((a, b) => a.nextDate.getTime() - b.nextDate.getTime());
}

export function formatTimeRange(start: Date, end: Date | null): string {
	const startLabel = start.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
	if (!end) return startLabel;
	const endLabel = end.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
	return `${startLabel} - ${endLabel}`;
}

export function formatDeadline(isoDatetime: string): string {
	const date = new Date(isoDatetime);
	const time = date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
	return `Não quebre agora. Faça o check-in antes das ${time}.`;
}

export function formatDateLabel(isoDate: string): string {
	const [year, month, day] = isoDate.split("-").map(Number);
	const date = new Date(year, month - 1, day);
	const weekday = date
		.toLocaleDateString("pt-BR", { weekday: "short" })
		.toUpperCase()
		.replace(/[.]/g, "");
	const monthStr = date
		.toLocaleDateString("pt-BR", { month: "short" })
		.toUpperCase()
		.replace(/[.]/g, "");
	return `${weekday} ${monthStr} ${String(day).padStart(2, "0")}`;
}
