import { Line } from 'react-chartjs-2';
import { Chart,CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend} from 'chart.js';

Chart.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default function LineChart({chartLabels,chartData,chartLineLabel}) {
    const labels = chartLabels;
    const color = chartLineLabel === "Temperature" ? "rgb(214, 40, 40)":"rgb(0, 48, 73)";
    const data = {
        labels: labels,
        datasets: [{
            label: chartLineLabel,
            data: chartData,
            fill: true,
            backgroundColor: color,
            borderColor: color,
            tension: 0.1
        }]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                type: 'category', 
            },
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div>
            <h2>tiny weather station - sensor reading</h2>
            <div className="chart-container">
                <Line data={data} options={options} />
            </div>
        </div>
    );

};
