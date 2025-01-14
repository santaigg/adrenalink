export default function groupBy<T>(
	array: T[],
	key: keyof T | ((item: T) => string),
): Record<string, T[]> {
	return array.reduce(
		(result, currentItem) => {
			const groupKey =
				typeof key === "function" ? key(currentItem) : String(currentItem[key]);
			if (!result[groupKey]) {
				result[groupKey] = [];
			}
			result[groupKey].push(currentItem);
			return result;
		},
		{} as Record<string, T[]>,
	);
}
