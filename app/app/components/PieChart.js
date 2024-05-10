'use client'
import { PieChart, Pie, Sector, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = (data) => ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}% ${data[index].name}`} {/* Access name using data[index].name */}
        </text>
    );
};

export default function Piechart(props)
{
    return(
        <PieChart width={700} height={600}>
        <Pie
          data={props.data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel(props.data)}
          outerRadius={250}
          fill="#8884d8"
          dataKey={props.datakey}
        >
          {props.data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    )
 
}