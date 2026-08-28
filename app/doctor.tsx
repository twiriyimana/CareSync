import { router } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/config";

import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Firebase - TEMPORARILY DISABLED
// import { signOut } from "firebase/auth";
// import { auth } from "../firebase/config";

export default function Doctor() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ appointments: 0, patients: 0, pending: 0, completed: 0 });

  useEffect(() => {
    if (!user) return;
    getDocs(query(collection(db, "appointments"), where("doctorId", "==", user.uid)))
      .then((snapshot) => {
        const appointments = snapshot.docs.map((item) => item.data());
        setStats({
          appointments: appointments.length,
          patients: new Set(appointments.map((item) => item.patientId).filter(Boolean)).size,
          pending: appointments.filter((item) => item.status === "pending").length,
          completed: appointments.filter((item) => item.status === "completed").length,
        });
      })
      .catch(() => setStats({ appointments: 0, patients: 0, pending: 0, completed: 0 }));
  }, [user]);

  async function logout() {
    // Firebase logout - TEMPORARILY DISABLED

    /*
    await signOut(auth);
    */

    // Temporary logout navigation
    router.replace("/login");
  }

  return (
    <ScrollView
      style={s.c}
      contentContainerStyle={{ padding: 20 }}
    >
      {/* Header */}
      <Text style={s.brand}>CareSync</Text>
      <Text style={s.sub}>Doctor Dashboard</Text>

      {/* Welcome Banner */}
      <View style={s.banner}>
        <Text style={s.title}>
          Good morning, Doctor 👋
        </Text>

        <Text>
          Manage your patients and appointments.
        </Text>
      </View>

      {/* Statistics */}
      <View style={s.grid}>
        <S
          t="Today's Appointments"
          v={String(stats.appointments)}
        />

        <S
          t="Total Patients"
          v={String(stats.patients)}
        />

        <S
          t="Pending Requests"
          v={String(stats.pending)}
        />

        <S
          t="Completed"
          v={String(stats.completed)}
        />
      </View>

      {/* Quick Actions */}
      <Text style={s.sec}>
        Quick Actions
      </Text>

      {[
        ["Appointments", "/appointments"],
        ["Patients", "/patients"],
        ["Medical Records", "/medical-records"],
        ["Prescriptions", "/prescriptions"],
        ["Messages", "/messages"],
      ].map(([label, path]) => (
        <TouchableOpacity
          style={s.action}
          key={label}
          onPress={() => router.push(path as any)}
        >
          <Text style={{ fontWeight: "800" }}>
            {label}
          </Text>

          <Text>›</Text>
        </TouchableOpacity>
      ))}

      {/* Logout */}
      <TouchableOpacity
        style={s.logout}
        onPress={logout}
      >
        <Text
          style={{
            color: "#DC2626",
            fontWeight: "800",
          }}
        >
          Logout
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// Statistics Component
function S({
  t,
  v,
}: {
  t: string;
  v: string;
}) {
  return (
    <View style={s.stat}>
      <Text style={s.muted}>{t}</Text>

      <Text style={s.num}>{v}</Text>
    </View>
  );
}

// Styles
const s = StyleSheet.create({
  c: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  brand: {
    fontSize: 32,
    fontWeight: "800",
    color: "#0F766E",
  },

  sub: {
    color: "#64748B",
  },

  banner: {
    backgroundColor: "#CCFBF1",
    padding: 20,
    borderRadius: 20,
    marginTop: 20,
  },

  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#115E59",
    marginBottom: 7,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 20,
  },

  stat: {
    backgroundColor: "#FFF",
    width: "47%",
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  muted: {
    color: "#64748B",
  },

  num: {
    fontSize: 27,
    fontWeight: "800",
    color: "#0F766E",
    marginTop: 10,
  },

  sec: {
    fontSize: 19,
    fontWeight: "800",
    marginTop: 26,
    marginBottom: 12,
  },

  action: {
    backgroundColor: "#FFF",
    padding: 18,
    borderRadius: 14,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  logout: {
    alignItems: "center",
    padding: 25,
  },
});