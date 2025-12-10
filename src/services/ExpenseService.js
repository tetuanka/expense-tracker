import AsyncStorage from "@react-native-async-storage/async-storage";

// Key under which all expense data is stored in AsyncStorage
const STORAGE_KEY = "@expenses";

/**
 * Fetches all stored expenses from AsyncStorage
 * Returns an empty array if storage is empty or loading fails
 */

export const getExpenses = async () => {
	try {
		const stored = await AsyncStorage.getItem(STORAGE_KEY);
		return stored ? JSON.parse(stored) : [];
	} catch (e) {
		console.log("Load error", e);
		return [];
	}
};

/**
 * Saves a new expense item to storage
 * Generates a unique id and timestamps the entry automatically
 */
export const saveExpense = async (expense) => {
	try {
		const expenses = await getExpenses();

		const newExpense = {
			...expense,
			id: Date.now().toString(),
			date: new Date().toISOString(),
		};

		expenses.push(newExpense);
		console.log(expenses);

		await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
	} catch (e) {
		console.log("Save error", e);
	}
};

/**
 * Deletes an expense by id
 * Stores back the filtered list
 */
export const deleteExpense = async (id) => {
	try {
		const expenses = await getExpenses();
		const filtered = expenses.filter((exp) => exp.id !== id);

		await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
	} catch (e) {
		console.log("Delete error", e);
	}
};

/**
 * Updates an existing expense
 * Matches by id and replaces the object with the passed updated version
 */
export const updateExpense = async (updatedExpense) => {
	try {
		const expenses = await getExpenses();

		const updatedList = expenses.map((exp) =>
			exp.id === updatedExpense.id ? updatedExpense : exp,
		);

		await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
	} catch (e) {
		console.log("Update error", e);
	}
};

/**
 * Clears all stored expense data
 */
export const clearExpenses = async () => {
	try {
		await AsyncStorage.removeItem(STORAGE_KEY);
	} catch (e) {
		console.log("Clear error", e);
	}
};
