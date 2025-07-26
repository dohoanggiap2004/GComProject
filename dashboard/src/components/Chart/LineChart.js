import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import {useSelector} from "react-redux";


ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LineChart = () => {
    const { monthlyRevenue } = useSelector(state => state.dashboard);

    // Tạo labels và data từ monthlyProgress
    const processData = () => {
        if (!monthlyRevenue || monthlyRevenue.length === 0) {
            return {
                labels: [],
                dataValues: []
            };
        }

        // Tạo labels và data values
        const labels = monthlyRevenue.map(item => {
            // Format tháng để luôn có 2 chữ số (01, 02, ..., 12)
            const monthStr = item._id.month.toString().padStart(2, '0');
            return `${item._id.year}-${monthStr}`;
        });

        const dataValues = monthlyRevenue.map(item => item.totalAmount);

        return { labels, dataValues };
    };

    const { labels, dataValues } = processData();

    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Card Completed',
                data: dataValues,
                borderColor: '#603DFF',
                backgroundColor: 'rgba(96, 61, 255, 0.2)',
                borderWidth: 2,
                pointRadius: 5,
                pointBackgroundColor: '#603DFF',
                fill: true,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Monthly Revenue',
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return `Revenue: ${context.parsed.y}`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Revenue',
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Month'
                }
            }
        },
        animation: {
            duration: 1500,
            easing: 'easeInOutQuad',
            animateScale: true,
        },
    };

    return <Line data={data} options={options} />;
};

export default LineChart;
