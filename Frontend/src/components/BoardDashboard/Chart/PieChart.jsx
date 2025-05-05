import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useSelector } from "react-redux";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = () => {
    const { taskQuantityInList } = useSelector(state => state.statistic);

    // Mảng màu cơ bản
    const baseColors = [
        '#4318FF', '#6AD2FF', '#01B574', '#FFB547', '#EFF4FB',
        '#AEA2C5', '#BCB19F', '#FF6B6B', '#4ECDC4', '#45B7D1',
        '#96CEB4', '#FFEEAD', '#D4A5A5', '#9B59B6', '#3498DB'
    ];

    // Hàm tạo màu ngẫu nhiên
    const generateRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    // Hàm tạo mảng màu đủ cho số lượng list
    const generateColors = (count) => {
        let colors = [...baseColors];

        // Nếu số lượng list nhiều hơn số màu có sẵn
        if (count > colors.length) {
            // Tạo thêm màu ngẫu nhiên
            for (let i = colors.length; i < count; i++) {
                colors.push(generateRandomColor());
            }
        }

        // Nếu số lượng list ít hơn, chỉ lấy số màu cần thiết
        return colors.slice(0, count);
    };

    const chartData = {
        labels: taskQuantityInList?.map(item => item.listTitle),
        datasets: [
            {
                label: 'Tasks',
                data: taskQuantityInList?.map(item => item?.totalTasks),
                backgroundColor: generateColors(taskQuantityInList?.length),
                hoverOffset: 5,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'left',
                labels: {
                    font: {
                        size: 14,
                    },
                    generateLabels: (chart) => {
                        const datasets = chart.data.datasets[0];
                        return chart.data.labels.map((label, index) => ({
                            text: `${label} (${datasets.data[index]})`,
                            fillStyle: datasets.backgroundColor[index],
                            hidden: false,
                            lineCap: 'butt',
                            lineDash: [],
                            lineDashOffset: 0,
                            lineJoin: 'miter',
                            lineWidth: 1,
                            strokeStyle: datasets.backgroundColor[index],
                            pointStyle: 'circle',
                            index: index
                        }));
                    }
                },
            },
            tooltip: {
                callbacks: {
                    label: (tooltipItem) => {
                        const total = tooltipItem.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = ((tooltipItem.raw / total) * 100).toFixed(1);
                        return `${tooltipItem.label}: ${tooltipItem.raw} (${percentage}%)`;
                    },
                },
            },
        },
    };

    return (
        <div>
            <div className={'flex items-center justify-center mt-2'}>
                <h3 className={'text-sm font-semibold text-gray-500'}>Task Distribution by List</h3>
            </div>
            <Pie data={chartData} options={options}/>
        </div>
    );
};

export default PieChart;
