import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// ============================================
// CONSTANTS
// ============================================
const COLORS = {
  background: '#141326',
  cardBg: '#433DA3',
  primary: '#E3823C',
  accent: '#E33C3C',
  text: '#FFFFFF',
  textSecondary: '#D7C7EC',
  yellow: '#FFC107'
};

const CATEGORIES = [
  'Entertainment',
  'Transportation', 
  'Food',
  'Utilities',
  'Others'
];

// ============================================
// MAIN COMPONENT
// ============================================
export default function BudgetOnboarding() {
  // State Management
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [savingsGoals, setSavingsGoals] = useState([
    { id: 1, name: '', targetAmount: '', currentSavings: '' }
  ]);
  const [spendingPreferences, setSpendingPreferences] = useState(
    CATEGORIES.map(cat => ({ 
      category: cat, 
      percentage: '', 
      fixedAmount: '' 
    }))
  );
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // ============================================
  // GOAL MANAGEMENT FUNCTIONS
  // ============================================
  const addGoal = () => {
    setSavingsGoals([
      ...savingsGoals,
      { id: Date.now(), name: '', targetAmount: '', currentSavings: '' }
    ]);
  };

  const removeGoal = (id) => {
    if (savingsGoals.length > 1) {
      setSavingsGoals(savingsGoals.filter(goal => goal.id !== id));
      // Clear errors for removed goal
      const newErrors = { ...errors };
      delete newErrors[`goal_${id}_name`];
      delete newErrors[`goal_${id}_targetAmount`];
      delete newErrors[`goal_${id}_currentSavings`];
      setErrors(newErrors);
    }
  };

  const updateGoal = (id, field, value) => {
    setSavingsGoals(savingsGoals.map(goal => 
      goal.id === id ? { ...goal, [field]: value } : goal
    ));
    // Clear error for this field when user types
    if (errors[`goal_${id}_${field}`]) {
      const newErrors = { ...errors };
      delete newErrors[`goal_${id}_${field}`];
      setErrors(newErrors);
    }
  };

  const updateSpendingPreference = (category, field, value) => {
    setSpendingPreferences(spendingPreferences.map(pref =>
      pref.category === category ? { ...pref, [field]: value } : pref
    ));
  };

  // ============================================
  // VALIDATION LOGIC
  // ============================================
  const validateForm = () => {
    const newErrors = {};

    // Validate monthly income
    if (!monthlyIncome || monthlyIncome.trim() === '') {
      newErrors.monthlyIncome = 'Monthly income is required';
    } else if (isNaN(parseFloat(monthlyIncome))) {
      newErrors.monthlyIncome = 'Please enter a valid number';
    }

    // Validate savings goals
    savingsGoals.forEach((goal) => {
      if (!goal.name || goal.name.trim() === '') {
        newErrors[`goal_${goal.id}_name`] = 'Goal name is required';
      }
      if (!goal.targetAmount || goal.targetAmount.trim() === '') {
        newErrors[`goal_${goal.id}_targetAmount`] = 'Target amount is required';
      } else if (isNaN(parseFloat(goal.targetAmount))) {
        newErrors[`goal_${goal.id}_targetAmount`] = 'Please enter a valid number';
      }
      if (!goal.currentSavings || goal.currentSavings.trim() === '') {
        newErrors[`goal_${goal.id}_currentSavings`] = 'Current savings is required';
      } else if (isNaN(parseFloat(goal.currentSavings))) {
        newErrors[`goal_${goal.id}_currentSavings`] = 'Please enter a valid number';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ============================================
  // API SUBMISSION HANDLER
  // ============================================
  const handleSubmit = async () => {
    // Validate form
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fill in all required fields correctly.');
      return;
    }

    // Prepare data
    const data = {
      monthlyIncome: parseFloat(monthlyIncome),
      savingsGoals: savingsGoals.map(goal => ({
        name: goal.name,
        targetAmount: parseFloat(goal.targetAmount),
        currentSavings: parseFloat(goal.currentSavings)
      })),
      spendingPreferences: spendingPreferences.map(pref => ({
        category: pref.category,
        percentage: pref.percentage ? parseFloat(pref.percentage) : null,
        fixedAmount: pref.fixedAmount ? parseFloat(pref.fixedAmount) : null
      }))
    };

    setIsSubmitting(true);

    try {
      Alert.alert('Success', 'Budget preferences saved successfully!');
      router.replace('/(tabs)/home');
    } catch (navErr) {
      console.warn('Navigation error:', navErr);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============================================
  // RENDER UI
  // ============================================
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.mainTitle}>Setup Your Budget</Text>
          <Text style={styles.subtitle}>Let's personalize your financial journey</Text>
        </View>

        {/* Monthly Income Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Monthly Income</Text>
          <View style={[
            styles.inputContainer, 
            errors.monthlyIncome && styles.inputError
          ]}>
            <Text style={styles.currencyPrefix}>₱</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your monthly income"
              placeholderTextColor="#8B86B8"
              keyboardType="numeric"
              value={monthlyIncome}
              onChangeText={(text) => {
                setMonthlyIncome(text);
                if (errors.monthlyIncome) {
                  const newErrors = { ...errors };
                  delete newErrors.monthlyIncome;
                  setErrors(newErrors);
                }
              }}
            />
          </View>
          {errors.monthlyIncome && (
            <Text style={styles.errorText}>{errors.monthlyIncome}</Text>
          )}
        </View>

        {/* Savings Goals Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Savings Goals</Text>
            <TouchableOpacity onPress={addGoal} style={styles.addButton}>
              <MaterialIcons name="add" size={16} color={COLORS.text} />
              <Text style={styles.addButtonText}>Add Goal</Text>
            </TouchableOpacity>
          </View>

          {savingsGoals.map((goal, index) => (
            <View key={goal.id} style={styles.goalCard}>
              <View style={styles.goalHeader}>
                <Text style={styles.goalNumber}>Goal {index + 1}</Text>
                {savingsGoals.length > 1 && (
                  <TouchableOpacity onPress={() => removeGoal(goal.id)}>
                    <MaterialIcons name="close" size={20} color={COLORS.accent} />
                  </TouchableOpacity>
                )}
              </View>

              <View style={[
                styles.inputContainer,
                styles.goalInputContainer,
                errors[`goal_${goal.id}_name`] && styles.inputError
              ]}>
                <TextInput
                  style={styles.input}
                  placeholder="Goal name (e.g., Dream Car)"
                  placeholderTextColor="#8B86B8"
                  value={goal.name}
                  onChangeText={(text) => updateGoal(goal.id, 'name', text)}
                />
              </View>
              {errors[`goal_${goal.id}_name`] && (
                <Text style={styles.errorText}>{errors[`goal_${goal.id}_name`]}</Text>
              )}

              <View style={styles.row}>
                <View style={styles.halfInput}>
                  <Text style={styles.label}>Target Amount</Text>
                  <View style={[
                    styles.inputContainer,
                    errors[`goal_${goal.id}_targetAmount`] && styles.inputError
                  ]}>
                    <Text style={styles.currencyPrefix}>₱</Text>
                    <TextInput
                      style={[styles.input, styles.inputSmall]}
                      placeholder="10,000"
                      placeholderTextColor="#8B86B8"
                      keyboardType="numeric"
                      value={goal.targetAmount}
                      onChangeText={(text) => updateGoal(goal.id, 'targetAmount', text)}
                    />
                  </View>
                  {errors[`goal_${goal.id}_targetAmount`] && (
                    <Text style={styles.errorTextSmall}>
                      {errors[`goal_${goal.id}_targetAmount`]}
                    </Text>
                  )}
                </View>

                <View style={styles.halfInput}>
                  <Text style={styles.label}>Current Savings</Text>
                  <View style={[
                    styles.inputContainer,
                    errors[`goal_${goal.id}_currentSavings`] && styles.inputError
                  ]}>
                    <Text style={styles.currencyPrefix}>₱</Text>
                    <TextInput
                      style={[styles.input, styles.inputSmall]}
                      placeholder="4,500"
                      placeholderTextColor="#8B86B8"
                      keyboardType="numeric"
                      value={goal.currentSavings}
                      onChangeText={(text) => updateGoal(goal.id, 'currentSavings', text)}
                    />
                  </View>
                  {errors[`goal_${goal.id}_currentSavings`] && (
                    <Text style={styles.errorTextSmall}>
                      {errors[`goal_${goal.id}_currentSavings`]}
                    </Text>
                  )}
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Spending Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Spending Preferences</Text>
          <Text style={styles.sectionSubtitle}>
            Set limits for each category (optional)
          </Text>

          {spendingPreferences.map((pref) => (
            <View key={pref.category} style={styles.preferenceCard}>
              <Text style={styles.categoryName}>{pref.category}</Text>
              
              <View style={styles.row}>
                <View style={styles.halfInput}>
                  <Text style={styles.label}>Percentage of Income</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={[styles.input, styles.inputSmall]}
                      placeholder="20"
                      placeholderTextColor="#8B86B8"
                      keyboardType="numeric"
                      value={pref.percentage}
                      onChangeText={(text) => 
                        updateSpendingPreference(pref.category, 'percentage', text)
                      }
                    />
                    <Text style={styles.percentSign}>%</Text>
                  </View>
                </View>

                <View style={styles.halfInput}>
                  <Text style={styles.label}>Fixed Amount</Text>
                  <View style={styles.inputContainer}>
                    <Text style={styles.currencyPrefix}>₱</Text>
                    <TextInput
                      style={[styles.input, styles.inputSmall]}
                      placeholder="5,000"
                      placeholderTextColor="#8B86B8"
                      keyboardType="numeric"
                      value={pref.fixedAmount}
                      onChangeText={(text) => 
                        updateSpendingPreference(pref.category, 'fixedAmount', text)
                      }
                    />
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Submit Button */}
        <TouchableOpacity 
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]} 
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'Saving...' : 'Continue'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 32,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.yellow,
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: -12,
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  inputError: {
    borderColor: COLORS.accent,
  },
  goalInputContainer: {
    marginBottom: 8,
  },
  currencyPrefix: {
    fontSize: 18,
    color: COLORS.text,
    marginRight: 8,
    fontWeight: '600',
  },
  percentSign: {
    fontSize: 18,
    color: COLORS.text,
    marginLeft: 8,
    fontWeight: '600',
  },
  input: {
    flex: 1,
    color: COLORS.text,
    fontSize: 16,
    height: '100%',
  },
  inputSmall: {
    fontSize: 15,
  },
  errorText: {
    color: COLORS.accent,
    fontSize: 13,
    marginTop: 6,
    marginLeft: 4,
  },
  errorTextSmall: {
    color: COLORS.accent,
    fontSize: 11,
    marginTop: 4,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addButtonText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
  },
  goalCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.yellow,
  },
  label: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  preferenceCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '600',
  },
});