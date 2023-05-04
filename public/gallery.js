loadNav();

function matrixToDataURL(matrix) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const size = 32;

    canvas.width = size;
    canvas.height = size;
    const imageData = ctx.createImageData(size, size);

    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            const pixelIndex = (i * size + j) * 4;
            const value = matrix[i][j] * 255;

            imageData.data[pixelIndex] = 255 - value;
            imageData.data[pixelIndex + 1] = 255 - value;
            imageData.data[pixelIndex + 2] = 255 - value;
            imageData.data[pixelIndex + 3] = 255;
        }
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL();
}

function displayDrawings(studentData) {
    studentData.forEach(item => {
        const studentSection = document.getElementById(`student-${item.studentId}`);
        const imageURL = matrixToDataURL(item.matrix);

        const img = document.createElement('img');
        img.src = imageURL;
        img.width = 32;
        img.height = 32;
        img.alt = 'Drawing';
        img.title = `Prompt: ${item.prompt}`;

        studentSection.appendChild(img);
    });
}

fetch('/values')
    .then(response => response.text())
    .then(text => {
        console.log('Response text:', text);
        return JSON.parse(text);
    })
    .then(data => {
        const studentData = data.data;
        displayDrawings(studentData);
    })
    .catch(error => {
        console.error('Error fetching student data:', error);
    });
