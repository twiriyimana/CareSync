import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Messages() {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.back}>Back</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Messages</Text>
      <Text style={styles.empty}>No messages yet.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC", padding: 20 },
  back: { color: "#0F766E", fontWeight: "700", marginBottom: 24 },
  title: { color: "#0F766E", fontSize: 28, fontWeight: "800" },
  empty: { color: "#64748B", textAlign: "center", marginTop: 48 },
});
