export const randomizeArray = <T>(arr: T[]): T[] => {
	const randomArr = [];
	const copyArr = [...arr];

	while (copyArr.length) {
		const randomIdx = Math.floor(Math.random() * copyArr.length);
		const [randomItem] = copyArr.splice(randomIdx, 1);
		randomArr.push(randomItem);
	}

	return randomArr;
};
