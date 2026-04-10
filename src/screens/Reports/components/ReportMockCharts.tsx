import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Rect, Polyline, Circle, Line, Text as SvgText, G } from 'react-native-svg';
import { COLORS } from '../../../constants/colors';
import { TYPOGRAPHY } from '../../../constants/typography';

interface ReportChartProps {
  title: string;
  data: any[];
  type: 'bar' | 'line';
  color?: string;
}

const CHART_HEIGHT = 180;
const PADDING_LEFT = 40;
const PADDING_RIGHT = 20;
const PADDING_TOP = 10;
const PADDING_BOTTOM = 30;

const ReportMockChart: React.FC<ReportChartProps> = ({ title, data, type, color = COLORS.primary }) => {
  const { width } = useWindowDimensions();
  const chartWidth = width - 72; // account for container padding

  if (!data || data.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No data available</Text>
        </View>
      </View>
    );
  }

  const values = data.map(item => item.value || item.sales || 0);
  const labels = data.map((item, i) => item.label || item.year || `${i + 1}`);
  const maxVal = Math.max(...values, 1);
  const minVal = 0;

  const drawWidth = chartWidth - PADDING_LEFT - PADDING_RIGHT;
  const drawHeight = CHART_HEIGHT - PADDING_TOP - PADDING_BOTTOM;

  const getX = (index: number) => PADDING_LEFT + (index / (data.length - 1 || 1)) * drawWidth;
  const getY = (value: number) => PADDING_TOP + drawHeight - ((value - minVal) / (maxVal - minVal)) * drawHeight;

  const barWidth = Math.min(30, (drawWidth / data.length) * 0.6);

  // Y-axis tick count
  const yTicks = 4;
  const yStep = maxVal / yTicks;

  const formatValue = (v: number) => {
    if (v >= 1000) return `${(v / 1000).toFixed(1)}k`;
    return `${Math.round(v)}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={{ height: CHART_HEIGHT }}>
        <Svg width={chartWidth} height={CHART_HEIGHT}>
          {/* Y-axis grid lines + labels */}
          {Array.from({ length: yTicks + 1 }).map((_, i) => {
            const val = (yStep * i);
            const y = getY(val);
            return (
              <G key={`ytick-${i}`}>
                <Line
                  x1={PADDING_LEFT}
                  y1={y}
                  x2={chartWidth - PADDING_RIGHT}
                  y2={y}
                  stroke="#f1f3f5"
                  strokeWidth={1}
                  strokeDasharray="4,4"
                />
                <SvgText
                  x={PADDING_LEFT - 5}
                  y={y + 4}
                  fontSize={9}
                  fill={COLORS.greyText || '#868e96'}
                  textAnchor="end"
                >
                  {formatValue(val)}
                </SvgText>
              </G>
            );
          })}

          {/* X-axis baseline */}
          <Line
            x1={PADDING_LEFT}
            y1={PADDING_TOP + drawHeight}
            x2={chartWidth - PADDING_RIGHT}
            y2={PADDING_TOP + drawHeight}
            stroke="#e9ecef"
            strokeWidth={1}
          />

          {/* Bars or Line */}
          {type === 'bar' ? (
            data.map((item, i) => {
              const x = PADDING_LEFT + (i / data.length) * drawWidth + (drawWidth / data.length - barWidth) / 2;
              const value = values[i];
              const barH = ((value - minVal) / (maxVal - minVal)) * drawHeight;
              const y = PADDING_TOP + drawHeight - barH;
              return (
                <G key={`bar-${i}`}>
                  <Rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barH}
                    fill={color}
                    rx={4}
                    ry={4}
                    opacity={0.9}
                  />
                  <SvgText
                    x={x + barWidth / 2}
                    y={PADDING_TOP + drawHeight + 14}
                    fontSize={9}
                    fill={COLORS.greyText || '#868e96'}
                    textAnchor="middle"
                  >
                    {labels[i]}
                  </SvgText>
                </G>
              );
            })
          ) : (
            <>
              <Polyline
                points={data.map((_, i) => `${getX(i)},${getY(values[i])}`).join(' ')}
                fill="none"
                stroke={color}
                strokeWidth={2.5}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              {data.map((_, i) => (
                <G key={`point-${i}`}>
                  <Circle cx={getX(i)} cy={getY(values[i])} r={4} fill="#fff" stroke={color} strokeWidth={2} />
                  <SvgText
                    x={getX(i)}
                    y={PADDING_TOP + drawHeight + 14}
                    fontSize={9}
                    fill={COLORS.greyText || '#868e96'}
                    textAnchor="middle"
                  >
                    {labels[i]}
                  </SvgText>
                </G>
              ))}
            </>
          )}
        </Svg>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f1f3f5',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  title: {
    ...TYPOGRAPHY.montserrat.bold,
    fontSize: 16,
    color: COLORS.black,
    marginBottom: 12,
  },
  emptyState: {
    height: CHART_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    ...TYPOGRAPHY.montserrat.medium,
    fontSize: 13,
    color: COLORS.greyText || '#868e96',
  },
});

export default ReportMockChart;
