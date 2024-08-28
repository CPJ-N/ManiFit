import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

export default function PrivacyPolicyScreen ({navigation}) {
  return (
    <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
      <View style={styles.header}>
        <TouchableOpacity onPress={()=>navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color="#ffd20a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
      </View>

      <ScrollView style={styles.content}>
        <Section title="Our Commitment to Your Privacy">
          <Paragraph>
            At FitTech Solutions, we are committed to protecting your personal data and fitness information. This privacy policy outlines how we collect, use, and safeguard your data as you use our fitness app to achieve your health goals.
          </Paragraph>
        </Section>

        <Section title="Information We Collect">
          <Paragraph>
            To provide you with personalized fitness experiences, we may collect:
          </Paragraph>
          <BulletList items={[
            "Personal Information: Name, email, age, gender, height, weight",
            "Health Data: Heart rate, steps, calories burned, sleep patterns",
            "Fitness Goals: Your objectives and preferred workout types",
            "Device Information: Device type, operating system, unique device identifiers",
            "Usage Data: Workout frequency, duration, and types of exercises performed"
          ]} />
        </Section>

        <Section title="How We Use Your Information">
          <Paragraph>
            We use your data to:
          </Paragraph>
          <BulletList items={[
            "Personalize your workout plans and nutrition advice",
            "Track your progress and provide insights",
            "Improve our app's features and user experience",
            "Send you motivational notifications and updates (with your consent)",
            "Analyze overall fitness trends to enhance our services"
          ]} />
        </Section>

        <Section title="Data Security">
          <Paragraph>
            We implement strong encryption and security protocols to protect your sensitive health and fitness data. Our systems are regularly audited to ensure compliance with health information protection standards.
          </Paragraph>
        </Section>

        <Section title="Your Rights">
          <Paragraph>
            You have the right to:
          </Paragraph>
          <BulletList items={[
            "Access and export your fitness data",
            "Correct any inaccuracies in your personal information",
            "Delete your account and associated data",
            "Opt-out of certain data collections (e.g., location tracking)",
            "Restrict processing of your data for specific purposes"
          ]} />
        </Section>

        <Section title="Contact Us">
          <Paragraph>
            If you have any questions about your data or this policy, please contact us at:
          </Paragraph>
          {/* <Paragraph>
            Email: privacy@fittechsolutions.com{"\n"}
            Phone: +1 (555) 987-6543{"\n"}
            Address: 456 Fitness Avenue, Healthville, HT 67890, Country
            </Paragraph> */}
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const Paragraph: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Text style={styles.paragraph}>{children}</Text>
);

const BulletList: React.FC<{ items: string[] }> = ({ items }) => (
  <View style={styles.list}>
    {items.map((item, index) => (
      <Text key={index} style={styles.listItem}>• {item}</Text>
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffd20a',
    marginLeft: 16,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffd20a',
    marginBottom: 12,
  },
  paragraph: {
    color: '#ffffff',
    marginBottom: 12,
    lineHeight: 20,
  },
  list: {
    marginBottom: 12,
  },
  listItem: {
    color: '#ffffff',
    marginBottom: 8,
    paddingLeft: 12,
  },
});