import { useEffect, useRef, useState } from "react";
import {
	Animated,
	FlatList,
	PanResponder,
	Pressable,
	StyleSheet,
	Text,
	View,
} from "react-native";
import ExpenseCard from "../components/ExpenseCard";
import { useExpenseStore } from "../store/useExpenseStore";

// HomeScreen displays the list of expenses and monthly summaries
const HomeScreen = ({ navigation }) => {
	const expenses = useExpenseStore((state) => state.expenses);
	const [_isOpen, setIsOpen] = useState(false);
	const [monthlyTotal, setMonthlyTotal] = useState(0);
	const [selectedMonth, setSelectedMonth] = useState(new Date());

	// Move to previous month
	const prevMonth = () => {
		setSelectedMonth(
			(prev) => new Date(prev.getFullYear(), prev.getMonth() - 1),
		);
	};

	// Move to next month
	const nextMonth = () => {
		setSelectedMonth(
			(prev) => new Date(prev.getFullYear(), prev.getMonth() + 1),
		);
	};

	// Detect if the bottom sheet is open based on animation value
	useEffect(() => {
		const id = sheetAnim.addListener(({ value }) => {
			setIsOpen(value > 10); // sheet considered open when value > 10
		});

		return () => {
			sheetAnim.removeListener(id);
		};
	}, []);

	// Recalculate the monthly total whenever data or selected month changes
	useEffect(() => {
		calculateMonthly();
	}, [expenses, selectedMonth]);

	// Filters expenses for the selected month and calculates total
	const calculateMonthly = () => {
		const currentMonth = selectedMonth.getMonth();
		const currentYear = selectedMonth.getFullYear();

		const thisMonthsExpenses = expenses.filter((exp) => {
			const d = new Date(exp.date);
			return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
		});

		const total = thisMonthsExpenses.reduce(
			(sum, exp) => sum + Number(exp.amount),
			0,
		);

		setMonthlyTotal(total);
	};

	// Calculates category totals for the selected month
	const totalsByCategory = expenses
		.filter((exp) => {
			const d = new Date(exp.date);
			return (
				d.getMonth() === selectedMonth.getMonth() &&
				d.getFullYear() === selectedMonth.getFullYear()
			);
		})
		.reduce((acc, exp) => {
			acc[exp.category] = (acc[exp.category] || 0) + Number(exp.amount);
			return acc;
		}, {});

	// Returns only expenses belonging to the selected month
	const expensesThisMonth = expenses.filter((exp) => {
		const d = new Date(exp.date);
		return (
			d.getMonth() === selectedMonth.getMonth() &&
			d.getFullYear() === selectedMonth.getFullYear()
		);
	});

	// Animated sheet
	const sheetHeight = 200; // max height the sheet can expand to
	const sheetAnim = useRef(new Animated.Value(0)).current; // 0 = closed

	// Handles the drag gesture for opening/closing the sheet
	const panResponder = useRef(
		PanResponder.create({
			onMoveShouldSetPanResponder: (_, gesture) => {
				return Math.abs(gesture.dy) > 5; // start tracking drag
			},
			onPanResponderMove: (_, gesture) => {
				let newVal = -gesture.dy;
				if (newVal < 0) newVal = 0;
				if (newVal > sheetHeight) newVal = sheetHeight;
				sheetAnim.setValue(newVal);
			},
			onPanResponderRelease: (_, gesture) => {
				if (gesture.dy < 0) {
					// dragged upwards → open sheet
					Animated.timing(sheetAnim, {
						toValue: sheetHeight,
						duration: 200,
						useNativeDriver: false,
					}).start();
				} else {
					// dragged downwards → close sheet
					Animated.timing(sheetAnim, {
						toValue: 0,
						duration: 200,
						useNativeDriver: false,
					}).start();
				}
			},
		}),
	).current;

	return (
		<View style={styles.container}>
			<Text style={styles.header}>My Expenses</Text>
			{/* Button to navigate to Add Expense */}
			<Pressable
				style={styles.button}
				onPress={() => navigation.navigate("AddExpense")}
			>
				<Text style={styles.buttonText}>Add Expense</Text>
			</Pressable>
			<View style={styles.headerRow}>
				{/* Change month */}
				<Pressable onPress={prevMonth} hitSlop={10}>
					<Text>◀</Text>
				</Pressable>
				<Text style={styles.monthText}>
					{selectedMonth.toLocaleDateString("en-US", {
						month: "long",
						year: "numeric",
					})}
				</Text>
				<Pressable onPress={nextMonth} hitSlop={10}>
					<Text>▶</Text>
				</Pressable>
			</View>

			{/* List of expenses for the selected month */}
			<FlatList
				data={expensesThisMonth}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => (
					<ExpenseCard
						expense={item}
						onPress={() => navigation.navigate("EditExpense", { id: item.id })}
					/>
				)}
				contentContainerStyle={{ paddingBottom: 225 }}
			/>

			{/* Monthly Summary Sheet */}
			<Animated.View
				style={[
					styles.sheet,
					{
						height: 120 + sheetAnim,
					},
				]}
				{...panResponder.panHandlers}
			>
				{/* Drag handle */}
				<View style={styles.handle} />

				<Text style={styles.header}>Monthly Summary</Text>

				<View style={styles.summaryBox}>
					<Text style={{ fontSize: 20 }}>Total expenses this month:</Text>
					<Text style={{ fontSize: 28, fontWeight: "bold" }}>
						{monthlyTotal} €
					</Text>
				</View>

				{/* Category totals (shown only when sheet is open) */}
				{sheetAnim._value > 0 && (
					<View style={{ marginTop: 10 }}>
						{Object.entries(totalsByCategory).map(([category, total]) => (
							<View key={category} style={styles.categoryRow}>
								<Text style={styles.categoryText}>{category}</Text>
								<Text style={styles.amountText}>{total.toFixed(2)} €</Text>
							</View>
						))}
					</View>
				)}
			</Animated.View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
		paddingTop: 50,
		backgroundColor: "#FCE4EC",
	},
	header: { fontSize: 24, fontWeight: "bold", marginBottom: 16, color: "#333" },
	button: {
		backgroundColor: "#F06292",
		paddingVertical: 12,
		paddingHorizontal: 20,
		borderRadius: 8,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
		marginBottom: 14,
	},
	buttonText: {
		color: "#fff",
		fontWeight: "bold",
		fontSize: 16,
	},
	headerRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 12,
	},
	monthText: { fontSize: 20, fontWeight: "bold", color: "#333" },
	sheet: {
		position: "absolute",
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: "#FCE4EC",
		borderTopLeftRadius: 12,
		borderTopRightRadius: 12,
		padding: 16,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: -2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 5,
		paddingBottom: 40,
	},
	handle: {
		width: 50,
		height: 6,
		backgroundColor: "#ccc",
		borderRadius: 3,
		alignSelf: "center",
		marginBottom: 8,
	},
	summaryBox: {
		marginTop: 10,
		padding: 20,
		backgroundColor: "#F06292",
		borderRadius: 30,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	categoryRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingVertical: 8,
		paddingHorizontal: 12,
		backgroundColor: "#FCE4EC",
		borderRadius: 8,
		marginBottom: 6,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 2,
	},
	categoryText: {
		color: "#333",
		fontWeight: 600,
	},
	amountText: {
		fontSize: 16,
		fontWeight: "bold",
		color: "#F06292",
	},
	header2: {
		fontWeight: "bold",
		color: "red",
		marginBottom: 3,
	},
});

export default HomeScreen;
