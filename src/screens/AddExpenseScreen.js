import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import {
	Alert,
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	View,
} from "react-native";
import { useExpenseStore } from "../store/useExpenseStore";

const AddExpenseScreen = ({ navigation }) => {
	// Local state for user input
	const [title, setTitle] = useState("");
	const [amount, setAmount] = useState("");
	const [category, setCategory] = useState("");

	// Zustand action for adding a new expense
	const addExpense = useExpenseStore((state) => state.addExpense);

	// Validate fields and save new expense
	const handleAdd = () => {
		if (!title || !amount || !category) {
			Alert.alert("Error", "Please fill all fields");
			return;
		}

		// Create a new expense object
		const newExpense = {
			id: Date.now().toString(),
			title,
			amount: parseFloat(amount),
			category,
			date: new Date().toISOString(), // standard ISO date format
		};

		addExpense(newExpense); // save to global state

		// Clear input fields
		setTitle("");
		setAmount("");
		setCategory("");

		// Return to previous screen
		navigation.goBack();
	};

	return (
		<View style={styles.container}>
			<Text style={styles.header}>Add New Expense</Text>

			{/* Expense title input */}
			<TextInput
				style={styles.input}
				placeholder="Title"
				value={title}
				onChangeText={setTitle}
			/>

			{/* Expense amount input */}
			<TextInput
				style={styles.input}
				placeholder="Amount"
				keyboardType="numeric"
				value={amount}
				onChangeText={setAmount}
			/>

			{/* Category selector */}
			<View style={styles.pickerWrapper}>
				<Picker
					selectedValue={category}
					onValueChange={(value) => setCategory(value)}
				>
					<Picker.Item label="Category" value="" color="#999" />
					<Picker.Item label="Food" value="Food" />
					<Picker.Item label="Transport" value="Transport" />
					<Picker.Item label="Shopping" value="Shopping" />
					<Picker.Item label="Bills" value="Bills" />
					<Picker.Item label="Other" value="Other" />
				</Picker>
			</View>

			{/* Submit button */}
			<Pressable style={styles.button} onPress={handleAdd}>
				<Text style={styles.buttonText}>Add Expense</Text>
			</Pressable>
		</View>
	);
};

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16, backgroundColor: "#FFF0F5" },
	header: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
	input: {
		backgroundColor: "#FFFAFD",
		borderWidth: 1,
		borderColor: "#ccc",
		padding: 12,
		marginBottom: 12,
		borderRadius: 8,
	},
	pickerWrapper: {
		backgroundColor: "#FFFAFD",
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 8,
		marginBottom: 12,
	},
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
		marginBottom: 16,
	},
	buttonText: {
		color: "#fff",
		fontWeight: "bold",
		fontSize: 16,
	},
});

export default AddExpenseScreen;
