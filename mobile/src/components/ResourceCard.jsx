import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { scale, verticalScale, moderateScale } from '../responsive';

const COLORS = {
    cardBg: '#2A265C',
    text: '#FFFFFF',
    textSecondary: '#D7C7EC',
};

const ResourceCard = ({ title, description, url, iconName, color }) => {
    const handlePress = async () => {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
            await Linking.openURL(url);
        } else {
            console.error(`Don't know how to open this URL: ${url}`);
        }
    };

    return (
        <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={0.8}>
            <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
                <MaterialIcons name={iconName} size={24} color={color} />
            </View>
            <View style={styles.content}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.description} numberOfLines={2}>{description}</Text>
            </View>
            <MaterialIcons name="open-in-new" size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.cardBg,
        padding: scale(16),
        borderRadius: moderateScale(16),
        marginBottom: verticalScale(16),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    iconContainer: {
        width: moderateScale(48),
        height: moderateScale(48),
        borderRadius: moderateScale(12),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: scale(16),
    },
    content: {
        flex: 1,
        marginRight: scale(8),
    },
    title: {
        fontSize: moderateScale(16),
        fontFamily: 'Poppins-SemiBold',
        color: COLORS.text,
        marginBottom: verticalScale(4),
    },
    description: {
        fontSize: moderateScale(12),
        fontFamily: 'Poppins-Regular',
        color: COLORS.textSecondary,
    },
});

export default ResourceCard;
