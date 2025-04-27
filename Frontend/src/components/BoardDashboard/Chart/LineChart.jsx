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
    const { monthlyProgress } = useSelector(state => state.statistic);

    // Tạo labels và data từ monthlyProgress
    const processData = () => {
        if (!monthlyProgress || monthlyProgress.length === 0) {
            return {
                labels: [],
                dataValues: []
            };
        }

        // Sắp xếp theo năm và tháng
        const sortedData = [...monthlyProgress].sort((a, b) => {
            if (a.year !== b.year) return a.year - b.year;
            return a.month - b.month;
        });

        // Tạo labels và data values
        const labels = sortedData.map(item => {
            // Format tháng để luôn có 2 chữ số (01, 02, ..., 12)
            const monthStr = item.month.toString().padStart(2, '0');
            return `${item.year}-${monthStr}`;
        });

        const dataValues = sortedData.map(item => item.completedCards);

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
                text: 'Monthly Board Progress',
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return `Completed Cards: ${context.parsed.y}`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Number of Cards'
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
