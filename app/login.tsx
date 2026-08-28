import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";

export default function Login() {
  const [email,    setEmail]    = useState<string>("");
  const [password, setPassword] = useState<string>("");

  async function login(): Promise<void> {
    if (!email || !password) {
      Alert.alert("CareSync", "Enter email and password.");
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.replace("/");
    } catch (error: any) {
      const message =
        error?.code === "auth/invalid-api-key"
          ? "Firebase API key is missing or invalid. Check your .env file."
          : error?.code === "auth/operation-not-allowed"
            ? "Email/password sign-in is disabled in Firebase Authentication."
            : error?.code === "auth/invalid-credential"
              ? "The email or password is incorrect."
              : error?.message || "Check your email and password.";
      Alert.alert("Login failed", message);
    }
  }

  return (
    <View style={s.container}>
      <Text style={s.logo}>CareSync</Text>
      <Text style={s.subtitle}>
        Healthcare connected. Care simplified.
      </Text>

      <TextInput
        style={s.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={(text: string) => setEmail(text)}
      />
      <TextInput
        style={s.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={(text: string) => setPassword(text)}
      />

      <TouchableOpacity style={s.button} onPress={login}>
        <Text style={s.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/register")}>
        <Text style={s.link}>Create an account</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#F0FDFA",
  },
  logo: {
    fontSize: 40,
    fontWeight: "800",
    color: "#0F766E",
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    color: "#64748B",
    marginVertical: 25,
  },
  input: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 14,
    padding: 15,
    marginBottom: 14,
  },
  button: {
    backgroundColor: "#0F766E",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "800",
    fontSize: 16,
  },
  link: {
    textAlign: "center",
    color: "#0F766E",
    fontWeight: "700",
    marginTop: 22,
  },
});
