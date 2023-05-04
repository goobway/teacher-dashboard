loadNav();

// Define the colors for each student ID
const colors = [
    'rgba(255, 99, 132, 0.5)',
    'rgba(54, 162, 235, 0.5)',
    'rgba(255, 206, 86, 0.5)',
    'rgba(75, 192, 192, 0.5)',
    'rgba(153, 102, 255, 0.5)',
    'rgba(255, 159, 64, 0.5)',
    'rgba(255, 99, 132, 0.5)',
    'rgba(54, 162, 235, 0.5)',
    'rgba(255, 206, 86, 0.5)',
    'rgba(75, 192, 192, 0.5)',
];

function createScatterPlot(data) {
    const ctx = document.getElementById('scatter-plot').getContext('2d');
    const scatterData = formatScatterData(data);

    new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: scatterData
        },
        options: {
            scales: {
                x: {
                    type: 'category',
                },
                y: {
                    beginAtZero: true
                },
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Confidence by Prompt and Student ID'
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return `Student ID: ${context.dataset.label}, Confidence: ${context.parsed.y}`;
                        },
                    },
                },
            },
        },
    });
}

const studentNameMap = {
    0: 'Arlene',
    1: 'Bret',
    2: 'Cindy',
    3: 'Don',
    4: 'Emily',
    5: 'Franklin',
    6: 'Gert',
    7: 'Harold',
    8: 'Idalia',
    9: 'Jose'
};

function formatScatterData(data) {
    const scatterData = [];

    data.forEach(item => {
        const studentName = studentNameMap[item.studentId];
        const studentIndex = scatterData.findIndex(dataset => dataset.label === studentName);

        if (studentIndex >= 0) {
            scatterData[studentIndex].data.push({
                x: item.prompt,
                y: item.confidence,
            });
        } else {
            scatterData.push({
                label: studentName,
                data: [
                    {
                        x: item.prompt,
                        y: item.confidence,
                    },
                ],
                backgroundColor: colors[item.studentId],
            });
        }
    });

    return scatterData;
}

function fetchDataAndCreateScatterPlot() {
    fetch('/values')
        .then(response => response.json())
        .then(data => {
            const studentData = data.data;
            createScatterPlot(studentData);
        })
        .catch(error => {
            console.error('Error fetching student data:', error);
        });
}

fetchDataAndCreateScatterPlot();
