import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { scale, verticalScale, moderateScale } from '../../src/responsive';
import ResourceCard from '../../src/components/ResourceCard';

const COLORS = {
    background: '#141326',
    text: '#FFFFFF',
    textSecondary: '#D7C7EC',
    primary: '#E3823C',
    blue: '#433DA3',
    green: '#4CAF50',
    red: '#E33C3C',
};

const RESOURCES = [
    {
        id: '1',
        title: '50/30/20 Rule Explained',
        description: 'Learn how to split your income into needs, wants, and savings for better financial health.',
        url: 'https://www.investopedia.com/ask/answers/022916/what-502030-budget-rule.asp',
        iconName: 'pie-chart',
        color: COLORS.primary,
    },
    {
        id: '2',
        title: 'Emergency Fund Basics',
        description: 'Why you need an emergency fund and how much you should save.',
        url: 'https://www.nerdwallet.com/article/banking/emergency-fund-why-it-matters',
        iconName: 'savings',
        color: COLORS.green,
    },
    {
        id: '3',
        title: 'Investing for Beginners',
        description: 'A simple guide to starting your investment journey.',
        url: 'https://www.investopedia.com/articles/basics/06/invest1000.asp',
        iconName: 'trending-up',
        color: COLORS.blue,
    },
    {
        id: '4',
        title: 'Debt Repayment Strategies',
        description: 'Compare the Snowball vs. Avalanche methods to pay off debt faster.',
        url: 'https://www.ramseysolutions.com/debt/debt-snowball-vs-debt-avalanche',
        iconName: 'money-off',
        color: COLORS.red,
    },
    {
        id: '5',
        title: 'Smart Grocery Shopping',
        description: 'Tips to save money on your monthly food budget.',
        url: 'https://www.thekitchn.com/10-smart-tips-for-grocery-shopping-on-a-budget-229420',
        iconName: 'shopping-cart',
        color: COLORS.textSecondary,
    },
];

const Learn = () => {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" backgroundColor={COLORS.background} />

            <View style={styles.header}>
                <Text style={styles.title}>Financial Resources</Text>
                <Text style={styles.subtitle}>Curated articles to help you grow.</Text>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {RESOURCES.map((item) => (
                    <ResourceCard
                        key={item.id}
                        title={item.title}
                        description={item.description}
                        url={item.url}
                        iconName={item.iconName}
                        color={item.color}
                    />
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        paddingHorizontal: scale(20),
        paddingTop: verticalScale(20),
        paddingBottom: verticalScale(10),
    },
    title: {
        fontSize: moderateScale(28),
        fontFamily: 'Poppins-Bold',
        color: COLORS.text,
    },
    subtitle: {
        fontSize: moderateScale(14),
        fontFamily: 'Poppins-Regular',
        color: COLORS.textSecondary,
        marginTop: verticalScale(-4),
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: scale(20),
        paddingTop: verticalScale(10),
    },
});

export default Learn;
