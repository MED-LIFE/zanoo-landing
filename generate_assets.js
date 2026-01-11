const fs = require('fs');
const path = require('path');

const dirs = [
    'public/brand',
    'public/shots',
    'public/photos'
];

dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

const files = [
    'public/brand/zanoo-logo.png',
    'public/shots/inicio-paciente.png',
    'public/shots/mis-medicos.png',
    'public/shots/turnos-recepcion.png',
    'public/shots/metricas-direccion.png',
    'public/photos/papeles-whatsapp-cuaderno.jpg',
    'public/photos/fila-turnos-duplicados.jpg',
    'public/photos/historia-clinica-incompleta.jpg'
];

// Minimal 1x1 PNG Base64
const pngBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==', 'base64');
// Minimal 1x1 JPG Base64 (approx)
const jpgBuffer = Buffer.from('/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=', 'base64');

files.forEach(file => {
    const ext = path.extname(file);
    const content = ext === '.jpg' || ext === '.jpeg' ? jpgBuffer : pngBuffer;
    fs.writeFileSync(file, content);
    console.log(`Created ${file}`);
});
