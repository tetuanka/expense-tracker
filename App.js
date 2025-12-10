import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AddExpenseScreen from "./src/screens/AddExpenseScreen";
import EditExpenseScreen from "./src/screens/EditExpenseScreen";
import HomeScreen from "./src/screens/HomeScreen";

// Root-level navigation setup using React Navigation (native stack)
// All screens are registered here and made part of the navigation graph

const Stack = createNativeStackNavigator();

export default function App() {
	return (
		<NavigationContainer>
			<Stack.Navigator
				screenOptions={{
					headerStyle: { backgroundColor: "#FCE4EC" },
				}}
			>
				{/* Home screen acts as the main dashboard for expenses */}
				<Stack.Screen
					name="Home"
					component={HomeScreen}
					options={{ headerShown: false }}
				/>
				{/* Screen for creating new expenses */}
				<Stack.Screen name="AddExpense" component={AddExpenseScreen} />
				{/* Screen for editing expenses */}
				<Stack.Screen name="EditExpense" component={EditExpenseScreen} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}
