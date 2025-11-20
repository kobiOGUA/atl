import React, { useState } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { ScreenScrollView } from '@/components/ScreenScrollView';
import { Card } from '@/components/Card';
import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/Button';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/contexts/AuthContext';
import { getSemesters } from '@/services/storageService';
import { dataExportService } from '@/services/dataExportService';
import { Spacing } from '@/constants/theme';
import { Feather } from '@expo/vector-icons';

export default function DataManagementScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [exporting, setExporting] = useState(false);

  const handleExportJSON = async () => {
    if (!user) return;
    
    try {
      setExporting(true);
      const semesters = await getSemesters(user.uid);
      
      if (semesters.length === 0) {
        Alert.alert('No Data', 'You don\'t have any semester data to export yet.');
        return;
      }
      
      await dataExportService.exportToJSON(semesters, user.email);
      Alert.alert('Success', 'Your data has been exported successfully!');
    } catch (error) {
      Alert.alert('Export Failed', error instanceof Error ? error.message : 'Failed to export data');
    } finally {
      setExporting(false);
    }
  };

  const handleExportPDF = async () => {
    if (!user) return;
    
    try {
      setExporting(true);
      const semesters = await getSemesters(user.uid);
      
      if (semesters.length === 0) {
        Alert.alert('No Data', 'You don\'t have any semester data to export yet.');
        return;
      }
      
      await dataExportService.exportToPDF(semesters, user.email);
      Alert.alert('Success', 'Your academic report has been generated!');
    } catch (error) {
      Alert.alert('Export Failed', error instanceof Error ? error.message : 'Failed to generate PDF');
    } finally {
      setExporting(false);
    }
  };

  return (
    <ScreenScrollView>
      <View style={styles.container}>
        <ThemedText type="title" style={[styles.title, { color: theme.text }]}>
          Data Management
        </ThemedText>
        
        <ThemedText style={[styles.description, { color: theme.textSecondary }]}>
          Export your academic data or create a backup of your records.
        </ThemedText>

        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="download" size={24} color={theme.primary} />
            <ThemedText type="subtitle" style={[styles.sectionTitle, { color: theme.text }]}>
              Export Data
            </ThemedText>
          </View>
          
          <ThemedText style={[styles.sectionDescription, { color: theme.textSecondary }]}>
            Download your complete academic records in your preferred format.
          </ThemedText>

          <View style={styles.buttonGroup}>
            <Button
              label="Export as JSON"
              onPress={handleExportJSON}
              disabled={exporting}
              variant="secondary"
              style={styles.exportButton}
            />
            
            <Button
              label="Export as PDF"
              onPress={handleExportPDF}
              disabled={exporting}
              variant="primary"
              style={styles.exportButton}
            />
          </View>
          
          {exporting ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={theme.primary} />
              <ThemedText style={[styles.loadingText, { color: theme.textSecondary }]}>
                Preparing export...
              </ThemedText>
            </View>
          ) : null}
        </Card>

        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="info" size={24} color={theme.primary} />
            <ThemedText type="subtitle" style={[styles.sectionTitle, { color: theme.text }]}>
              About Your Data
            </ThemedText>
          </View>
          
          <ThemedText style={[styles.infoText, { color: theme.textSecondary }]}>
            • JSON format includes all raw data and can be used for backup and restore
          </ThemedText>
          
          <ThemedText style={[styles.infoText, { color: theme.textSecondary }]}>
            • PDF format generates a formatted academic report with all your grades and GPAs
          </ThemedText>
          
          <ThemedText style={[styles.infoText, { color: theme.textSecondary }]}>
            • Your data is stored locally and synced with Firebase Authentication
          </ThemedText>
        </Card>
      </View>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
  },
  title: {
    marginBottom: Spacing.sm,
  },
  description: {
    marginBottom: Spacing.xl,
    lineHeight: 22,
  },
  section: {
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    flex: 1,
  },
  sectionDescription: {
    marginBottom: Spacing.lg,
    lineHeight: 20,
  },
  buttonGroup: {
    gap: Spacing.md,
  },
  exportButton: {
    marginBottom: Spacing.sm,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginTop: Spacing.md,
    padding: Spacing.md,
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 14,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: Spacing.sm,
  },
});
