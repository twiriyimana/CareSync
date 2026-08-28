import { router } from "expo-router";

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

export default function Admin() {
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
      <Text style={s.sub}>Admin Dashboard</Text>

      {/* Statistics */}
      <View style={s.grid}>
        {[
          "Patients",
          "Doctors",
          "Appointments",
          "Pending Approvals",
          "Revenue",
          "Users",
        ].map((x, i) => (
          <View style={s.stat} key={x}>
            <Text style={s.muted}>{x}</Text>

            <Text style={s.num}>
              {["5", "3", "12", "2", "$240", "8"][i]}
            </Text>
          </View>
        ))}
      </View>

      {/* Management */}
      <Text style={s.sec}>
        Management
      </Text>

      {[
        "Manage Doctors",
        "Manage Patients",
        "Appointments",
        "Payments",
        "Users",
      ].map((x) => (
        <TouchableOpacity
          style={s.action}
          key={x}
        >
          <Text style={{ fontWeight: "800" }}>
            {x}
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

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 22,
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
    fontSize: 26,
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