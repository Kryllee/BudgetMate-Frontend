import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { scale, verticalScale, moderateScale } from '../../src/responsive';

const COLORS = {
    background: '#141326',
    text: '#FFFFFF',
    textSecondary: '#D7C7EC',
};

const Earn = () => {
    return (
        <SafeAreaView style={styles.container} edges={['left', 'right']}>
            <StatusBar style="light" backgroundColor={COLORS.background} translucent={false} />
            <View style={styles.content}>
                <Text style={styles.title}>Earn</Text>
                <Text style={styles.subtitle}>Coming soon...</Text>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: scale(20),
    },
    title: {
        fontSize: moderateScale(28),
        fontFamily: 'Poppins-Bold',
        color: COLORS.text,
        marginBottom: verticalScale(8),
    },
    subtitle: {
        fontSize: moderateScale(16),
        fontFamily: 'Poppins-Regular',
        color: COLORS.textSecondary,
    },
});

export default Earn;
