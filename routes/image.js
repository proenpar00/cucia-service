var express = require('express');
var router = express.Router();
var Image = require('../models/img');

/* GET image listing. */
router.get('/', async function(req, res, next) {
  try{
    const result = await Image.find();
    res.send(result.map((c) => c.cleanup()));
  } catch (e) {
    res.sendStatus(500);
  }
  
});

/*POST image  CREO QUE NO VA A TENER NINGÚN POST
router.post('/', function(req, res, next) {
  
  var newImage = req.body;
  image.push(newImage);
  res.sendStatus(201);
})*/

/*GET image/id */
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


module.exports = router;
 
