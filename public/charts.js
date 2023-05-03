loadNav();

fetch('/values')
    .then(response => response.text())
    .then(text => {
        console.log('Response text:', text);
        return JSON.parse(text);
    })
    .then(data => {
        // Parse the data and create the chart
        const promptMap = {
            '0_number': '0',
            '1_number': '1',
            '2_number': '2',
            '3_number': '3',
            '4_number': '4',
            '5_number': '5',
            '6_number': '6',
            '7_number': '7',
            '8_number': '8',
            '9_number': '9',
            'a_lower': 'a',
            'A_upper': 'A',
            'b_lower': 'b',
            'B_upper': 'B',
            'C_upper': 'C',
            'd_lower': 'd',
            'D_upper': 'D',
            'e_lower': 'e',
            'E_upper': 'E',
            'f_lower': 'f',
            'F_upper': 'F',
            'g_lower': 'g',
            'G_upper': 'G',
            'h_lower': 'h',
            'H_upper': 'H',
            'i_lower': 'i',
            'I_upper': 'I',
            'j_lower': 'j',
            'J_upper': 'J',
            'K_upper': 'K',
            'L_upper': 'L',
            'm_lower': 'm',
            'M_upper': 'M',
            'n_lower': 'n',
            'N_upper': 'N',
            'P_upper': 'P',
            'Q_upper': 'Q',
            'r_lower': 'r',
            'R_upper': 'R',
            'S_upper': 'S',
            't_lower': 't',
            'T_upper': 'T',
            'U_upper': 'U',
            'V_upper': 'V',
            'W_upper': 'W',
            'X_upper': 'X',
            'Y_upper': 'Y',
            'Z_upper': 'Z'
        };

        const chartData = {};
        data.data.forEach(student => {
            const studentDetails = getStudentDetailsById(student.id);
            if (!chartData[studentDetails.name]) {
                chartData[studentDetails.name] = {
                    label: studentDetails.name,
                    data: [],
                    borderColor: `hsl(${studentDetails.id * 36}, 70%, 50%)`,
                    pointBackgroundColor: `hsl(${studentDetails.id * 36}, 70%, 50%)`,
                    pointRadius: 5,
                    pointHoverRadius: 8,
                };
            }

            chartData[studentDetails.name].data.push({
                x: promptMap[student.prompt],
                y: student.confidence,
            });
        });

        const datasets = Object.values(chartData);
        new Chart('scatter-chart', {
            type: 'scatter',
            data: {
                datasets: datasets,
            },
            options: {
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Prompt',
                        },
                        type: 'category',
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Confidence Level',
                        },
                    },
                },
            },
        });
    })
    .catch(error => {
        console.error('Error fetching student data:', error);
    });

function getStudentDetailsById(id) {
    const studentDetails = [
        { id: 0, name: 'Arlene', grade: 'Kindergarten', teacher: 'Duarte' },
        { id: 1, name: 'Bret', grade: 'Kindergarten', teacher: 'Duarte' },
        { id: 2, name: 'Cindy', grade: 'Kindergarten', teacher: 'Duarte' },
        { id: 3, name: 'Don', grade: 'Kindergarten', teacher: 'Duarte' },
        { id: 4, name: 'Emily', grade: 'Kindergarten', teacher: 'Duarte' },
        { id: 5, name: 'Franklin', grade: 'Kindergarten', teacher: 'Duarte' },
        { id: 6, name: 'Gert', grade: 'Kindergarten', teacher: 'Duarte' },
        { id: 7, name: 'Harold', grade: 'Kindergarten', teacher: 'Duarte' },
        { id: 8, name: 'Idalia', grade: 'Kindergarten', teacher: 'Duarte' },
        { id: 9, name: 'Jose', grade: 'Kindergarten', teacher: 'Duarte' },
    ];

    return studentDetails.find(student => student.id === id);
}
