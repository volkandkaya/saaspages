import { graphql } from 'gatsby'
import get from 'lodash/get'
import Img from 'gatsby-image'
import React from 'react'

import { siteMetadata } from '../../gatsby-config'
import Layout from 'components/Layout'
import Meta from 'components/Meta'
import Icon from 'components/Icon'
import DataTable from 'react-data-table-component'

import { Bar, Line, Scatter } from 'react-chartjs-2'

const dataRequests = [
  'document',
  'stylesheet',
  'script',
  'image',
  'font',
  'media',
  'redirect',
  'ajax',
  'other',
]

const jsThreads = [
  'scriptEvaluation',
  'styleLayout',
  'paintCompositeRender',
  'scriptParseCompile',
  'parseHTML',
  'garbageCollection',
  'other',
]

const loadSpeeds = [
  'firstContentfulPaint',
  'firstMeaningfulPaint',
  'speedIndex',
  'timeToInteractive',
]

const scoreNames = ['Performance', 'Accessibility', 'Best Practices', 'SEO']

const randomColors = [
  ['rgba(97,181,52,0.2', 'rgba(97,181,52,0.4', 'rgba(97,181,52,1'],
  ['rgba(220,105,9,0.2', 'rgba(220,105,9,0.4', 'rgba(220,105,9,1'],
  ['rgba(35,115,139,0.2', 'rgba(35,115,139,0.4', 'rgba(35,115,139,1'],
  ['rgba(149,63,125,0.2', 'rgba(149,63,125,0.4', 'rgba(149,63,125,1'],
  ['rgba(217,202,165,0.2', 'rgba(217,202,165,0.4', 'rgba(217,202,165,1'],
  ['rgba(90,245,38,0.2', 'rgba(90,245,38,0.4', 'rgba(90,245,38,1'],
  ['rgba(83,148,123,0.2', 'rgba(83,148,123,0.4', 'rgba(83,148,123,1'],
  ['rgba(160,228,106,0.2', 'rgba(160,228,106,0.4', 'rgba(160,228,106,1'],
  ['rgba(213,221,82,0.2', 'rgba(213,221,82,0.4', 'rgba(213,221,82,1'],
]

const tableData = [{ id: 1, title: 'Conan the Barbarian', year: '1982' }]
const columns = [
  {
    name: 'Rank',
    selector: 'rank',
    sortable: true,
  },
  {
    name: 'Name',
    selector: 'name',
    sortable: true,
    cell: row => (
      <div>
        <a href={row.url} target="_blank">
          {row.name}
        </a>
      </div>
    ),
  },
  {
    name: 'Employees',
    selector: 'feb2019employees',
    sortable: true,
  },
  {
    name: 'Growth',
    selector: 'growth',
    sortable: true,
    cell: row => <div>{row.growth}%</div>,
  },
  {
    name: 'Desktop Perf',
    selector: 'desktopPerf',
    sortable: true,
  },
  {
    name: 'Mobile Perf',
    selector: 'mobilePerf',
    sortable: true,
  },

  // {
  //   name: 'Year',
  //   selector: 'year',
  //   sortable: true,
  //   right: true,
  // },
]

const averageScore = (data_speed, device, score) => {
  return (
    Math.round(
      (data_speed.reduce((c, s) => c + s[device].scores[score], 0) * 100) /
        data_speed.length
    ) / 100
  )
}

const averageRequestMetrics = (data_speed, device, metric) => {
  return (
    Math.round(
      (data_speed.reduce((c, s) => c + s[device].requestMetrics[metric], 0) *
        100) /
        data_speed.length
    ) / 100
  )
}

const averageStat = (data_speed, device, stat) => {
  return (
    Math.round(
      (data_speed.reduce((c, s) => c + s[device][stat], 0) * 100) /
        data_speed.length
    ) / 100
  )
}

const Filter = ({ onFilter }) => (
  <input
    className="form-control col-md-3"
    type="text"
    placeholder="Search SaaS"
    onChange={e => onFilter(e.target.value)}
  />
)

class Speed extends React.Component {
  state = { filterText: '' }

  setFilterText = filterText => this.setState({ filterText })
  // constructor(props) {
  //   super(props);

  //   this.state = {};
  // }

  render() {
    const { location, data } = this.props
    const data_blocks = get(data, 'remark.blocks')
    const blocks = data_blocks.map(block => block.block.frontmatter)
    let data_speed = get(data, 'allSpeedJson.edges')
    data_speed = data_speed.map(s => s.speedData)
    data_speed = data_speed.map(s => {
      s.july2018employees = parseInt(s.july2018employees)
      s.feb2019employees = parseInt(s.feb2019employees)
      s.growth =
        Math.round(
          ((s.feb2019employees / s.july2018employees) * 100 - 100) * 100
        ) / 100
      s.rank = parseInt(s.rank)
      s.mobilePerf = s.mobile.scores.performance
      s.desktopPerf = s.desktop.scores.performance
      // delete s.mobile
      return s
    })

    data_speed = data_speed.sort((a, b) => (b.rank > a.rank ? -1 : 1))

    console.log(this.state.filterText)

    let filteredItems = data_speed
    if (this.state.filterText) {
      filteredItems = data_speed.filter(d => {
        let filter = false
        return d['name']
          .toLowerCase()
          .includes(this.state.filterText.toLowerCase())
        // columns.map(header => {
        //   if (d[header] && d[header].includes(this.state.filterText)) {
        //     filter = true;
        //   }
        //   return header
        // })
        return filter ? d : false
      })
    }

    const averageDesktopPerf =
      Math.round(
        (data_speed.reduce((c, s) => c + s.desktop.scores.performance, 0) *
          100) /
          data_speed.length
      ) / 100
    const averageMobilePerf =
      Math.round(
        (data_speed.reduce((c, s) => c + s.mobile.scores.performance, 0) *
          100) /
          data_speed.length
      ) / 100

    let topPercentArr = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
    let top25PercentArr = [0.25, 0.5, 0.75, 1]

    let topPercentPerf = topPercentArr.map(p => 0)
    let topDesktopPercentPerf = topPercentArr.map(p => 0)

    let top25PercentPerf = top25PercentArr.map(p => 0)
    let top25PercentDesktopPerf = top25PercentArr.map(p => 0)
    let topPercentStats = topPercentArr.map(p => [0, 0, 0, 0, 0, 0, 0, 0, 0])

    let topPercentJS = topPercentArr.map(p => [0, 0, 0, 0, 0, 0, 0])

    let top25Scores = top25PercentArr.map(p => [0, 0, 0, 0])

    let top25Loads = top25PercentArr.map(p => [0, 0, 0, 0])
    let top25DesktopLoads = top25PercentArr.map(p => [0, 0, 0, 0])

    data_speed.map(s => {
      topPercentArr.map((p, i) => {
        if (s.mobilePerf <= p) {
          topPercentPerf[i] += 1
        }
        if (s.desktopPerf <= p) {
          topDesktopPercentPerf[i] += 1
        }
        if (s.desktopPerf <= p && s.desktopPerf > p - 0.1) {
          topPercentStats[i][0] +=
            s.desktop.requestMetrics.sizeByCategory.document
          topPercentStats[i][1] +=
            s.desktop.requestMetrics.sizeByCategory.stylesheet
          topPercentStats[i][2] +=
            s.desktop.requestMetrics.sizeByCategory.script
          topPercentStats[i][3] += s.desktop.requestMetrics.sizeByCategory.image
          topPercentStats[i][4] += s.desktop.requestMetrics.sizeByCategory.font
          topPercentStats[i][5] += s.desktop.requestMetrics.sizeByCategory.media
          topPercentStats[i][6] +=
            s.desktop.requestMetrics.sizeByCategory.redirect
          topPercentStats[i][7] += s.desktop.requestMetrics.sizeByCategory.ajax
          topPercentStats[i][8] += s.desktop.requestMetrics.sizeByCategory.other

          topPercentJS[i][0] += s.desktop.mainthreadWorkBreakdown[jsThreads[0]]
          topPercentJS[i][1] += s.desktop.mainthreadWorkBreakdown[jsThreads[1]]
          topPercentJS[i][2] += s.desktop.mainthreadWorkBreakdown[jsThreads[2]]
          topPercentJS[i][3] += s.desktop.mainthreadWorkBreakdown[jsThreads[3]]
          topPercentJS[i][4] += s.desktop.mainthreadWorkBreakdown[jsThreads[4]]
          topPercentJS[i][5] += s.desktop.mainthreadWorkBreakdown[jsThreads[5]]
          topPercentJS[i][6] += s.desktop.mainthreadWorkBreakdown[jsThreads[6]]
        }
      })
      top25PercentArr.map((p, i) => {
        if (s.mobilePerf <= p) {
          top25PercentPerf[i] += 1
        }
        if (s.desktopPerf <= p) {
          top25PercentDesktopPerf[i] += 1
        }
        if (s.desktopPerf <= p && s.desktopPerf > p - 0.25) {
          top25Scores[i][0] += s.desktop.scores.performance
          top25Scores[i][1] += s.desktop.scores.accessibility
          top25Scores[i][2] += s.desktop.scores.bestPractices
          top25Scores[i][3] += s.desktop.scores.seo

          top25DesktopLoads[i][0] += s.desktop[loadSpeeds[0]]
          top25DesktopLoads[i][1] += s.desktop[loadSpeeds[1]]
          top25DesktopLoads[i][2] += s.desktop[loadSpeeds[2]]
          top25DesktopLoads[i][3] += s.desktop[loadSpeeds[3]]
        }

        if (s.mobilePerf <= p && s.mobilePerf > p - 0.25) {
          top25Loads[i][0] += s.mobile[loadSpeeds[0]]
          top25Loads[i][1] += s.mobile[loadSpeeds[1]]
          top25Loads[i][2] += s.mobile[loadSpeeds[2]]
          top25Loads[i][3] += s.mobile[loadSpeeds[3]]
        }
      })
    })

    let topPercent = topPercentArr.map((p, i) => {
      let count = topPercentPerf[i]
      if (i !== 0) {
        count = count - topPercentPerf[i - 1]
      }
      return { p: p, label: `${p * 100 - 10}% - ${p * 100}%`, count }
    })

    let topDesktopPercent = topPercentArr.map((p, i) => {
      let count = topDesktopPercentPerf[i]
      if (i !== 0) {
        count = count - topDesktopPercentPerf[i - 1]
      }
      return { p: p, label: `${p * 100 - 10}% - ${p * 100}%`, count }
    })

    let top25Percent = top25PercentArr.map((p, i) => {
      let count = top25PercentPerf[i]
      if (i !== 0) {
        count = count - top25PercentPerf[i - 1]
      }
      return { p: p, label: `${p * 100 - 25}% - ${p * 100}%`, count }
    })

    let top25PercentDesktop = top25PercentArr.map((p, i) => {
      let count = top25PercentDesktopPerf[i]
      if (i !== 0) {
        count = count - top25PercentDesktopPerf[i - 1]
      }
      return { p: p, label: `${p * 100 - 25}% - ${p * 100}%`, count }
    })

    top25Scores = top25Scores.map((scores, i) => {
      return scores.map((score, j) => {
        return Math.round((100 * score) / top25PercentDesktop[i].count)
      })
    })

    const barData = {
      labels: topPercent.map(p => p.label),
      datasets: [
        {
          label: 'Mobile Performance',
          backgroundColor: 'rgba(255,99,132,0.2)',
          borderColor: 'rgba(255,99,132,1)',
          borderWidth: 1,
          hoverBackgroundColor: 'rgba(255,99,132,0.4)',
          hoverBorderColor: 'rgba(255,99,132,1)',
          data: topPercent.map(p => p.count),
        },
        {
          label: 'Desktop Performance',
          backgroundColor: randomColors[0][0],
          borderColor: randomColors[0][2],
          borderWidth: 1,
          hoverBackgroundColor: randomColors[0][1],
          hoverBorderColor: randomColors[0][2],
          data: topDesktopPercent.map(p => p.count),
        },
      ],
    }

    const top25ScoresBarData = {
      labels: top25PercentDesktop.map(p => p.label),
      datasets: scoreNames.map((scoreName, i) => {
        return {
          label: scoreName,
          backgroundColor: randomColors[i][0],
          borderColor: randomColors[i][2],
          borderWidth: 1,
          hoverBackgroundColor: randomColors[i][1],
          hoverBorderColor: randomColors[i][2],
          data: top25Scores[i],
        }
      }),
    }

    const stackedPaintBarData = {
      labels: top25PercentDesktop.map(p => p.label),
      datasets: [
        ...loadSpeeds.map((d, i) => {
          return {
            label: `Desktop - ${d}`,
            backgroundColor: randomColors[i][0],
            borderColor: randomColors[i][2],
            borderWidth: 1,
            hoverBackgroundColor: randomColors[i][1],
            hoverBorderColor: randomColors[i][2],
            stack: 'desktop',
            data: top25DesktopLoads.map((s, j) => {
              const total = i === 0 ? s[i] : s[i] - s[i - 1]
              return Math.round(total / top25PercentDesktop[j].count)
            }),
          }
        }),
        ...loadSpeeds.map((d, i) => {
          return {
            label: `Mobile - ${d}`,
            backgroundColor: randomColors[i][0],
            borderColor: randomColors[i][2],
            borderWidth: 1,
            hoverBackgroundColor: randomColors[i][1],
            hoverBorderColor: randomColors[i][2],
            stack: 'mobile',
            data: top25Loads.map((s, j) => {
              const total = i === 0 ? s[i] : s[i] - s[i - 1]
              return Math.round(total / top25Percent[j].count)
            }),
          }
        }),
      ],
    }

    const stackedBarData = {
      labels: barData.labels,
      datasets: dataRequests.map((d, i) => {
        return {
          label: d,
          backgroundColor: randomColors[i][0],
          borderColor: randomColors[i][2],
          borderWidth: 1,
          hoverBackgroundColor: randomColors[i][1],
          hoverBorderColor: randomColors[i][2],
          // stack: '2',
          data: topPercentStats.map((s, j) => {
            return Math.round(s[i] / topDesktopPercent[j].count)
          }),
        }
      }),
    }

    console.log(stackedPaintBarData, stackedBarData)

    const requestsLineData = {
      labels: barData.labels,
      datasets: dataRequests.map((d, i) => {
        return {
          label: d,
          borderColor: randomColors[i][2],
          fill: false,
          borderWidth: 1,
          data: topPercentStats.map((s, j) => {
            return Math.round(s[i] / topDesktopPercent[j].count)
          }),
        }
      }),
    }

    const lineOptions = {
      tooltips: {
        callbacks: {
          label: function(tooltipItem, data) {
            console.log(tooltipItem, data)
            var value = tooltipItem.yLabel
            value = value.toString()
            value = value.split(/(?=(?:...)*$)/)
            value = value.join(',')
            return value
          },
        }, // end callbacks:
      }, //end tooltips
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              userCallback: function(value, index, values) {
                // Convert the number to a string and splite the string every 3 charaters from the end
                value = value.toString()
                value = value.split(/(?=(?:...)*$)/)
                value = value.join(',')
                return value
              },
            },
          },
        ],
      },
    }

    const stackedBarOptions = {
      tooltips: {
        callbacks: {
          label: function(tooltipItem, data) {
            console.log(tooltipItem, data)
            var value = tooltipItem.yLabel
            value = value.toString()
            value = value.split(/(?=(?:...)*$)/)
            value = value.join(',')
            return value
          },
        }, // end callbacks:
      }, //end tooltips
      scales: {
        xAxes: [
          {
            stacked: true,
          },
        ],
        yAxes: [
          {
            stacked: true,
            ticks: {
              beginAtZero: true,
              userCallback: function(value, index, values) {
                // Convert the number to a string and splite the string every 3 charaters from the end
                value = value.toString()
                value = value.split(/(?=(?:...)*$)/)
                value = value.join(',')
                return value
              },
            },
          },
        ],
      },
    }

    const stackedJSBarData = {
      labels: barData.labels,
      datasets: jsThreads.map((d, i) => {
        return {
          label: d,
          backgroundColor: randomColors[i][0],
          borderColor: randomColors[i][2],
          borderWidth: 1,
          hoverBackgroundColor: randomColors[i][1],
          hoverBorderColor: randomColors[i][2],
          // stack: '2',
          data: topPercentJS.map((s, j) => {
            return Math.round(s[i] / topDesktopPercent[j].count)
          }),
        }
      }),
    }

    const jsLineData = {
      labels: barData.labels,
      datasets: jsThreads.map((d, i) => {
        return {
          label: d,
          borderColor: randomColors[i][2],
          fill: false,
          borderWidth: 1,
          data: topPercentJS.map((s, j) => {
            return Math.round(s[i] / topDesktopPercent[j].count)
          }),
        }
      }),
    }

    const scatterData = {
      datasets: [
        {
          label: 'Desktop vs Mobile',
          labels: data_speed.filter(s => s.growth < 100).map(s => s.name),
          data: data_speed
            .filter(s => s.growth < 100)
            .map(s => ({ x: s.desktopPerf, y: s.mobilePerf })),
        },
      ],
    }

    const scatterOptions = {
      tooltips: {
        callbacks: {
          label: function(tooltipItem, data) {
            console.log(tooltipItem, data)
            var label = data.datasets[0].labels[tooltipItem.index]
            return `${label} - ${tooltipItem.xLabel} ${tooltipItem.yLabel}`
          },
        },
      },
    }

    const scatterEmployeeData = {
      datasets: [
        {
          label: 'Employee vs Desktop Speed',
          labels: data_speed.map(s => s.name),
          data: data_speed.map(s => ({
            x: s.feb2019employees,
            y: s.desktopPerf,
          })),
        },
      ],
    }

    const scatterSEOEmployeeData = {
      datasets: [
        {
          label: 'Employee vs SEO',
          labels: data_speed.map(s => s.name),
          data: data_speed.map(s => ({
            x: s.feb2019employees,
            y: s.desktop.scores.seo ? s.desktop.scores.seo * 100 : null,
          })),
        },
      ],
    }

    return (
      <Layout location={location} blocks={data_blocks} hideFooter>
        <Meta site={siteMetadata} title="About" />
        <section>
          <div className="container mt-5 pt-5">
            <div className="row mb-5">
              <div className="col">
                <DataTable
                  title="Top 1000 fastest growing SaaS companies with PageSpeed stats"
                  columns={columns}
                  data={filteredItems}
                  pagination
                  subHeader
                  subHeaderComponent={
                    <Filter onFilter={value => this.setFilterText(value)} />
                  }
                />
              </div>
            </div>

            <div className="row mb-5">
              <div className="col">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th scope="col">Type</th>
                      <th scope="col" colspan="3">
                        Mobile
                      </th>
                      <th scope="col" colspan="3">
                        Desktop
                      </th>
                    </tr>
                    <tr>
                      <th scope="col">Type</th>
                      <th scope="col">Min</th>
                      <th scope="col">Average</th>
                      <th scope="col">Max</th>
                      <th scope="col">Min</th>
                      <th scope="col">Average</th>
                      <th scope="col">Max</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row">Performance Score</th>
                      <td>
                        {Math.min.apply(
                          null,
                          data_speed.map(s => s.mobile.scores.performance)
                        )}
                      </td>
                      <td>{averageMobilePerf}</td>
                      <td>
                        {Math.max.apply(
                          null,
                          data_speed.map(s => s.mobile.scores.performance)
                        )}
                      </td>
                      <td>
                        {Math.min.apply(
                          null,
                          data_speed.map(s => s.desktop.scores.performance)
                        )}
                      </td>
                      <td>{averageDesktopPerf}</td>
                      <td>
                        {Math.max.apply(
                          null,
                          data_speed.map(s => s.desktop.scores.performance)
                        )}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Accessibility Score</th>
                      <td>
                        {Math.min.apply(
                          null,
                          data_speed.map(s => s.mobile.scores.accessibility)
                        )}
                      </td>
                      <td>
                        {averageScore(data_speed, 'mobile', 'accessibility')}
                      </td>
                      <td>
                        {Math.max.apply(
                          null,
                          data_speed.map(s => s.mobile.scores.accessibility)
                        )}
                      </td>
                      <td>
                        {Math.min.apply(
                          null,
                          data_speed.map(s => s.desktop.scores.accessibility)
                        )}
                      </td>
                      <td>
                        {averageScore(data_speed, 'desktop', 'accessibility')}
                      </td>
                      <td>
                        {Math.max.apply(
                          null,
                          data_speed.map(s => s.desktop.scores.accessibility)
                        )}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Best Practices Score</th>
                      <td>
                        {Math.min.apply(
                          null,
                          data_speed.map(s => s.mobile.scores.bestPractices)
                        )}
                      </td>
                      <td>
                        {averageScore(data_speed, 'mobile', 'bestPractices')}
                      </td>
                      <td>
                        {Math.max.apply(
                          null,
                          data_speed.map(s => s.mobile.scores.bestPractices)
                        )}
                      </td>
                      <td>
                        {Math.min.apply(
                          null,
                          data_speed.map(s => s.desktop.scores.bestPractices)
                        )}
                      </td>
                      <td>
                        {averageScore(data_speed, 'desktop', 'bestPractices')}
                      </td>
                      <td>
                        {Math.max.apply(
                          null,
                          data_speed.map(s => s.desktop.scores.bestPractices)
                        )}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">SEO Score</th>
                      <td>
                        {Math.min.apply(
                          null,
                          data_speed.map(s => s.mobile.scores.seo)
                        )}
                      </td>
                      <td>{averageScore(data_speed, 'mobile', 'seo')}</td>
                      <td>
                        {Math.max.apply(
                          null,
                          data_speed.map(s => s.mobile.scores.seo)
                        )}
                      </td>
                      <td>
                        {Math.min.apply(
                          null,
                          data_speed.map(s => s.desktop.scores.seo)
                        )}
                      </td>
                      <td>{averageScore(data_speed, 'desktop', 'seo')}</td>
                      <td>
                        {Math.max.apply(
                          null,
                          data_speed.map(s => s.desktop.scores.seo)
                        )}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Request Counts</th>
                      <td>
                        {Math.min.apply(
                          null,
                          data_speed.map(
                            s => s.mobile.requestMetrics.requestCount
                          )
                        )}
                      </td>
                      <td>
                        {averageRequestMetrics(
                          data_speed,
                          'mobile',
                          'requestCount'
                        )}
                      </td>
                      <td>
                        {Math.max.apply(
                          null,
                          data_speed.map(
                            s => s.mobile.requestMetrics.requestCount
                          )
                        )}
                      </td>
                      <td>
                        {Math.min.apply(
                          null,
                          data_speed.map(
                            s => s.desktop.requestMetrics.requestCount
                          )
                        )}
                      </td>
                      <td>
                        {averageRequestMetrics(
                          data_speed,
                          'desktop',
                          'requestCount'
                        )}
                      </td>
                      <td>
                        {Math.max.apply(
                          null,
                          data_speed.map(
                            s => s.desktop.requestMetrics.requestCount
                          )
                        )}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Page Size (bytes)</th>
                      <td>
                        {Math.min
                          .apply(
                            null,
                            data_speed.map(
                              s =>
                                s.mobile.requestMetrics.totalEncodedBodyLength
                            )
                          )
                          .toLocaleString()}
                      </td>
                      <td>
                        {averageRequestMetrics(
                          data_speed,
                          'mobile',
                          'totalEncodedBodyLength'
                        ).toLocaleString()}
                      </td>
                      <td>
                        {Math.max
                          .apply(
                            null,
                            data_speed.map(
                              s =>
                                s.mobile.requestMetrics.totalEncodedBodyLength
                            )
                          )
                          .toLocaleString()}
                      </td>
                      <td>
                        {Math.min
                          .apply(
                            null,
                            data_speed.map(
                              s =>
                                s.desktop.requestMetrics.totalEncodedBodyLength
                            )
                          )
                          .toLocaleString()}
                      </td>
                      <td>
                        {averageRequestMetrics(
                          data_speed,
                          'desktop',
                          'totalEncodedBodyLength'
                        ).toLocaleString()}
                      </td>
                      <td>
                        {Math.max
                          .apply(
                            null,
                            data_speed.map(
                              s =>
                                s.desktop.requestMetrics.totalEncodedBodyLength
                            )
                          )
                          .toLocaleString()}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">First Contentful Paint (ms)</th>
                      <td>
                        {Math.min
                          .apply(
                            null,
                            data_speed.map(s => s.mobile.firstContentfulPaint)
                          )
                          .toLocaleString()}
                      </td>
                      <td>
                        {averageStat(
                          data_speed,
                          'mobile',
                          'firstContentfulPaint'
                        ).toLocaleString()}
                      </td>
                      <td>
                        {Math.max
                          .apply(
                            null,
                            data_speed.map(s => s.mobile.firstContentfulPaint)
                          )
                          .toLocaleString()}
                      </td>
                      <td>
                        {Math.min
                          .apply(
                            null,
                            data_speed.map(s => s.desktop.firstContentfulPaint)
                          )
                          .toLocaleString()}
                      </td>
                      <td>
                        {averageStat(
                          data_speed,
                          'desktop',
                          'firstContentfulPaint'
                        ).toLocaleString()}
                      </td>
                      <td>
                        {Math.max
                          .apply(
                            null,
                            data_speed.map(s => s.desktop.firstContentfulPaint)
                          )
                          .toLocaleString()}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">First Meaningful Paint (ms)</th>
                      <td>
                        {Math.min
                          .apply(
                            null,
                            data_speed.map(s => s.mobile.firstMeaningfulPaint)
                          )
                          .toLocaleString()}
                      </td>
                      <td>
                        {averageStat(
                          data_speed,
                          'mobile',
                          'firstMeaningfulPaint'
                        ).toLocaleString()}
                      </td>
                      <td>
                        {Math.max
                          .apply(
                            null,
                            data_speed.map(s => s.mobile.firstMeaningfulPaint)
                          )
                          .toLocaleString()}
                      </td>
                      <td>
                        {Math.min
                          .apply(
                            null,
                            data_speed.map(s => s.desktop.firstMeaningfulPaint)
                          )
                          .toLocaleString()}
                      </td>
                      <td>
                        {averageStat(
                          data_speed,
                          'desktop',
                          'firstMeaningfulPaint'
                        ).toLocaleString()}
                      </td>
                      <td>
                        {Math.max
                          .apply(
                            null,
                            data_speed.map(s => s.desktop.firstMeaningfulPaint)
                          )
                          .toLocaleString()}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Speed Index (ms)</th>
                      <td>
                        {Math.min
                          .apply(null, data_speed.map(s => s.mobile.speedIndex))
                          .toLocaleString()}
                      </td>
                      <td>
                        {averageStat(
                          data_speed,
                          'mobile',
                          'speedIndex'
                        ).toLocaleString()}
                      </td>
                      <td>
                        {Math.max
                          .apply(null, data_speed.map(s => s.mobile.speedIndex))
                          .toLocaleString()}
                      </td>
                      <td>
                        {Math.min
                          .apply(
                            null,
                            data_speed.map(s => s.desktop.speedIndex)
                          )
                          .toLocaleString()}
                      </td>
                      <td>
                        {averageStat(
                          data_speed,
                          'desktop',
                          'speedIndex'
                        ).toLocaleString()}
                      </td>
                      <td>
                        {Math.max
                          .apply(
                            null,
                            data_speed.map(s => s.desktop.speedIndex)
                          )
                          .toLocaleString()}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Time To Interactive (ms)</th>
                      <td>
                        {Math.min
                          .apply(
                            null,
                            data_speed.map(s => s.mobile.timeToInteractive)
                          )
                          .toLocaleString()}
                      </td>
                      <td>
                        {averageStat(
                          data_speed,
                          'mobile',
                          'timeToInteractive'
                        ).toLocaleString()}
                      </td>
                      <td>
                        {Math.max
                          .apply(
                            null,
                            data_speed.map(s => s.mobile.timeToInteractive)
                          )
                          .toLocaleString()}
                      </td>
                      <td>
                        {Math.min
                          .apply(
                            null,
                            data_speed.map(s => s.desktop.timeToInteractive)
                          )
                          .toLocaleString()}
                      </td>
                      <td>
                        {averageStat(
                          data_speed,
                          'desktop',
                          'timeToInteractive'
                        ).toLocaleString()}
                      </td>
                      <td>
                        {Math.max
                          .apply(
                            null,
                            data_speed.map(s => s.desktop.timeToInteractive)
                          )
                          .toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="row mb-5">
              <div className="col">
                <h2>Performance scores grouped by 25%</h2>
                <Bar data={top25ScoresBarData} />
                <p>test</p>
              </div>
            </div>

            <Bar data={stackedPaintBarData} options={stackedBarOptions} />
            <Line data={requestsLineData} options={lineOptions} />
            <Bar data={stackedBarData} options={stackedBarOptions} />
            <Line data={jsLineData} options={lineOptions} />
            <Bar data={stackedJSBarData} options={stackedBarOptions} />
            <Scatter data={scatterSEOEmployeeData} options={scatterOptions} />
            <Scatter data={scatterData} options={scatterOptions} />
            <Scatter data={scatterEmployeeData} options={scatterOptions} />
            <Bar data={barData} />

            <div className="row mb-5">
              <div className="col">
                <h2>Performance scores grouped by 25%</h2>
                <Bar data={top25ScoresBarData} />
                <p>test</p>
              </div>
            </div>

            <div className="row mb-5">
              <div className="col">
                <h2>Performance scores grouped by 25%</h2>
                <Bar data={top25ScoresBarData} />
                <p>test</p>
              </div>
            </div>

            <div className="row mb-5">
              <div className="col">
                <h2>Performance scores grouped by 25%</h2>
                <Bar data={top25ScoresBarData} />
                <p>test</p>
              </div>
            </div>

            <div className="row mb-5">
              <div className="col">
                <h2>Performance scores grouped by 25%</h2>
                <Bar data={top25ScoresBarData} />
                <p>test</p>
              </div>
            </div>

            <div className="row mb-5">
              <div className="col">
                <h2>Performance scores grouped by 25%</h2>
                <Bar data={top25ScoresBarData} />
                <p>test</p>
              </div>
            </div>

            <div className="row mb-5">
              <div className="col">
                <h2>Performance scores grouped by 25%</h2>
                <Bar data={top25ScoresBarData} />
                <p>test</p>
              </div>
            </div>

            <div className="row mb-5">
              <div className="col">
                <h2>Performance scores grouped by 25%</h2>
                <Bar data={top25ScoresBarData} />
                <p>test</p>
              </div>
            </div>

            <div className="row mb-5">
              <div className="col">
                <h2>Performance scores grouped by 25%</h2>
                <Bar data={top25ScoresBarData} />
                <p>test</p>
              </div>
            </div>

            <div className="row mb-5">
              <div className="col">
                <h2>Performance scores grouped by 25%</h2>
                <Bar data={top25ScoresBarData} />
                <p>test</p>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    )
  }
}

export default Speed

export const speedQuery = graphql`
  query SpeedQuery {
    site {
      meta: siteMetadata {
        title
        description
        url: siteUrl
        author
        twitter
        adsense
      }
    }
    remark: allMarkdownRemark(
      sort: { fields: [frontmatter___title], order: DESC }
      filter: { frontmatter: { layout: { in: ["block"] } } }
    ) {
      blocks: edges {
        block: node {
          html
          frontmatter {
            layout
            title
            path
            icon
            category
            tags
            description
            date(formatString: "YYYY/MM/DD")
            image {
              childImageSharp {
                fixed(width: 500) {
                  ...GatsbyImageSharpFixed_withWebp
                }
              }
            }
          }
        }
      }
    }
    allSpeedJson {
      edges {
        speedData: node {
          name
          url
          rank
          july2018employees
          feb2019employees
          mobile {
            firstContentfulPaint
            speedIndex
            firstMeaningfulPaint
            timeToInteractive
            scores {
              performance
              accessibility
              bestPractices
              seo
            }
            requestMetrics {
              requestCount
              totalEncodedBodyLength
              sizeByCategory {
                stylesheet
                script
                image
                font
                redirect
                document
                ajax
                media
                other
              }
            }
            mainthreadWorkBreakdown {
              scriptEvaluation
              other
              styleLayout
              scriptParseCompile
              garbageCollection
              parseHTML
              paintCompositeRender
            }
          }
          desktop {
            firstContentfulPaint
            speedIndex
            firstMeaningfulPaint
            timeToInteractive
            scores {
              performance
              accessibility
              bestPractices
              seo
            }
            requestMetrics {
              requestCount
              totalEncodedBodyLength
              sizeByCategory {
                stylesheet
                script
                image
                font
                redirect
                document
                ajax
                media
                other
              }
            }
            mainthreadWorkBreakdown {
              scriptEvaluation
              other
              styleLayout
              scriptParseCompile
              garbageCollection
              parseHTML
              paintCompositeRender
            }
          }
        }
      }
    }
  }
`
