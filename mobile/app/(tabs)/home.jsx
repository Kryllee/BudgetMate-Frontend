import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { scale, verticalScale, moderateScale } from '../../src/responsive';
import { api } from '../../src/api';
import HeroCard from '../../src/components/HeroCard';
import GoalCard from '../../src/components/GoalCard';
import SpendingChart from '../../src/components/SpendingChart';
import TransactionCard from '../../src/components/TransactionCard';

const COLORS = {
  background: '#141326',
  cardBg: '#2A265C',
  primary: '#E3823C',
  accent: '#E33C3C',
  text: '#FFFFFF',
  textSecondary: '#D7C7EC',
  yellow: '#FFC107',
  success: '#4CAF50',
};

const Home = () => {
  const router = useRouter();
  const [budgetData, setBudgetData] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [username, setUsername] = useState('Friend');

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      await Promise.all([
        loadBudgetData(),
        loadUserData(),
        loadExpenses()
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const loadBudgetData = async () => {
    try {
      // 1. Try local storage first
      const savedData = await AsyncStorage.getItem('userBudget');
      if (savedData != null) {
        setBudgetData(JSON.parse(savedData));
      } else {
        // 2. If not found locally, try backend
        try {
          const response = await api.get('/api/budget');
          if (response.data) {
            const backendData = response.data;
            // Save to local storage for next time
            await AsyncStorage.setItem('userBudget', JSON.stringify(backendData));
            setBudgetData(backendData);
          }
        } catch (apiError) {
          console.log('No budget data on backend or offline:', apiError.message);
        }
      }
    } catch (error) {
      console.error('Failed to load budget data', error);
    }
  };

  const loadUserData = async () => {
    try {
      const savedUserData = await AsyncStorage.getItem('userData');
      if (savedUserData != null) {
        const userObject = JSON.parse(savedUserData);
        setUsername(userObject.name || userObject.username || 'Friend');
      }
    } catch (error) {
      console.error('Failed to load user data', error);
    }
  };

  const loadExpenses = async () => {
    try {
      const response = await api.get('/api/expenses');
      setExpenses(response.data);
    } catch (error) {
      console.error('Failed to load expenses', error);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  // --- Calculations ---
  const monthlyIncome = budgetData?.monthlyIncome || 0;

  // Calculate total spent (excluding Savings)
  const totalSpent = expenses
    .filter(item => item.category !== 'Savings')
    .reduce((sum, item) => sum + item.amount, 0);

  // Calculate Emergency Fund (sum of Savings category)
  const emergencyFundSaved = expenses
    .filter(item => item.category === 'Savings')
    .reduce((sum, item) => sum + item.amount, 0);

  const availableBalance = monthlyIncome - totalSpent - emergencyFundSaved;
  const spendPercentage = monthlyIncome > 0 ? ((totalSpent + emergencyFundSaved) / monthlyIncome) * 100 : 0;

  // Calculate Actual Savings Rate
  const actualSavingsRate = monthlyIncome > 0
    ? ((monthlyIncome - totalSpent) / monthlyIncome) * 100
    : 0;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar style="light" backgroundColor={COLORS.background} translucent={false} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.dateText}>{new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}</Text>
            <Text style={styles.greeting}>Hi, {username}</Text>
          </View>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => router.push('/(tabs)/profile')}
          >
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>{username.charAt(0).toUpperCase()}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Hero Card: Balance */}
        <HeroCard
          availableBalance={availableBalance}
          spendPercentage={spendPercentage}
          totalUsed={totalSpent + emergencyFundSaved}
          monthlyIncome={monthlyIncome}
        />

        {/* Quick Actions */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionButton, styles.primaryAction]}
            onPress={() => router.push('/AddExpense')}
            activeOpacity={0.8}
          >
            <MaterialIcons name="add" size={24} color={COLORS.text} />
            <Text style={styles.actionText}>Add Expense</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryAction]}
            onPress={() => router.push('/ExpenseHistory')}
            activeOpacity={0.8}
          >
            <MaterialIcons name="history" size={24} color={COLORS.textSecondary} />
            <Text style={[styles.actionText, { color: COLORS.textSecondary }]}>History</Text>
          </TouchableOpacity>
        </View>

        {/* Financial Goals Row */}
        <View style={styles.goalsRow}>
          {/* Emergency Fund Card */}
          <GoalCard
            title="Emergency Fund"
            amount={`₱ ${emergencyFundSaved.toLocaleString()}`}
            target={`Goal: ₱ ${budgetData?.emergencyFundGoal?.toLocaleString() || '0'}`}
            iconName="savings"
            iconColor={COLORS.yellow}
            iconBgColor="rgba(255, 193, 7, 0.15)"
          />

          {/* Savings Rate Card */}
          <GoalCard
            title="Savings Rate"
            amount={`${actualSavingsRate.toFixed(1)}%`}
            target={`Target: ${budgetData?.targetSavingsRate || 0}%`}
            iconName="trending-up"
            iconColor={COLORS.success}
            iconBgColor="rgba(76, 175, 80, 0.15)"
          />
        </View>

        {/* Analytics Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Spending Overview</Text>
          </View>
          <SpendingChart expenses={expenses} />
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity onPress={() => router.push('/ExpenseHistory')}>
              <Text style={styles.linkText}>View All</Text>
            </TouchableOpacity>
          </View>

          {expenses.length > 0 ? (
            expenses.slice(0, 3).map((item) => (
              <TransactionCard key={item._id} item={item} />
            ))
          ) : (
            <Text style={styles.emptyText}>No recent transactions</Text>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: scale(20),
    paddingBottom: verticalScale(100),
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(24),
  },
  dateText: {
    fontSize: moderateScale(12),
    fontFamily: 'Poppins-Regular',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  greeting: {
    fontSize: moderateScale(24),
    fontFamily: 'Poppins-Bold',
    color: COLORS.text,
  },
  profileButton: {
    padding: scale(4),
  },
  avatarPlaceholder: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: COLORS.cardBg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.textSecondary,
  },
  avatarText: {
    fontSize: moderateScale(18),
    fontFamily: 'Poppins-Bold',
    color: COLORS.text,
  },

  // Actions
  actionRow: {
    flexDirection: 'row',
    gap: scale(16),
    marginBottom: verticalScale(28),
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(14),
    borderRadius: moderateScale(16),
    gap: scale(8),
  },
  primaryAction: {
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  secondaryAction: {
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  actionText: {
    fontSize: moderateScale(14),
    fontFamily: 'Poppins-SemiBold',
    color: COLORS.text,
  },

  // Goals
  goalsRow: {
    flexDirection: 'row',
    gap: scale(16),
    marginBottom: verticalScale(24),
  },

  // Sections
  section: {
    marginBottom: verticalScale(24),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(16),
  },
  sectionTitle: {
    fontSize: moderateScale(18),
    fontFamily: 'Poppins-SemiBold',
    color: COLORS.text,
  },
  linkText: {
    fontSize: moderateScale(14),
    fontFamily: 'Poppins-Medium',
    color: COLORS.primary,
  },
  emptyText: {
    fontSize: moderateScale(14),
    fontFamily: 'Poppins-Regular',
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: verticalScale(8),
  },
});

export default Home;