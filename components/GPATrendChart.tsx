import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-svg-charts';
import * as shape from 'd3-shape';
import { ThemedText } from './ThemedText';
import { useTheme } from '@/hooks/useTheme';
import { Spacing } from '@/constants/theme';
import { GPATrendData } from '@/hooks/useGPAAnalytics';

interface GPATrendChartProps {
  data: GPATrendData[];
}

const screenWidth = Dimensions.get('window').width;

export function GPATrendChart({ data }: GPATrendChartProps) {
  const { theme } = useTheme();

  if (data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <ThemedText style={{ color: theme.textSecondary }}>
          No GPA trend data available yet
        </ThemedText>
      </View>
    );
  }

  const gpas = data.map(d => d.gpa);
  const labels = data.map(d => {
    const parts = d.semesterName.split(' ');
    return parts.length > 1 ? parts[0] : d.semesterName.substring(0, 3);
  });

  return (
    <View style={styles.container}>
      <LineChart
        style={styles.chart}
        data={gpas}
        svg={{
          stroke: theme.primary,
          strokeWidth: 3,
        }}
        curve={shape.curveNatural}
        contentInset={{ top: 20, bottom: 20, left: 10, right: 10 }}
        yMin={0}
        yMax={5}
      />
      
      <View style={styles.labelsContainer}>
        {labels.map((label, index) => (
          <ThemedText
            key={index}
            style={[
              styles.label,
              { color: theme.textSecondary, width: screenWidth / (labels.length + 1) }
            ]}
          >
            {label}
          </ThemedText>
        ))}
      </View>

      <View style={styles.legend}>
        {data.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: theme.primary }]} />
            <ThemedText style={[styles.legendText, { color: theme.textSecondary }]}>
              {item.semesterName}: {item.gpa.toFixed(2)}
            </ThemedText>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.lg,
  },
  chart: {
    height: 200,
    marginBottom: Spacing.md,
  },
  emptyContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: Spacing.sm,
  },
  label: {
    fontSize: 12,
    textAlign: 'center',
  },
  legend: {
    marginTop: Spacing.lg,
    gap: Spacing.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
  },
});
