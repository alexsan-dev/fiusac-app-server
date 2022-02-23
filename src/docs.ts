// SWAGGER
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { RedocModule, RedocOptions } from 'nestjs-redoc';
import type { INestApplication } from '@nestjs/common';

// FETCH
import axios from 'axios';
import * as fs from 'fs';

// APP
import { getApp } from 'src';

const bootstrap = async (app: INestApplication) => {
  // SWAGGER
  const options = new DocumentBuilder()
    .setTitle('Proyecta® - APP | Data API')
    .setDescription('Descripción de API Endpoints para scraping y auth')
    .build();
  const document = SwaggerModule.createDocument(app, options);

  // REDOC
  const redocOptions: RedocOptions = {
    title: 'Proyecta® - APP | Data API',
    sortPropsAlphabetically: true,
    hideHostname: false,
  };

  // INICIAR
  await RedocModule.setup('docs', app, document, redocOptions);
  await app.listen(3000);
};

// CREAR JSON
const start = async () => {
  // SERVER
  const app = await getApp();

  // INICIAR SWAGGER
  await bootstrap(app);

  // OBTENER JSON
  const request = await axios.get('http://localhost:3000/docs/swagger.json');
  fs.writeFile('docs/swagger.json', JSON.stringify(request.data), (err) => {
    if (err) console.log(err);

    // CERRAR SERVIDOR
    app.close();
  });
};

// INICIAR
start();
