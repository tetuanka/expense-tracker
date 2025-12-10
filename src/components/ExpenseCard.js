import { Pressable, StyleSheet, Text } from "react-native";

/**
 * ExpenseCard
 * -------------------------
 * Displays a single expense item in the list
 * Tapping the card triggers navigation to the Edit screen
 */
const ExpenseCard = ({ expense, onPress }) => {
	return (
		<Pressable onPress={onPress} style={styles.card}>
			{/* Expense title */}
			<Text style={styles.title}>{expense.title}</Text>

			{/* Expense amount */}
			<Text style={styles.amount}>{expense.amount} €</Text>

			{/* Expense category */}
			<Text style={styles.category}>{expense.category}</Text>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	card: {
		padding: 12,
		marginVertical: 6,
		backgroundColor: "#ffffff",
		borderRadius: 8,
	},
	title: {
		fontWeight: "bold",
		fontSize: 16,
	},
	amount: {
		marginTop: 4,
		fontSize: 15,
	},
	category: {
		marginTop: 2,
		color: "#666",
		fontSize: 13,
	},
});

export default ExpenseCard;
