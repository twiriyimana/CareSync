import {
  addDoc,
  collection,
  getDocs,
} from "firebase/firestore";

import { useState, useEffect } from "react";

import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { serverTimestamp } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/config";

export default function Doctors() {
  const [d, setD] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    /*
    // Firebase - TEMPORARILY DISABLED

    getDocs(collection(db, "doctors"))
      .then((s) =>
        setD(
          s.docs.map((x) => ({
            id: x.id,
            ...x.data(),
          }))
        )
      )
      .finally(() => setLoading(false));
    */

    setD([
      {
        id: "1",
        name: "John Doe",
        specialization: "Cardiologist",
        experience: 8,
        photo: require("../assets/doctors/pers1.jpg"),
      },
      {
        id: "2",
        name: "Sarah Grace",
        specialization: "General Practitioner",
        experience: 5,
        photo: require("../assets/doctors/pers2.jpg"),
      },
      {
        id: "3",
        name: "David Eric",
        specialization: "Pediatrician",
        experience: 6,
        photo: require("../assets/doctors/perso3.jpg"),
      },
    ]);

    setLoading(false);
  }, []);

  const f = d.filter((x) =>
    `${x.name || ""} ${x.specialization || ""}`
      .toLowerCase()
      .includes(q.toLowerCase())
  );

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  function openBooking(doctor: any) {
    setSelectedDoctor(doctor);
    setBookingDate("");
    setBookingTime("");
    setBookingOpen(true);
  }

  function closeBooking() {
    setBookingOpen(false);
    setSelectedDoctor(null);
  }

  async function confirmBooking() {
    if (!bookingDate.trim() || !bookingTime.trim()) {
      Alert.alert("Missing info", "Please enter both a date and a time.");
      return;
    }

    setSubmitting(true);

    try {
      if (!user) {
        Alert.alert("Not logged in", "Please log in to book an appointment.");
        setSubmitting(false);
        return;
      }

      await addDoc(collection(db, "appointments"), {
        patientId: user.uid,
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        date: bookingDate.trim(),
        time: bookingTime.trim(),
        status: "pending",
        createdAt: serverTimestamp(),
      });

      Alert.alert(
        "Appointment Booked!",
        `Your appointment with Dr. ${selectedDoctor?.name} on ${bookingDate} at ${bookingTime} has been requested. You'll be notified once it's confirmed.`,
        [{ text: "OK" }]
      );
      closeBooking();
    } catch (error) {
      Alert.alert("Booking failed", "Please try again later.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <View style={s.center}>
        <ActivityIndicator size="large" color="#0F766E" />
      </View>
    );
  }

  return (
    <View style={s.c}>
      <Text style={s.title}>Find a Doctor</Text>

      <TextInput
        style={s.search}
        placeholder="Search doctor or specialization"
        value={q}
        onChangeText={setQ}
      />

      <FlatList
        data={f}
        keyExtractor={(x) => x.id}
        ListEmptyComponent={<Text style={s.empty}>No doctors found.</Text>}
        renderItem={({ item }) => (
          <View style={s.card}>
            <View style={s.row}>
              {item.photo ? (
                <Image source={item.photo} style={s.avatar} />
              ) : (
                <View style={s.avatarFallback}>
                  <Text style={s.avatarInitials}>
                    {getInitials(item.name || "Dr")}
                  </Text>
                </View>
              )}

              <View style={s.details}>
                <Text style={s.name}>Dr. {item.name || "Doctor"}</Text>
                <Text style={s.spec}>
                  {item.specialization || "General Practitioner"}
                </Text>
                <Text style={s.info}>
                  Experience: {item.experience || 0} years
                </Text>
              </View>
            </View>

            <TouchableOpacity style={s.b} onPress={() => openBooking(item)}>
              <Text style={s.bt}>Book Appointment</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <Modal
        visible={bookingOpen}
        animationType="slide"
        transparent
        onRequestClose={closeBooking}
      >
        <View style={s.modalOverlay}>
          <View style={s.modalCard}>
            <Text style={s.modalTitle}>
              Book with Dr. {selectedDoctor?.name}
            </Text>
            <Text style={s.modalSub}>{selectedDoctor?.specialization}</Text>

            <Text style={s.label}>Date</Text>
            <TextInput
              style={s.input}
              placeholder="e.g. 2026-09-02"
              value={bookingDate}
              onChangeText={setBookingDate}
            />

            <Text style={s.label}>Time</Text>
            <TextInput
              style={s.input}
              placeholder="e.g. 10:30 AM"
              value={bookingTime}
              onChangeText={setBookingTime}
            />

            <TouchableOpacity
              style={[s.confirmBtn, submitting && { opacity: 0.6 }]}
              onPress={confirmBooking}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={s.confirmText}>Confirm Booking</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={s.cancelBtn}
              onPress={closeBooking}
              disabled={submitting}
            >
              <Text style={s.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  c: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0F766E",
    marginBottom: 15,
  },
  search: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    padding: 15,
    marginBottom: 15,
  },
  card: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 14,
    backgroundColor: "#E2E8F0",
  },
  avatarFallback: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 14,
    backgroundColor: "#0F766E",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarInitials: {
    color: "#FFF",
    fontWeight: "800",
    fontSize: 18,
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: 19,
    fontWeight: "800",
  },
  spec: {
    color: "#0F766E",
    fontWeight: "700",
    marginTop: 4,
  },
  info: {
    color: "#64748B",
    marginTop: 7,
  },
  b: {
    backgroundColor: "#0F766E",
    padding: 13,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 14,
  },
  bt: {
    color: "#FFF",
    fontWeight: "800",
  },
  empty: {
    textAlign: "center",
    color: "#64748B",
    marginTop: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.5)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
  },
  modalSub: {
    color: "#0F766E",
    fontWeight: "600",
    marginBottom: 18,
  },
  label: {
    fontWeight: "700",
    marginBottom: 6,
    color: "#334155",
  },
  input: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
  },
  confirmBtn: {
    backgroundColor: "#0F766E",
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 6,
  },
  confirmText: {
    color: "#FFF",
    fontWeight: "800",
    fontSize: 15,
  },
  cancelBtn: {
    alignItems: "center",
    padding: 14,
  },
  cancelText: {
    color: "#64748B",
    fontWeight: "700",
  },
});