import React from 'react';
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { scale, verticalScale, moderateScale } from '../../src/responsive';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
    background: '#141326',
    card: '#1F1C3E',
    text: '#FFFFFF',
    textSecondary: '#D7C7EC',
    gold: '#F9C22E',
    chartBar: '#D9D9D9',
};

const Earn = () => {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" backgroundColor={COLORS.background} />

            {/* Search bar */}
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={moderateScale(18)} color="#A0A0A0" />
                <TextInput
                    placeholder="Find Job"
                    placeholderTextColor="#A0A0A0"
                    style={styles.searchInput}
                />
            </View>

            {/* Job Cards */}
            <View style={styles.cardsRow}>

                {/* Freelance Writing */}
                <View style={styles.card}>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>Easy</Text>
                    </View>

                    <Text style={styles.cardTitle}>Freelance Writing</Text>
                    <Text style={styles.cardDesc}>Write articles for blogs and publications</Text>

                    <View style={styles.cardDetails}>
                        <Text style={styles.detailText}>₱ 50–200 per article</Text>
                        <Text style={styles.detailText}>5–10 hrs/week</Text>
                    </View>

                    <View style={styles.tagRow}>
                        <Text style={styles.tag}>Writing</Text>
                        <Text style={styles.tag}>Remote</Text>
                        <Text style={styles.tag}>Flexible</Text>
                    </View>

                    <TouchableOpacity 
                        style={styles.learnMoreBtn}
                        activeOpacity={0.7}
                        onPress={() => console.log("Learn More clicked")}
                    >
                        <Text style={styles.learnMoreText}>Learn More</Text>
                    </TouchableOpacity>
                </View>

                {/* Virtual Assistant */}
                <View style={styles.card}>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>Easy</Text>
                    </View>

                    <Text style={styles.cardTitle}>Virtual Assistant</Text>
                    <Text style={styles.cardDesc}>
                        Help businesses with administrative tasks
                    </Text>

                    <View style={styles.cardDetails}>
                        <Text style={styles.detailText}>₱ 15–25/hour</Text>
                        <Text style={styles.detailText}>10–20 hrs/week</Text>
                    </View>

                    <View style={styles.tagRow}>
                        <Text style={styles.tag}>Admin</Text>
                        <Text style={styles.tag}>Remote</Text>
                        <Text style={styles.tag}>Flexible</Text>
                    </View>

                    <TouchableOpacity 
                        style={styles.learnMoreBtn}
                        activeOpacity={0.7}
                        onPress={() => console.log("Learn More clicked")}
                    >
                        <Text style={styles.learnMoreText}>Learn More</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Earnings Section */}
            <View style={styles.earningsContainer}>
                <Text style={styles.earningsAmount}>₱1,200.00</Text>
                <Text style={styles.earningsText}>
                    Total earned this month. <Text style={styles.detailsLink}>See details</Text>
                </Text>
            </View>

            {/* Bar Chart Placeholder */}
            <View style={styles.chartContainer}>
                <View style={styles.chartRow}>
                    {[40, 10, 50, 70, 20, 10, 5, 90, 80, 50, 30, 20].map((h, index) => (
                        <View
                            key={index}
                            style={[styles.chartBar, { height: verticalScale(h) }]}
                        />
                    ))}
                </View>

                <View style={styles.monthRow}>
                    {['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'].map(
                        (m, i) => (
                            <Text key={i} style={styles.monthText}>{m}</Text>
                        )
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        padding: scale(15),
    },

    /** SEARCH BAR */
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1D1C35',
        paddingHorizontal: scale(12),
        paddingVertical: verticalScale(10),
        borderRadius: moderateScale(12),
        marginTop: verticalScale(10),
        borderWidth: 1,
        borderColor: '#5B4B8A',
    },
    searchInput: {
        marginLeft: scale(10),
        color: COLORS.text,
        flex: 1,
        fontFamily: 'Poppins-Regular',
    },

    /** CARDS */
    cardsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: verticalScale(20),
    },
    card: {
        backgroundColor: COLORS.card,
        width: '48%',
        padding: scale(15),
        borderRadius: moderateScale(18),
    },
    badge: {
        backgroundColor: COLORS.gold,
        alignSelf: 'flex-start',
        paddingHorizontal: scale(10),
        paddingVertical: verticalScale(4),
        borderRadius: moderateScale(10),
    },
    badgeText: {
        fontFamily: 'Poppins-Bold',
        fontSize: moderateScale(10),
        color: '#000',
    },
    cardTitle: {
        marginTop: verticalScale(10),
        fontSize: moderateScale(16),
        fontFamily: 'Poppins-Bold',
        color: COLORS.text,
    },
    cardDesc: {
        marginTop: verticalScale(5),
        fontSize: moderateScale(12),
        fontFamily: 'Poppins-Regular',
        color: COLORS.textSecondary,
    },
    cardDetails: {
        marginTop: verticalScale(10),
    },
    detailText: {
        color: COLORS.textSecondary,
        fontFamily: 'Poppins-Regular',
        fontSize: moderateScale(11),
        marginBottom: verticalScale(3),
    },

    tagRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: scale(6),
        marginTop: verticalScale(8),
    },
    tag: {
        backgroundColor: '#F9C22E',
        color: '#000',
        paddingHorizontal: scale(10),
        paddingVertical: verticalScale(4),
        fontSize: moderateScale(10),
        borderRadius: moderateScale(10),
        fontFamily: 'Poppins-Bold',
    },

    learnMoreBtn: {
        marginTop: verticalScale(12),
        backgroundColor: '#E53935',
        paddingVertical: verticalScale(6),
        borderRadius: moderateScale(12),
        alignItems: 'center',
    },
    learnMoreText: {
        color: '#FFFFFF',
        fontFamily: 'Poppins-Bold',
        fontSize: moderateScale(12),
    },

    /** EARNINGS */
    earningsContainer: {
        marginTop: verticalScale(25),
        alignItems: 'center',
    },
    earningsAmount: {
        fontSize: moderateScale(30),
        fontFamily: 'Poppins-Bold',
        color: COLORS.gold,
    },
    earningsText: {
        fontSize: moderateScale(13),
        color: COLORS.textSecondary,
        marginTop: verticalScale(5),
        fontFamily: 'Poppins-Regular',
    },
    detailsLink: {
        color: COLORS.text,
        fontFamily: 'Poppins-Bold',
    },

    /** CHART */
    chartContainer: {
        backgroundColor: COLORS.card,
        borderRadius: moderateScale(18),
        padding: scale(15),
        marginTop: verticalScale(20),
    },
    chartRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        height: verticalScale(120),
    },
    chartBar: {
        width: scale(10),
        backgroundColor: COLORS.chartBar,
        borderRadius: moderateScale(6),
    },
    monthRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: verticalScale(10),
    },
    monthText: {
        color: COLORS.textSecondary,
        fontSize: moderateScale(9),
        fontFamily: 'Poppins-Regular',
    },
});

export default Earn;
