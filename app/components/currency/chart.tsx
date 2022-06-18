import {
  VictoryAxis,
  VictoryChart,
  VictoryClipContainer,
  VictoryLine,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from 'victory'

import type { CurrencyHistoryData } from '~/lib/currency.server'

export const Chart = ({ data }: { data: CurrencyHistoryData[] }) => {
  // Victory line chart showing date as the x axis and valye as the y axis
  return (
    <VictoryChart
      domainPadding={20}
      containerComponent={
        <VictoryVoronoiContainer
          voronoiDimension='x'
          labels={({ datum }) => `date: ${datum.date} value: ${datum.value}`}
          labelComponent={
            <VictoryTooltip cornerRadius={0} flyoutStyle={{ fill: 'white' }} />
          }
          style={{ maxWidth: 800, margin: '0 auto' }}
        />
      }
      width={600}
      height={300}
      animate={{ duration: 2000, easing: 'linear', onLoad: { duration: 2000 } }}
    >
      <VictoryAxis
        fixLabelOverlap
        style={{
          axis: { stroke: '#ccc' },
          tickLabels: { fontSize: '12px', fill: '#ccc' },
        }}
        // tickFormat in MMM-YY format
        tickFormat={(x) =>
          `${new Date(x).getMonth()}-${new Date(x).getFullYear()}`
        }
      />
      <VictoryAxis
        fixLabelOverlap
        dependentAxis
        style={{
          axis: { stroke: '#ccc' },
          tickLabels: { fontSize: '12px', fill: '#ccc' },
        }}
      />
      <VictoryLine
        data={data}
        x='date'
        y='value'
        interpolation={'natural'}
        groupComponent={<VictoryClipContainer clipId={1} />}
        style={{
          data: {
            stroke: '#c43a31',
            strokeWidth: 3,
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
          },
        }}
      />
    </VictoryChart>
  )
}
