/*var express = require('express');
var router = express.Router();
var Image = require('../models/img');*/

/* GET image listing. 
router.get('/', async function(req, res, next) {
  try{
    const result = await Image.find();
    res.send(result.map((c) => c.cleanup()));
  } catch (e) {
    res.sendStatus(500);
  }
  
});*/

/*POST image  CREO QUE NO VA A TENER NINGÚN POST
router.post('/', function(req, res, next) {
  
  var newImage = req.body;
  image.push(newImage);
  res.sendStatus(201);
})

/*GET image/id 
router.get('/:id', async function(req, res, next) {
  const id = req.params.id;

  try {
    const foundImg = await Image.findOne({ id });

    if (foundImg) {
      res.status(200).send(foundImg.map((c) => c.cleanup()));
    } else {
      res.status(404).send("Imagen no encontrado");
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});


module.exports = router;*/
 
var express = require('express');
var router = express.Router();
var Image = require('../models/img');
var multer = require('multer');
var { exec } = require('child_process');
var path = require('path');

// Configurar multer para manejar la carga de imágenes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Asegúrate de que esta carpeta exista
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limitar tamaño a 5 MB
  fileFilter: (req, file, cb) => {
    // Aceptar solo ciertos tipos de archivos, si es necesario
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Tipo de archivo no permitido'));
  }
});

// Ruta para subir la imagen y procesarla
router.post('/', upload.single('image'), async function(req, res, next) {
    const imagePath = path.join(__dirname, '../uploads', req.file.filename);
    const weightsPath = path.join(__dirname, '../yolov5/best.pt');  // Ruta absoluta a best.pt
    console.log(req.file); // Para ver si se recibe correctamente
    if (!req.file) {
      return res.status(400).send({ message: 'No se ha subido ningún archivo' });
    }
    // Ejecutar el script de Python

      exec(`python3 ${path.join(__dirname, '../yolov5/process_image.py')} --weights ${weightsPath} --img 1024 --source ${imagePath}`,
      {
        maxBuffer: 1024 * 1024 * 10 // Aumenta el tamaño del buffer a 10 MB
    } 
      , async (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing script: ${error}`);
            return res.status(500).send('Error processing image.');
        }

        // Capturar la salida en base64
        const imgBase64 = stdout.trim(); // La salida del script en base64
        console.log(imgBase64);
        // Crear un nuevo registro en la base de datos
        const newImage = new Image({
            id: Date.now(), // O cualquier lógica para el ID que estés utilizando
            base64: imgBase64,
            cells: [] // Puedes llenar esto según sea necesario
        });

        try {
            await newImage.save(); // Guardar en MongoDB
            res.status(201).json(newImage.cleanup()); // Enviar respuesta con el objeto creado
        } catch (err) {
            console.error(err);
            res.status(500).send('Error saving image to database.');
        }
    });
});

module.exports = router;
