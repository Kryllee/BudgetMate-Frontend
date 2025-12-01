import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { scale, verticalScale, moderateScale, screenWidth } from '../responsive';

const COLORS = {
    background: '#141326',
    cardBg: '#433DA3',
    text: '#FFFFFF',
    textSecondary: '#D7C7EC',
    bar: '#D7C7EC', // Light purple bars
    yellow: '#FFC107',
};

const EarningsChart = ({ earningsData }) => {
    // earningsData should be an array of 12 numbers (Jan-Dec)
    const data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                data: earningsData.length === 12 ? earningsData : Array(12).fill(0),
            },
        ],
    };

    const chartConfig = {
        backgroundColor: COLORS.background,
        backgroundGradientFrom: COLORS.background,
        backgroundGradientTo: COLORS.background,
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(255, 193, 7, ${opacity})`, // Yellow bars
        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // White labels
        style: {
            borderRadius: moderateScale(16),
        },
        barPercentage: 0.5,
        fillShadowGradient: COLORS.yellow,
        fillShadowGradientOpacity: 1,
        propsForLabels: {
            fontSize: moderateScale(9),
            fontFamily: 'Poppins-Regular'
        }
    };

    return (
        <View style={styles.container}>
            <BarChart
                data={data}
                width={screenWidth} // Full width
                height={verticalScale(240)}
                yAxisLabel="₱"
                yAxisSuffix=""
                chartConfig={chartConfig}
                verticalLabelRotation={0}
                showValuesOnTopOfBars={true}
                fromZero
                withInnerLines={true}
                withHorizontalLabels={true}
            />
            <View style={styles.labelsContainer}>
                {/* Custom labels if needed */}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        // Removed card styling to allow full width
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default EarningsChart;
