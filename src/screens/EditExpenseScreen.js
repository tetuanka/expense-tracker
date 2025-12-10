import { MaterialIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useNavigation, useRoute } from "@react-navigation/native";
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

const EditExpenseScreen = () => {
	const route = useRoute();
	const navigation = useNavigation();
	const { id } = route.params;

	const expenses = useExpenseStore((state) => state.expenses);
	const updateExpense = useExpenseStore((state) => state.updateExpense);
	const deleteExpense = useExpenseStore((state) => state.deleteExpense);

	// Find the expense that is being edited
	const expense = expenses.find((e) => e.id === id);

	// Local state for editable fields
	const [title, setTitle] = useState(expense?.title || "");
	const [amount, setAmount] = useState(expense?.amount.toString() || "");
	const [category, setCategory] = useState(expense?.category || "");

	// Save updated values
	const handleSave = () => {
		if (!title || !amount || !category) {
			Alert.alert("Error", "Please fill out all fields.");
			return;
		}

		updateExpense(id, {
			title,
			amount: parseFloat(amount),
			category,
		});

		navigation.goBack();
	};

	// Delete expense confirmation popup
	const handleDelete = () => {
		Alert.alert("Delete Expense", "Are you sure you want to delete this?", [
			{ text: "Cancel", style: "cancel" },
			{
				text: "Delete",
				style: "destructive",
				onPress: () => {
					deleteExpense(id);
					navigation.goBack();
				},
			},
		]);
	};

	return (
		<View style={styles.container}>
			<Text style={styles.header}>Edit Expense</Text>

			<TextInput
				style={styles.input}
				value={title}
				onChangeText={setTitle}
				placeholder="Title"
			/>

			<TextInput
				style={styles.input}
				value={amount}
				onChangeText={setAmount}
				keyboardType="numeric"
				placeholder="Amount"
			/>

			{/* Category picker */}
			<View style={styles.pickerWrapper}>
				<Picker selectedValue={category} onValueChange={(v) => setCategory(v)}>
					<Picker.Item label="Food" value="Food" />
					<Picker.Item label="Transport" value="Transport" />
					<Picker.Item label="Shopping" value="Shopping" />
					<Picker.Item label="Bills" value="Bills" />
					<Picker.Item label="Other" value="Other" />
				</Picker>
			</View>

			{/* Save button */}
			<Pressable style={styles.saveButton} onPress={handleSave}>
				<Text style={styles.buttonText}>Save</Text>
			</Pressable>

			<View style={{ height: 12 }} />

			{/* Delete button */}
			<Pressable style={styles.deleteButton} onPress={handleDelete}>
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<MaterialIcons
						name="delete"
						size={20}
						color="#fff"
						style={{ marginRight: 8 }}
					/>
					<Text style={styles.buttonText}>Delete</Text>
				</View>
			</Pressable>
		</View>
	);
};

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16, backgroundColor: "#FFF0F5" },
	header: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
	input: {
		borderWidth: 1,
		borderColor: "#ccc",
		marginBottom: 12,
		padding: 12,
		borderRadius: 8,
		backgroundColor: "#FFFAFD",
	},
	pickerWrapper: {
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 8,
		marginBottom: 12,
		backgroundColor: "#FFFAFD",
	},
	saveButton: {
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
	},
	deleteButton: {
		backgroundColor: "#9E9E9E",
		paddingVertical: 12,
		paddingHorizontal: 20,
		borderRadius: 8,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
		flexDirection: "row",
		justifyContent: "center",
	},
	buttonText: {
		color: "#fff",
		fontWeight: "bold",
		fontSize: 16,
	},
});

export default EditExpenseScreen;
