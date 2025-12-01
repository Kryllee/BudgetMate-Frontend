import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { scale, verticalScale, moderateScale } from '../responsive';

const COLORS = {
    background: '#141326',
    cardBg: '#2A265C',
    primary: '#E3823C',
    text: '#FFFFFF',
    textSecondary: '#D7C7EC',
};

const GoalCard = ({ title, amount, target, iconName, iconColor, iconBgColor }) => {
    return (
        <View style={styles.goalCard}>
            <View style={styles.goalHeader}>
                <View style={[styles.goalIcon, { backgroundColor: iconBgColor }]}>
                    <MaterialIcons name={iconName} size={20} color={iconColor} />
                </View>
                <Text style={styles.goalTitle}>{title}</Text>
            </View>
            <Text style={styles.goalAmount}>{amount}</Text>
            <Text style={styles.goalTarget}>{target}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    goalCard: {
        flex: 1,
        backgroundColor: COLORS.cardBg,
        borderRadius: moderateScale(20),
        padding: scale(16),
    },
    goalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: verticalScale(12),
        gap: scale(8),
    },
    goalIcon: {
        width: moderateScale(32),
        height: moderateScale(32),
        borderRadius: moderateScale(10),
        justifyContent: 'center',
        alignItems: 'center',
    },
    goalTitle: {
        fontSize: moderateScale(12),
        fontFamily: 'Poppins-Medium',
        color: COLORS.textSecondary,
        flex: 1,
    },
    goalAmount: {
        fontSize: moderateScale(20),
        fontFamily: 'Poppins-Bold',
        color: COLORS.text,
        marginBottom: verticalScale(4),
    },
    goalTarget: {
        fontSize: moderateScale(10),
        fontFamily: 'Poppins-Regular',
        color: COLORS.textSecondary,
    },
});

export default GoalCard;
