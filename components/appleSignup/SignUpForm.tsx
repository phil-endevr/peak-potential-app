import HttpClient from "@/clients/httpClient";
import brandColors from "@/constants/colors";
import { mockOfferings } from "@/data/mockOfferings";
import React, { useEffect, useState } from "react";
import { Button, Image, Text, TextInput, View } from "react-native";
import Purchases, {
  PurchasesOfferings,
  PurchasesPackage,
} from "react-native-purchases";

const SignUpForm = ({
  packageId,
  offerings,
  isUsingMockData,
  onClose,
}: {
  packageId: string;
  offerings: PurchasesOfferings | null;
  isUsingMockData: boolean;
  onClose: () => void;
}) => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string | null>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [selectedPkg, setSelectedPkg] = useState<PurchasesPackage | any>(null);
  const apiClient = new HttpClient();
  // declaring here as always need plan name
  const mockPkg = mockOfferings.current.packages.find(
    (p: any) => p.identifier === packageId
  );

  useEffect(() => {
    if (isUsingMockData) {
      if (mockPkg) {
        setSelectedPkg(mockPkg);
      }
    } else if (offerings) {
      // Use real RevenueCat offerings
      const pkg = offerings.current?.availablePackages.find(
        (p: any) => p.identifier === packageId
      );
      if (pkg) {
        setSelectedPkg(pkg);
      }
    }
  }, [packageId, offerings, isUsingMockData]);

  const handleSubmit = async () => {
    setError(null);
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await apiClient.post("/auth/ios/addUser", {
        email,
        password,
        firstName,
        lastName,
        plan: selectedPkg.product.title,
      });

      if (response.error) {
        setError(response.error);
        return;
      }

      if (isUsingMockData) {
        console.log("Mock purchase successful for:", selectedPkg);
      } else {
        await Purchases.logIn(response?.uid);
        const purchase = await Purchases.purchasePackage(selectedPkg);
        console.log("Purchase successful:", purchase);
      }

      setSuccess(true);
    } catch (error) {
      console.log("Signup error:", error);
      setError("Signup failed. Please try again.");
    }
  };

  const btnDisabled = [
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
  ].some((value) => !value);

  if (success) {
    return (
      <View
        style={{
          width: 365,
          minHeight: 800,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          source={require("@/assets/images/logo.png")}
          style={{ width: 300, height: 150, marginBottom: 30 }}
        />
        <Text
          style={{
            color: brandColors.primary,
            fontSize: 28,
            marginBottom: 20,
            fontWeight: "bold",
          }}
        >
          Success!
        </Text>
        <Text
          style={{
            color: "white",
            fontSize: 18,
            marginBottom: 40,
            textAlign: "center",
            paddingHorizontal: 20,
          }}
        >
          Your account has been created and your subscription is active.
        </Text>
        <View
          style={{
            backgroundColor: brandColors.primary,
            borderRadius: 20,
            width: 300,
          }}
        >
          <Button title="Continue to Sign In" color="black" onPress={onClose} />
        </View>
      </View>
    );
  }

  return (
    <View
      style={{
        width: 365,
        minHeight: 800,
        justifyContent: "flex-start",
        alignItems: "center",
        marginTop: 170,
      }}
    >
      <Image
        source={require("@/assets/images/logo.png")}
        style={{ width: 300, height: 150, marginBottom: 30 }}
      />
      <Text
        style={{ color: brandColors.primary, fontSize: 26, marginBottom: 12 }}
      >
        {selectedPkg?.product.title}
      </Text>
      <Text
        style={{
          color: "white",
          fontSize: 16,
          marginBottom: 20,
          fontWeight: "bold",
        }}
      >
        Sign Up
      </Text>
      <Text style={{ color: "white", marginBottom: 32 }}>
        Please fill in all fields to enable the &apos;Sign Up&apos; button
      </Text>
      <View style={{ flexDirection: "row", gap: 10 }}>
        <TextInput
          placeholder="First Name"
          placeholderTextColor="#888"
          autoCapitalize="none"
          value={firstName}
          onChangeText={setFirstName}
          autoCorrect={false}
          textContentType="givenName"
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            color: "white",
            width: 145,
            padding: 10,
            borderRadius: 8,
            marginBottom: 16,
          }}
        />
        <TextInput
          placeholder="Last Name"
          placeholderTextColor="#888"
          autoCapitalize="none"
          value={lastName}
          onChangeText={setLastName}
          autoCorrect={false}
          textContentType="familyName"
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            color: "white",
            width: 145,
            padding: 10,
            borderRadius: 8,
            marginBottom: 16,
          }}
        />
      </View>
      <TextInput
        placeholder="Email"
        placeholderTextColor="#888"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        autoCorrect={false}
        textContentType="emailAddress"
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          color: "white",
          width: 300,
          padding: 10,
          borderRadius: 8,
          marginBottom: 16,
        }}
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
        autoCapitalize="none"
        autoCorrect={false}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          color: "white",
          width: 300,
          padding: 10,
          borderRadius: 8,
          marginBottom: 16,
        }}
      />
      <TextInput
        placeholder="Repeat Password"
        placeholderTextColor="#888"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry={true}
        autoCapitalize="none"
        autoCorrect={false}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          color: "white",
          width: 300,
          padding: 10,
          borderRadius: 8,
          marginBottom: 16,
        }}
      />
      <View
        style={{
          backgroundColor: btnDisabled ? "gray" : brandColors.primary,
          borderRadius: 20,
          width: 300,
          marginTop: 20,
        }}
      >
        <Button
          disabled={btnDisabled}
          title="Sign Up"
          color="black"
          onPress={handleSubmit}
        />
      </View>
      <Text style={{ color: "red", marginTop: 20 }}>{error}</Text>
    </View>
  );
};

export default SignUpForm;
