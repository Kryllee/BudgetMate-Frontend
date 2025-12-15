import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const CustomAlert = ({
    visible,
    title,
    message,
    onClose,
    type = 'error',
    showCancel = false,
    onConfirm = null,
    confirmText = 'OK',
    cancelText = 'Cancel'
}) => {
    if (!visible) return null;

    const getIcon = () => {
        switch (type) {
            case 'success': return 'check-circle';
            case 'warning': return 'warning';
            default: return 'error';
        }
    };

    const getColor = () => {
        switch (type) {
            case 'success': return '#4CAF50';
            case 'warning': return '#FFC107';
            default: return '#FF5252';
        }
    };

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.alertContainer}>
                    <View style={[styles.iconContainer, { backgroundColor: `${getColor()}20` }]}>
                        <MaterialIcons name={getIcon()} size={32} color={getColor()} />
                    </View>

                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>

                    <View style={styles.buttonContainer}>
                        {showCancel && (
                            <TouchableOpacity
                                style={[styles.button, styles.cancelButton]}
                                onPress={onClose}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.cancelButtonText}>{cancelText}</Text>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity
                            style={[
                                styles.button,
                                showCancel ? styles.flexButton : { width: '100%' },
                                { backgroundColor: getColor() }
                            ]}
                            onPress={() => {
                                if (onConfirm) {
                                    onConfirm();
                                }
                                onClose();
                            }}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.buttonText}>{confirmText}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    alertContainer: {
        width: '100%',
        maxWidth: 340,
        backgroundColor: '#1E1C30',
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontFamily: 'Poppins-Bold',
        color: '#FFFFFF',
        marginBottom: 8,
        textAlign: 'center',
    },
    message: {
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        color: '#D7C7EC',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 24,
    },
    buttonContainer: {
        flexDirection: 'row',
        width: '100%',
        gap: 12,
    },
    button: {
        paddingVertical: 14,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    flexButton: {
        flex: 1,
    },
    cancelButton: {
        flex: 1,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#D7C7EC',
    },
    buttonText: {
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
        color: '#FFFFFF',
    },
    cancelButtonText: {
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
        color: '#D7C7EC',
    },
});

export default CustomAlert;
