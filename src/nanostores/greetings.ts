import { atom, batched } from "nanostores";
import { TTL_TIME, getGreetings } from "../models/greetings";
import { $settings } from "./settings";

export const $greetings = atom<string>("");

const $greetingsValues = batched(
	$settings,
	({
		greetingNight,
		greetingMorning,
		greetingAfternoon,
		greetingEvening,
		name,
	}) =>
		JSON.stringify({
			greetingNight,
			greetingMorning,
			greetingAfternoon,
			greetingEvening,
			name,
		}),
);

$greetingsValues.subscribe((value) => {
	const { name, ...greetings } = JSON.parse(value);

	updateGreetings(name, greetings);

	const intervalId = setInterval(
		() => updateGreetings(name, greetings),
		TTL_TIME,
	);
	return () => clearInterval(intervalId);
});

function updateGreetings(name: string, greetings) {
	$greetings.set(getGreetingsMessage(name, greetings));
}

function getGreetingsMessage(name: string, greetings) {
	const message = getGreetings(greetings);
	if (!!name) {
		return `${message}, ${name}`;
	}
	return message;
}
