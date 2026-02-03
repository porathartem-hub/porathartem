// src/screens/AccountsScreen.js - ИСПРАВЛЕННАЯ ВЕРСИЯ
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  Alert,
  Modal,
  TouchableWithoutFeedback
} from 'react-native';
import { useData } from '../context/DataContext';
import { colors } from '../theme/colors';
import { commonStyles, spacing, borderRadius } from '../theme/designSystem';
import { formatCurrency } from '../utils/currencyFormatter';

const AccountsScreen = ({ navigation }) => {
  const { accounts, getTotalBalance, deleteAccountWithCheck, archiveAccount, getAccountStats } = useData();
  const [sortBy, setSortBy] = useState('balance');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterType, setFilterType] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  
  // 🔧 НАВИГАЦИЯ - ВАЖНО: используем navigation из пропсов
  const handleEditAccount = (accountId) => {
    console.log('Navigating to EditAccount with accountId:', accountId);
    navigation.navigate('EditAccount', { accountId });
  };

  const handleAddAccount = () => {
    navigation.navigate('AddAccount');
  };

  const handleTransfer = () => {
    navigation.navigate('Transfer');
  };

  const handleDebts = () => {
    navigation.navigate('Debts');
  };

  const handleCredits = () => {
    navigation.navigate('Credits');
  };

  const handleBackup = () => {
    navigation.navigate('BackupSettings');
  };

  // 🔧 ФУНКЦИЯ ДЛЯ ОТОБРАЖЕНИЯ ТИПА СЧЕТА
  const getAccountTypeLabel = (type) => {
    switch (type) {
      case 'card': return 'Банковская карта';
      case 'cash': return 'Наличные';
      case 'savings': return 'Сберегательный счет';
      case 'credit': return 'Кредитная карта';
      case 'investment': return 'Инвестиции';
      case 'other': return 'Другое';
      default: return 'Неизвестный тип';
    }
  };

  const getAccountColor = (type) => {
    switch (type) {
      case 'card': return '#6C63FF';
      case 'cash': return '#4CAF50';
      case 'savings': return '#2196F3';
      case 'credit': return '#F44336';
      case 'investment': return '#FF9800';
      case 'other': return '#9C27B0';
      default: return colors.primary;
    }
  };

  const AccountCard = ({ account }) => {
    const accountColor = getAccountColor(account.type);
    const balance = account.balance || 0;
    const isNegative = balance < 0;

    return (
      <TouchableOpacity 
        style={[styles.accountCard, { borderLeftColor: accountColor }]}
        onPress={() => navigation.navigate('Transfer', { accountId: account.id })}
        onLongPress={() => handleEditAccount(account.id)}
      >
        <View style={styles.accountHeader}>
          <Text style={styles.accountIcon}>{account.icon || '💳'}</Text>
          <View style={styles.accountInfo}>
            <Text style={styles.accountName}>{account.name}</Text>
            <Text style={[styles.accountType, { color: accountColor }]}>
              {getAccountTypeLabel(account.type)}
            </Text>
          </View>
        </View>
        <View style={styles.accountBalanceContainer}>
          <Text style={[
            styles.accountBalance, 
            { color: isNegative ? colors.error : accountColor }
          ]}>
            {formatCurrency(balance, false)}
          </Text>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => handleEditAccount(account.id)}
          >
            <Text style={styles.editButtonText}>✏️</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const ActionButton = ({ 
    title, 
    description, 
    icon, 
    onPress, 
    color = colors.primary 
  }) => (
    <TouchableOpacity 
      style={[styles.actionButton, { borderLeftColor: color }]}
      onPress={onPress}
    >
      <Text style={styles.actionButtonIcon}>{icon}</Text>
      <View style={styles.actionButtonText}>
        <Text style={styles.actionActionTitle}>{title}</Text>
        <Text style={styles.actionButtonDescription}>{description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={commonStyles.screen.container}>
      <View style={commonStyles.screen.header}>
        <Text style={commonStyles.screen.title}>💳 Счета</Text>
        <Text style={commonStyles.screen.subtitle}>Управление счетами и финансами</Text>
      </View>

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.totalBalanceCard}>
          <Text style={styles.totalBalanceLabel}>Общий баланс</Text>
          <Text style={styles.totalBalanceValue}>
            {formatCurrency(getTotalBalance(), false)}
          </Text>
        </View>

        {/* 🔧 СПИСОК СЧЕТОВ */}
        {accounts && accounts.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Мои счета ({accounts.length})</Text>
            {accounts.map(account => (
              <AccountCard key={account.id} account={account} />
            ))}
          </View>
        ) : (
          <View style={styles.emptySection}>
            <Text style={styles.emptyIcon}>💳</Text>
            <Text style={styles.emptyTitle}>У вас пока нет счетов</Text>
            <Text style={styles.emptyDescription}>
              Добавьте первый счет для управления финансами
            </Text>
          </View>
        )}

        {/* 🔧 УПРАВЛЕНИЕ */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Управление</Text>
          
          <ActionButton
            title="Добавить счет"
            description="Создать новый счет или кошелек"
            icon="➕"
            color="#4CAF50"
            onPress={handleAddAccount}
          />

          <ActionButton
            title="Перевод между счетами"
            description="Перевести деньги между счетами"
            icon="🔄"
            color="#2196F3"
            onPress={handleTransfer}
          />

          <ActionButton
            title="Долги"
            description="Управление долгами и займами"
            icon="🤝"
            color="#FF9800"
            onPress={handleDebts}
          />

          <ActionButton
            title="Кредиты"
            description="Управление кредитами и рассрочками"
            icon="🏦"
            color="#9C27B0"
            onPress={handleCredits}
          />

          <ActionButton
            title="Резервные копии"
            description="Экспорт и импорт данных приложения"
            icon="💾"
            color="#607D8B"
            onPress={handleBackup}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  totalBalanceCard: {
    ...commonStyles.cards.surface,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  totalBalanceLabel: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    fontWeight: '500',
  },
  totalBalanceValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  accountCard: {
    ...commonStyles.cards.surface,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderLeftWidth: 4,
  },
  accountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  accountIcon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  accountType: {
    fontSize: 14,
    fontWeight: '600',
  },
  accountBalanceContainer: {
    alignItems: 'flex-end',
  },
  accountBalance: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  editButton: {
    marginTop: spacing.sm,
    padding: spacing.xs,
  },
  editButtonText: {
    fontSize: 18,
  },
  actionButton: {
    ...commonStyles.cards.surface,
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderLeftWidth: 4,
  },
  actionButtonIcon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  actionButtonText: {
    flex: 1,
  },
  actionActionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  actionButtonDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  emptySection: {
    ...commonStyles.cards.surface,
    alignItems: 'center',
    padding: spacing.xl,
    marginBottom: spacing.xl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default AccountsScreen;
