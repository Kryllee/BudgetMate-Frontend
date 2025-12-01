import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { scale, verticalScale, moderateScale, screenWidth } from '../responsive';

const COLORS = {
    background: '#141326',
    cardBg: '#2A265C',
    primary: '#E3823C',
    text: '#FFFFFF',
    textSecondary: '#D7C7EC',
};

const SpendingChart = ({ expenses }) => {
    // Chart Data
    const categorySpending = {};
    expenses.forEach(exp => {
        categorySpending[exp.category] = (categorySpending[exp.category] || 0) + exp.amount;
    });

    const chartLabels = Object.keys(categorySpending);
    const chartValues = Object.values(categorySpending);

    const sortedCategories = chartLabels
        .map((label, index) => ({ label, value: chartValues[index] }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

    const displayLabels = sortedCategories.length > 0 ? sortedCategories.map(i => i.label.substring(0, 3)) : ['None'];
    const displayValues = sortedCategories.length > 0 ? sortedCategories.map(i => i.value) : [0];

    const chartConfig = {
        backgroundColor: COLORS.cardBg,
        backgroundGradientFrom: COLORS.cardBg,
        backgroundGradientTo: COLORS.cardBg,
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(227, 130, 60, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(215, 199, 236, ${opacity})`,
        style: { borderRadius: moderateScale(16) },
        barPercentage: 0.6,
        propsForLabels: { fontSize: moderateScale(10), fontFamily: 'Poppins-Regular' },
    };

    return (
        <View style={styles.chartContainer}>
            {expenses.length > 0 ? (
                <BarChart
                    data={{
                        labels: displayLabels,
                        datasets: [{ data: displayValues }],
                    }}
                    width={screenWidth - scale(40)} // Full width minus padding
                    height={verticalScale(220)}
                    yAxisLabel="₱"
                    chartConfig={chartConfig}
                    verticalLabelRotation={0}
                    showValuesOnTopOfBars
                    fromZero
                    withInnerLines={true}
                    withHorizontalLabels={true}
                />
            ) : (
                <View style={styles.emptyChart}>
                    <Text style={styles.emptyText}>No spending data yet</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    chartContainer: {
        backgroundColor: COLORS.cardBg,
        borderRadius: moderateScale(20),
        padding: scale(16),
        alignItems: 'center',
    },
    emptyChart: {
        backgroundColor: COLORS.cardBg,
        borderRadius: moderateScale(20),
        padding: scale(32),
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        fontSize: moderateScale(14),
        fontFamily: 'Poppins-Regular',
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginTop: verticalScale(8),
    },
});

export default SpendingChart;
