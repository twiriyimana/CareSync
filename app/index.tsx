import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function Index() {
	const { user, role, loading } = useAuth();
	if (loading) {
		return <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}><ActivityIndicator size="large" color="#0F766E" /></View>;
	}

	if (!user) return <Redirect href="/onboarding" />;
	if (role === "doctor") return <Redirect href="/doctor" />;
	if (role === "admin") return <Redirect href="/admin" />;
	if (role === null) return <Redirect href="/login" />;
	return <Redirect href="/patient" />;
}