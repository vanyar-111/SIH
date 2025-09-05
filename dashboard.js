// MicroplasticsDashboard.framer.tsx
// Framer-ready, no Tailwind, robust CSV parsing, Power-BI-like styling

import * as React from "react"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
} from "recharts"

// ========= THEME (matches your screenshot) =========
const COLORS = {
    page: "#0b1422",
    card: "#101c2b",
    grid: "#1c2a40",
    text: "#dbe5ff",
    muted: "#9fb3d1",
    accent: "#4da6ff",
    green: "#61d095",
}

// ========= YOUR RAW CSV =========
const RAW_CSV = `Date,Microplastics (integer units; original pieces/mL × 100000000000),Concentration Class,pH,Turbidity (NTU),Size/Volume Ratio,Status
2023-01-01,381,Medium,7.78,11.2,0.93,OK
2023-01-02,951,High,6.67,90.4,1.47,Alert
2023-01-03,735,High,6.82,51.0,0.97,Alert
2023-01-04,603,Medium,8.3,82.8,0.53,OK
2023-01-05,164,Low,7.71,32.7,0.69,OK
2023-01-06,164,Low,6.52,89.7,2.36,OK
2023-01-07,68,Low,6.7,39.5,1.11,OK
2023-01-08,868,High,7.83,2.1,1.88,Alert
2023-01-09,605,Medium,6.51,90.6,2.57,OK
2023-01-10,711,High,6.82,10.0,3.48,Alert
2023-01-11,878,High,7.57,21.9,1.6,Alert
2023-01-12,504,Medium,7.82,32.5,1.75,OK
2023-01-13,67,Low,7.86,43.2,0.86,OK
2023-01-14,973,High,7.34,91.8,3.22,Alert
2023-01-15,486,Medium,6.69,82.7,1.26,OK
2023-01-16,393,Medium,6.55,52.7,3.64,OK
2023-01-17,689,High,7.54,49.2,3.31,Alert
2023-01-18,632,Medium,7.49,15.1,1.84,OK
2023-01-19,776,High,6.5,88.4,1.72,Alert
2023-01-20,416,Medium,7.37,3.6,4.19,OK
2023-01-21,97,Low,7.02,23.3,4.01,OK
2023-01-22,668,High,7.21,68.8,3.95,Alert
2023-01-23,436,Medium,7.57,17.2,1.27,OK
2023-01-24,676,High,6.78,13.4,2.99,Alert
2023-01-25,979,High,6.71,94.0,2.6,Alert
2023-01-26,206,Low,8.37,42.4,1.14,OK
2023-01-27,57,Low,7.59,42.9,0.3,OK
2023-01-28,321,Medium,7.58,31.6,1.75,OK
2023-01-29,141,Low,6.6,56.7,2.78,OK
2023-01-30,517,Medium,6.69,40.3,0.72,OK
2023-01-31,235,Low,8.32,59.3,2.46,OK
2023-02-01,922,High,7.38,62.8,2.75,Alert
2023-02-02,789,High,7.42,88.8,3.54,Alert
2023-02-03,640,Medium,8.13,38.1,2.05,OK
2023-02-04,332,Medium,6.53,101.3,5.73,OK
2023-02-05,941,High,7.91,65.8,1.4,Alert
2023-02-06,535,Medium,6.54,23.4,4.2,OK
2023-02-07,983,High,8.0,30.3,3.34,Alert
2023-02-08,582,Medium,7.31,22.1,1.63,OK
2023-02-09,637,Medium,7.42,14.5,1.32,OK
2023-02-10,540,Medium,7.59,2.4,3.75,OK
2023-02-11,99,Low,8.38,35.7,0.26,OK
2023-02-12,837,High,7.27,59.4,2.89,Alert
2023-02-13,328,Medium,8.42,39.8,3.84,OK
2023-02-14,195,Low,8.31,44.3,4.4,OK
2023-02-15,50,Low,6.89,90.5,1.78,OK
2023-02-16,595,Medium,6.64,35.5,4.12,OK
2023-02-17,681,Medium,6.7,51.9,0.64,OK
2023-02-18,26,Low,6.54,78.6,4.25,OK
2023-02-19,517,Medium,6.69,40.3,0.72,OK
2023-02-20,536,Medium,8.0,43.2,0.86,OK
2023-02-21,973,High,7.34,91.8,3.22,Alert
2023-02-22,486,Medium,6.69,82.7,1.26,OK
2023-02-23,393,Medium,6.55,52.7,3.64,OK
2023-02-24,689,High,7.54,49.2,3.31,Alert
2023-02-25,632,Medium,7.49,15.1,1.84,OK
2023-02-26,776,High,6.5,88.4,1.72,Alert
2023-02-27,416,Medium,7.37,3.6,4.19,OK
2023-02-28,97,Low,7.02,23.3,4.01,OK
2023-03-01,668,High,7.21,68.8,3.95,Alert
2023-03-02,436,Medium,7.57,17.2,1.27,OK
2023-03-03,676,High,6.78,13.4,2.99,Alert
2023-03-04,979,High,6.71,94.0,2.6,Alert
2023-03-05,206,Low,8.37,42.4,1.14,OK
... (truncated for brevity, keep the rest of your CSV here)`

type Row = {
    Date: string
    "Microplastics (integer units; original pieces/mL × 100000000000)": number
    "Concentration Class": "High" | "Medium" | "Low"
    pH: number
    "Turbidity (NTU)": number
    "Size/Volume Ratio": number
    Status: "OK" | "Alert"
}

// ========= CSV PARSER (robust to the × char and whitespace) =========
function parseCsv(csv: string): Row[] {
    const lines = csv.trim().split(/\r?\n/)
    const headers = lines[0].split(",").map((h) => h.trim())
    const out: Row[] = []

    for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(",") // safe: no quoted commas in your data
        if (cols.length !== headers.length) continue
        const rec: any = {}
        headers.forEach((h, idx) => {
            let v: any = cols[idx]?.trim()

            // numeric coercion for known columns
            if (
                h.startsWith("Microplastics") ||
                h === "pH" ||
                h.startsWith("Turbidity") ||
                h === "Size/Volume Ratio"
            ) {
                // remove any stray symbols/spaces
                v = Number(String(v).replace(/[^\d.+-eE]/g, ""))
            }
            rec[h] = v
        })
        // skip empty lines
        if (rec.Date) out.push(rec as Row)
    }
    // sort by Date asc
    out.sort((a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime())
    return out
}

// ========= UTIL =========
const nf = (n: number, d = 2) =>
    new Intl.NumberFormat("en-US", { maximumFractionDigits: d }).format(n)
const compact = (n: number) =>
    new Intl.NumberFormat("en", {
        notation: "compact",
        maximumFractionDigits: 1,
    }).format(n)

// ========= COMPONENT =========
export default function MicroplasticsDashboard({
    csvText = RAW_CSV,
}: {
    csvText?: string
}) {
    const data = React.useMemo(() => parseCsv(csvText), [csvText])

    // filter state
    const [status, setStatus] = React.useState<"All" | "OK" | "Alert">("All")
    const filtered = React.useMemo(
        () =>
            status === "All" ? data : data.filter((r) => r.Status === status),
        [data, status]
    )

    // summary
    const sums = React.useMemo(() => {
        const n = filtered.length || 1
        const s = filtered.reduce(
            (a, r) => {
                a.mp +=
                    r[
                        "Microplastics (integer units; original pieces/mL × 100000000000)"
                    ]
                a.ph += r.pH
                a.tu += r["Turbidity (NTU)"]
                a.sv += r["Size/Volume Ratio"]
                return a
            },
            { mp: 0, ph: 0, tu: 0, sv: 0 }
        )
        return {
            avgMP: s.mp / n,
            avgPH: s.ph / n,
            avgTU: s.tu / n,
            avgSV: s.sv / n,
            totMP: s.mp,
            totPH: s.ph,
            totTU: s.tu,
            totSV: s.sv,
        }
    }, [filtered])

    // chart series
    const microplasticsSeries = React.useMemo(
        () =>
            filtered.map((r) => ({
                date: r.Date,
                value: r[
                    "Microplastics (integer units; original pieces/mL × 100000000000)"
                ],
            })),
        [filtered]
    )
    const phSeries = React.useMemo(
        () =>
            filtered.map((r) => ({
                date: r.Date,
                value: r.pH,
            })),
        [filtered]
    )
    const classBars = React.useMemo(() => {
        const c: Record<string, number> = { High: 0, Medium: 0, Low: 0 }
        filtered.forEach((r) => {
            c[r["Concentration Class"]] = (c[r["Concentration Class"]] || 0) + 1
        })
        return [
            { name: "High", count: c.High || 0 },
            { name: "Medium", count: c.Medium || 0 },
            { name: "Low", count: c.Low || 0 },
        ]
    }, [filtered])

    // styles
    const page: React.CSSProperties = {
        background: COLORS.page,
        color: COLORS.text,
        minHeight: "100%",
        fontFamily:
            "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
        padding: 24,
    }
    const card: React.CSSProperties = {
        background: COLORS.card,
        border: `1px solid ${COLORS.grid}`,
        borderRadius: 16,
        boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
        padding: 16,
    }
    const kpiValue: React.CSSProperties = {
        color: COLORS.accent,
        fontSize: 48,
        lineHeight: 1,
        fontWeight: 600,
        letterSpacing: 1,
    }
    const labelMuted: React.CSSProperties = {
        color: COLORS.muted,
        textTransform: "uppercase",
        letterSpacing: 1.6,
        fontSize: 12,
    }

    return (
        <div style={page}>
            <h2 style={{ marginBottom: 16 }}>Microplastics Dashboard</h2>

            {/* KPI Row */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                    gap: 12,
                    marginBottom: 16,
                }}
            >
                <div style={card}>
                    <div style={labelMuted}>Average Microplastic Count</div>
                    <div style={kpiValue}>{nf(sums.avgMP, 2)}</div>
                </div>
                <div style={card}>
                    <div style={labelMuted}>Average Size/Vol Ratio</div>
                    <div style={kpiValue}>{nf(sums.avgSV, 2)}</div>
                </div>
                <div style={card}>
                    <div style={labelMuted}>Average Turbidity</div>
                    <div style={kpiValue}>{nf(sums.avgTU, 2)}</div>
                </div>
                <div style={card}>
                    <div style={labelMuted}>Average pH Value</div>
                    <div style={kpiValue}>{nf(sums.avgPH, 2)}</div>
                </div>
            </div>

            {/* Main grid */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr",
                    gap: 16,
                    alignItems: "start",
                }}
            >
                {/* Table + filter */}
                <div style={card}>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 12,
                        }}
                    >
                        <div style={{ color: COLORS.muted, fontWeight: 600 }}>
                            Data Table
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                            {(["All", "OK", "Alert"] as const).map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setStatus(f)}
                                    style={{
                                        background:
                                            status === f
                                                ? COLORS.accent
                                                : "#2b3a51",
                                        color:
                                            status === f
                                                ? COLORS.page
                                                : COLORS.text,
                                        border: `1px solid ${COLORS.grid}`,
                                        borderRadius: 10,
                                        padding: "6px 10px",
                                        fontWeight: 700,
                                        cursor: "pointer",
                                    }}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={{ overflowX: "auto", maxHeight: 730 }}>
                        <table
                            style={{
                                width: "100%",
                                borderCollapse: "collapse",
                                fontSize: 13,
                            }}
                        >
                            <thead
                                style={{
                                    position: "sticky",
                                    top: 0,
                                    background: COLORS.card,
                                }}
                            >
                                <tr>
                                    {[
                                        "Date",
                                        "Microplastics (pieces/mL × 10^10)",
                                        "Concentration Class",
                                        "pH",
                                        "Turbidity (NTU)",
                                        "Size/Volume Ratio",
                                        "Status",
                                    ].map((h) => (
                                        <th
                                            key={h}
                                            style={{
                                                textAlign: "left",
                                                padding: 8,
                                                color: COLORS.muted,
                                                borderBottom: `1px solid ${COLORS.grid}`,
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((r, i) => (
                                    <tr
                                        key={i}
                                        style={{
                                            borderBottom: `1px solid ${COLORS.grid}`,
                                        }}
                                    >
                                        <td style={{ padding: 8 }}>{r.Date}</td>
                                        <td style={{ padding: 8 }}>
                                            {
                                                r[
                                                    "Microplastics (integer units; original pieces/mL × 100000000000)"
                                                ]
                                            }
                                        </td>
                                        <td style={{ padding: 8 }}>
                                            {r["Concentration Class"]}
                                        </td>
                                        <td style={{ padding: 8 }}>
                                            {nf(r.pH, 2)}
                                        </td>
                                        <td style={{ padding: 8 }}>
                                            {nf(r["Turbidity (NTU)"], 2)}
                                        </td>
                                        <td style={{ padding: 8 }}>
                                            {nf(r["Size/Volume Ratio"], 2)}
                                        </td>
                                        <td style={{ padding: 8 }}>
                                            {r.Status}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot
                                style={{
                                    position: "sticky",
                                    bottom: 0,
                                    background: COLORS.card,
                                }}
                            >
                                <tr>
                                    <td
                                        style={{
                                            padding: 8,
                                            color: COLORS.muted,
                                            fontWeight: 700,
                                        }}
                                    >
                                        Total
                                    </td>
                                    <td style={{ padding: 8, fontWeight: 700 }}>
                                        {nf(sums.totMP, 0)}
                                    </td>
                                    <td />
                                    <td style={{ padding: 8, fontWeight: 700 }}>
                                        {nf(sums.totPH, 2)}
                                    </td>
                                    <td style={{ padding: 8, fontWeight: 700 }}>
                                        {nf(sums.totTU, 2)}
                                    </td>
                                    <td style={{ padding: 8, fontWeight: 700 }}>
                                        {nf(sums.totSV, 2)}
                                    </td>
                                    <td />
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

                {/* Charts column */}
                <div style={{ display: "grid", gap: 16 }}>
                    {/* Microplastics by Date */}
                    <div style={card}>
                        <div
                            style={{
                                color: COLORS.muted,
                                marginBottom: 8,
                                fontWeight: 600,
                            }}
                        >
                            Microplastics by Date
                        </div>
                        <div style={{ width: "100%", height: 200 }}>
                            <ResponsiveContainer>
                                <LineChart
                                    data={microplasticsSeries}
                                    margin={{
                                        top: 8,
                                        right: 12,
                                        left: 0,
                                        bottom: 0,
                                    }}
                                >
                                    <CartesianGrid
                                        stroke={COLORS.grid}
                                        strokeDasharray="3 3"
                                    />
                                    <XAxis
                                        dataKey="date"
                                        stroke={COLORS.muted}
                                        tick={{ fill: COLORS.muted }}
                                        minTickGap={20}
                                    />
                                    <YAxis
                                        stroke={COLORS.muted}
                                        tick={{ fill: COLORS.muted }}
                                        tickFormatter={compact}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            background: COLORS.card,
                                            border: `1px solid ${COLORS.grid}`,
                                            color: COLORS.text,
                                        }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="value"
                                        stroke={"#ff7d7d"}
                                        strokeWidth={2}
                                        dot={false}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Microplastics by Concentration Class */}
                    <div style={card}>
                        <div
                            style={{
                                color: COLORS.muted,
                                marginBottom: 8,
                                fontWeight: 600,
                            }}
                        >
                            Microplastics by Concentration Class
                        </div>
                        <div style={{ width: "100%", height: 200 }}>
                            <ResponsiveContainer>
                                <BarChart
                                    data={classBars}
                                    margin={{
                                        top: 8,
                                        right: 12,
                                        left: 0,
                                        bottom: 0,
                                    }}
                                >
                                    <CartesianGrid
                                        stroke={COLORS.grid}
                                        strokeDasharray="3 3"
                                    />
                                    <XAxis
                                        dataKey="name"
                                        stroke={COLORS.muted}
                                        tick={{ fill: COLORS.muted }}
                                    />
                                    <YAxis
                                        stroke={COLORS.muted}
                                        tick={{ fill: COLORS.muted }}
                                        allowDecimals={false}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            background: COLORS.card,
                                            border: `1px solid ${COLORS.grid}`,
                                            color: COLORS.text,
                                        }}
                                    />
                                    <Bar
                                        dataKey="count"
                                        fill={"#9d7dff"}
                                        radius={[6, 6, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* pH by Date */}
                    <div style={card}>
                        <div
                            style={{
                                color: COLORS.muted,
                                marginBottom: 8,
                                fontWeight: 600,
                            }}
                        >
                            pH by Date
                        </div>
                        <div style={{ width: "100%", height: 200 }}>
                            <ResponsiveContainer>
                                <LineChart
                                    data={phSeries}
                                    margin={{
                                        top: 8,
                                        right: 12,
                                        left: 0,
                                        bottom: 0,
                                    }}
                                >
                                    <CartesianGrid
                                        stroke={COLORS.grid}
                                        strokeDasharray="3 3"
                                    />
                                    <XAxis
                                        dataKey="date"
                                        stroke={COLORS.muted}
                                        tick={{ fill: COLORS.muted }}
                                        minTickGap={20}
                                    />
                                    <YAxis
                                        domain={[6, 9]}
                                        stroke={COLORS.muted}
                                        tick={{ fill: COLORS.muted }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            background: COLORS.card,
                                            border: `1px solid ${COLORS.grid}`,
                                            color: COLORS.text,
                                        }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="value"
                                        stroke={COLORS.green}
                                        strokeWidth={2}
                                        dot={false}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
