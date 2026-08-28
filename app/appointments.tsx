import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/config";

type Appointment = { id: string; doctorName?: string; date?: string; time?: string; status?: string };

export default function Appointments() {
  const { user, role } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadAppointments() {
    if (!user) { setLoading(false); return; }
    setLoading(true);
    try {
      const field = role === "doctor" ? "doctorId" : "patientId";
      const snapshot = await getDocs(query(collection(db, "appointments"), where(field, "==", user.uid)));
      setAppointments(snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as Appointment)));
    } catch (error: any) {
      Alert.alert("Appointments", error?.message || "Unable to load appointments.");
    } finally { setLoading(false); }
  }

  useEffect(() => { loadAppointments(); }, [user, role]);

  async function updateStatus(id: string, status: "approved" | "rejected") {
    try {
      await updateDoc(doc(db, "appointments", id), { status });
      setAppointments((current) => current.map((appointment) => appointment.id === id ? { ...appointment, status } : appointment));
    } catch (error: any) { Alert.alert("Appointment", error?.message || "Unable to update appointment."); }
  }

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#0F766E" /></View>;

  return <View style={styles.container}>
    <Text style={styles.title}>{role === "doctor" ? "Appointment Requests" : "My Appointments"}</Text>
    <FlatList data={appointments} keyExtractor={(item) => item.id} ListEmptyComponent={<Text style={styles.empty}>No appointments found.</Text>} renderItem={({ item }) => <View style={styles.card}>
      <Text style={styles.name}>Dr. {item.doctorName || "Doctor"}</Text>
      <Text>{item.date || "Date"} - {item.time || "Time"}</Text>
      <Text style={styles.status}>{item.status || "pending"}</Text>
      {role !== "doctor" && item.status === "approved" && <Text style={styles.approvedMessage}>Your appointment was approved by the doctor.</Text>}
      {role !== "doctor" && item.status === "rejected" && <Text style={styles.rejectedMessage}>Your appointment was rejected by the doctor.</Text>}
      {role === "doctor" && item.status === "pending" && <View style={styles.actions}>
        <TouchableOpacity style={styles.approve} onPress={() => updateStatus(item.id, "approved")}><Text style={styles.actionText}>Approve</Text></TouchableOpacity>
        <TouchableOpacity style={styles.reject} onPress={() => updateStatus(item.id, "rejected")}><Text style={styles.actionText}>Reject</Text></TouchableOpacity>
      </View>}
    </View>} />
  </View>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC", padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 28, fontWeight: "800", color: "#0F766E", marginBottom: 18 },
  card: { backgroundColor: "#FFF", padding: 20, borderRadius: 18, marginBottom: 12, borderWidth: 1, borderColor: "#E2E8F0" },
  name: { fontSize: 18, fontWeight: "800", marginBottom: 8 },
  status: { color: "#0F766E", fontWeight: "800", marginTop: 8 },
  empty: { color: "#64748B", textAlign: "center", marginTop: 40 },
  actions: { flexDirection: "row", gap: 10, marginTop: 16 },
  approve: { backgroundColor: "#0F766E", padding: 12, borderRadius: 10, flex: 1, alignItems: "center" },
  reject: { backgroundColor: "#DC2626", padding: 12, borderRadius: 10, flex: 1, alignItems: "center" },
  actionText: { color: "#FFF", fontWeight: "800" },
  approvedMessage: { color: "#15803D", fontWeight: "700", marginTop: 10 },
  rejectedMessage: { color: "#B91C1C", fontWeight: "700", marginTop: 10 },
});
