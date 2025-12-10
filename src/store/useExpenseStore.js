import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// Global expense store using Zustand with persistence
// All expenses and CRUD actions live here, shared across the app

export const useExpenseStore = create(
	persist(
		(set, get) => ({
			// List of all expenses
			expenses: [],

			// Add a new expense to the list
			addExpense: (expense) => set({ expenses: [...get().expenses, expense] }),

			// Remove all expenses (used for debugging/testing
			clearExpenses: () => set({ expenses: [] }),

			// Update a single expense by ID
			updateExpense: (id, updatedFields) =>
				set((state) => ({
					expenses: state.expenses.map((exp) =>
						exp.id === id ? { ...exp, ...updatedFields } : exp,
					),
				})),

			// Delete an expense by ID
			deleteExpense: (id) =>
				set((state) => ({
					expenses: state.expenses.filter((exp) => exp.id !== id),
				})),
		}),
		{
			name: "expense-storage",

			// Persist the store in AsyncStorage as JSON
			storage: createJSONStorage(() => AsyncStorage),
		},
	),
);
