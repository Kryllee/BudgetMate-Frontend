import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { scale, verticalScale, moderateScale } from '../../src/responsive';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';

const COLORS = {
    background: '#141326',
    text: '#FFFFFF',
    textSecondary: '#D7C7EC',
    fire: '#FF9800'
};

const Earn = () => {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" backgroundColor={COLORS.background} />

            <View style={styles.content}>
                <Text style={styles.title}>Learn & Grow Financially</Text>

                {/* UNIT BOX */}
                <View style={styles.unitBox}>
                    <LinearGradient
                        colors={['#433DA3', '#2B2769', '#19173D']}
                        locations={[0.1, 0.45, 0.75]}
                        style={styles.gradientFill}
                    />

                    <Text style={styles.unitTitle}>Unit 2: Budgeting and Saving</Text>
                    <Text style={styles.progText}>2 of 16 units completed</Text>

                    <TouchableOpacity style={styles.btn}>
                        <LinearGradient
                            colors={['#E33C3C', '#E3823C']}
                            locations={[0.1, 0.95]}
                            start={{ x: 0, y: 0.5 }}
                            end={{ x: 1, y: 0.5 }}
                            style={styles.gradientBtn}
                        />
                        <Text style={styles.btnText}>Continue Learning</Text>
                    </TouchableOpacity>
                </View>

                {/* STREAK + QUIZ */}
                <View style={styles.row}>
                    {/* STREAK BOX */}
                    <View style={styles.box}>
                        <LinearGradient
                            colors={['#433DA3', '#2B2769', '#19173D']}
                            locations={[0.1, 0.45, 0.75]}
                            style={styles.gradientFill}
                        />

                        <Text style={styles.streakNumber}>
                            2<MaterialCommunityIcons name="fire" size={50} color={COLORS.fire} />
                        </Text>
                        <Text style={styles.streakLabel}>STREAK</Text>
                    </View>

                    {/* QUIZ BOX */}
                    <View style={styles.box}>
                        <LinearGradient
                            colors={['#433DA3', '#2B2769', '#19173D']}
                            locations={[0.1, 0.45, 0.75]}
                            style={styles.gradientFill}
                        />

                        <Text style={styles.quizTitle}>Quiz 2</Text>

                        <TouchableOpacity style={styles.btnSmall}>
                            <LinearGradient
                                colors={['#E33C3C', '#E3823C']}
                                locations={[0.1, 0.95]}
                                start={{ x: 0, y: 0.5 }}
                                end={{ x: 1, y: 0.5 }}
                                style={styles.gradientBtn}
                            />
                            <Text style={styles.btnText}>Start Quiz</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background
    },
    content: {
        flex: 1,
        padding: scale(20)
    },
    title: {
        fontSize: moderateScale(26),
        fontFamily: 'Poppins-Bold',
        color: COLORS.text,
        marginBottom: verticalScale(20),
        textAlign: 'center',
    },

    gradientFill: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: moderateScale(14),
    },

    /* Unit Card */
    unitBox: {
        width: '100%',
        padding: scale(20),
        borderRadius: moderateScale(14),
        marginBottom: verticalScale(20),
        overflow: 'hidden'
    },
    unitTitle: {
        fontSize: moderateScale(23),
        fontWeight: 'bold',
        color: '#E3B53C',
    },
    progText: {
        color: COLORS.text,
        marginTop: verticalScale(5)
    },

    /* Buttons */
    btn: {
        marginTop: verticalScale(12),
        paddingVertical: verticalScale(10),
        borderRadius: moderateScale(10),
        alignItems: 'center',
        overflow: 'hidden'
    },
    btnSmall: {
        marginTop: verticalScale(10),
        paddingVertical: verticalScale(8),
        paddingHorizontal: scale(20),
        borderRadius: moderateScale(10),
        overflow: 'hidden',
        alignItems: 'center'
    },
    gradientBtn: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: moderateScale(10),
    },
    btnText: {
        color: COLORS.text,
        fontWeight: '600'
    },

    /* Layout Row */
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    /* Streak / Quiz Box Shared */
    box: {
        width: '48%',
        padding: scale(20),
        borderRadius: moderateScale(14),
        overflow: 'hidden',
        alignItems: 'center'
    },

    /* Streak */
    streakNumber: {
        color: COLORS.text,
        fontSize: moderateScale(40),
        fontWeight: '700',
    },
    streakLabel: {
        color: COLORS.textSecondary,
        marginTop: verticalScale(4),
        fontSize: moderateScale(16),
        fontWeight: '700',
    },

    /* Quiz */
    quizTitle: {
        fontSize: moderateScale(30),
        color: COLORS.text,
        fontWeight: '600'
    }
});

export default Earn;
