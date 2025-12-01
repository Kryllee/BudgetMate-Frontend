import React, { useState, useCallback } from "react";
import { SafeAreaView, View, ScrollView, Image, Text, TouchableOpacity, StyleSheet, Dimensions, Modal, Alert } from "react-native";
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { scale, verticalScale, moderateScale } from '../../src/responsive';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { api } from '../../src/api';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const COLORS = {
  background: '#141326',
  cardBg: '#433DA3',
  primary: '#E3823C',
  accent: '#E33C3C',
  text: '#FFFFFF',
  textSecondary: '#D7C7EC',
  yellow: '#FFC107',
  inputBg: '#2B2769',
};

const MenuItem = ({ icon, label, value, onPress, isDestructive = false }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.menuIconWrapper}>
      <MaterialIcons name={icon} size={moderateScale(22)} color={isDestructive ? COLORS.accent : COLORS.yellow} />
    </View>
    <View style={styles.menuContent}>
      <Text style={[styles.menuLabel, isDestructive && styles.destructiveLabel]}>{label}</Text>
      {value && <Text style={styles.menuValue}>{value}</Text>}
    </View>
    <MaterialIcons name="chevron-right" size={moderateScale(24)} color={COLORS.textSecondary} />
  </TouchableOpacity>
);

export default function Profile() {
  const [username, setUsername] = useState('User');
  const [email, setEmail] = useState('');
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const router = useRouter();

  const [budgetData, setBudgetData] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      await Promise.all([
        loadUserData(),
        loadBudgetData(),
        loadExpenses(),
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData != null) {
        const user = JSON.parse(userData);
        setUsername(user.name || user.username || 'User');
        setEmail(user.email || '');
      }
    } catch (e) {
      console.error('Failed to load user data', e);
    }
  };

  const loadBudgetData = async () => {
    try {
      const savedData = await AsyncStorage.getItem('userBudget');
      if (savedData != null) {
        setBudgetData(JSON.parse(savedData));
      }
    } catch (error) {
      console.error('Failed to load budget data', error);
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

  // --- Calculations ---
  // Emergency Fund
  const emergencyFundTarget = budgetData?.emergencyFundGoal || 10000;
  const emergencyFundSaved = expenses
    .filter(item => item.category === 'Savings')
    .reduce((sum, item) => sum + item.amount, 0);
  const emergencyProgress = Math.min(Math.round((emergencyFundSaved / emergencyFundTarget) * 100), 100);

  const handleLogout = () => {
    setLogoutModalVisible(true);
  };

  const confirmLogout = async () => {
    try {
      await AsyncStorage.removeItem('userData');
      await AsyncStorage.removeItem('userBudget');
      global.authToken = null;
      setLogoutModalVisible(false);
      router.replace('/');
    } catch (error) {
      console.error('Failed to log out', error);
      setLogoutModalVisible(false);
    }
  };

  const cancelLogout = () => {
    setLogoutModalVisible(false);
  };

  const handlePersonalInfo = () => {
    Alert.alert('Coming Soon', 'Personal info editing feature will be available soon!');
  };

  const handleSettings = () => {
    router.push('/EditBudget');
  };

  const handleEmergencyFundClick = () => {
    Alert.alert(
      'Emergency Fund',
      `Current Progress: ${emergencyProgress}%\nSaved: ₱${emergencyFundSaved.toLocaleString()}\nTarget: ₱${emergencyFundTarget.toLocaleString()}`,
      [
        { text: 'Close', style: 'cancel' },
        {
          text: 'Update Target',
          onPress: () => router.push('/EditBudget')
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar style="light" backgroundColor={COLORS.background} translucent={false} />

      {/* Custom Logout Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={logoutModalVisible}
        onRequestClose={cancelLogout}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <LinearGradient
              colors={['#433DA3', '#2B2769', '#19173D']}
              locations={[0.1, 0.45, 0.75]}
              style={styles.gradientFill}
            />
            <Text style={styles.modalTitle}>Log Out</Text>
            <Text style={styles.modalText}>Are you sure you want to log out?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButtonWrapper} onPress={cancelLogout}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.logoutConfirmWrapper} onPress={confirmLogout}>
                <LinearGradient
                  colors={['#E33C3C', '#E3823C']}
                  style={styles.gradientBtn}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                />
                <Text style={styles.logoutConfirmText}>Log Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Header Profile Card */}
        <View style={styles.headerCard}>
          <LinearGradient
            colors={['#433DA3', '#2B2769']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerGradient}
          />
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/N2yyWBWpxG/oi83aoen_expires_30_days.png" }}
              style={styles.avatarImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.name}>{username}</Text>
          <Text style={styles.email}>{email}</Text>
        </View>

        {/* Menu Section */}
        <View style={styles.menuContainer}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.menuGroup}>
            <MenuItem
              icon="person"
              label="Personal Information"
              onPress={handlePersonalInfo}
            />
            <MenuItem
              icon="settings"
              label="Budget Settings"
              onPress={handleSettings}
            />
          </View>

          <Text style={styles.sectionTitle}>Finance</Text>
          <View style={styles.menuGroup}>
            <MenuItem
              icon="savings"
              label="Emergency Fund"
              value={`${emergencyProgress}%`}
              onPress={handleEmergencyFundClick}
            />
          </View>

          <Text style={styles.sectionTitle}>More</Text>
          <View style={styles.menuGroup}>
            <MenuItem
              icon="help"
              label="Help & Support"
              onPress={() => Alert.alert('Coming Soon')}
            />
          </View>
        </View>

        {/* Log out Button */}
        <TouchableOpacity style={styles.logoutButtonWrapper} activeOpacity={0.7} onPress={handleLogout}>
          <LinearGradient
            colors={[COLORS.accent, COLORS.primary]}
            style={styles.logoutButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.logoutText}>Log out</Text>
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.versionText}>BudgetMate v1.0.0</Text>

      </ScrollView>
    </SafeAreaView>
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
  content: {
    paddingBottom: verticalScale(40),
  },

  // Header
  headerCard: {
    alignItems: 'center',
    paddingVertical: verticalScale(30),
    borderBottomLeftRadius: moderateScale(30),
    borderBottomRightRadius: moderateScale(30),
    overflow: 'hidden',
    marginBottom: verticalScale(20),
  },
  headerGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  avatarContainer: {
    width: moderateScale(90),
    height: moderateScale(90),
    borderRadius: moderateScale(45),
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(12),
    borderWidth: 2,
    borderColor: COLORS.yellow,
  },
  avatarImage: {
    width: '70%',
    height: '70%',
    tintColor: COLORS.yellow,
  },
  name: {
    fontSize: moderateScale(22),
    fontFamily: 'Poppins-Bold',
    color: COLORS.text,
    marginBottom: verticalScale(4),
  },
  email: {
    fontSize: moderateScale(14),
    fontFamily: 'Poppins-Regular',
    color: COLORS.textSecondary,
  },

  // Menu
  menuContainer: {
    paddingHorizontal: scale(20),
  },
  sectionTitle: {
    fontSize: moderateScale(14),
    fontFamily: 'Poppins-SemiBold',
    color: COLORS.textSecondary,
    marginBottom: verticalScale(10),
    marginTop: verticalScale(10),
    marginLeft: scale(4),
  },
  menuGroup: {
    backgroundColor: '#1F1C3E',
    borderRadius: moderateScale(16),
    overflow: 'hidden',
    marginBottom: verticalScale(10),
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(16),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  menuIconWrapper: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(10),
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(12),
  },
  menuContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: scale(8),
  },
  menuLabel: {
    fontSize: moderateScale(15),
    fontFamily: 'Poppins-Medium',
    color: COLORS.text,
  },
  destructiveLabel: {
    color: COLORS.accent,
  },
  menuValue: {
    fontSize: moderateScale(14),
    fontFamily: 'Poppins-Regular',
    color: COLORS.yellow,
  },

  versionText: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.2)',
    fontSize: moderateScale(12),
    fontFamily: 'Poppins-Regular',
    marginTop: verticalScale(20),
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    borderRadius: moderateScale(24),
    overflow: 'hidden',
    padding: scale(24),
    alignItems: 'center',
  },
  gradientFill: {
    ...StyleSheet.absoluteFillObject,
  },
  modalTitle: {
    fontSize: moderateScale(20),
    fontFamily: 'Poppins-Bold',
    color: COLORS.text,
    marginBottom: verticalScale(12),
  },
  modalText: {
    fontSize: moderateScale(15),
    fontFamily: 'Poppins-Regular',
    color: COLORS.textSecondary,
    marginBottom: verticalScale(24),
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    width: '100%',
    gap: scale(12),
  },
  cancelButtonWrapper: {
    flex: 1,
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: COLORS.textSecondary,
    fontFamily: 'Poppins-Medium',
  },
  logoutConfirmWrapper: {
    flex: 1,
    borderRadius: moderateScale(12),
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradientBtn: {
    ...StyleSheet.absoluteFillObject,
  },
  logoutConfirmText: {
    fontSize: moderateScale(16),
    color: COLORS.text,
    fontFamily: 'Poppins-Bold',
  },
  logoutButtonWrapper: {
    marginTop: verticalScale(20),
    borderRadius: moderateScale(12),
    overflow: 'hidden',
    marginHorizontal: scale(20),
  },
  logoutButton: {
    paddingVertical: verticalScale(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    fontSize: moderateScale(16),
    fontFamily: 'Poppins-Bold',
    color: COLORS.text,
  },
});