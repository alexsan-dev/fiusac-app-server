// SWAGGER
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { RedocModule, RedocOptions } from 'nestjs-redoc';
import type { INestApplication } from '@nestjs/common';

// FETCH
import axios from 'axios';
import * as fs from 'fs';

// APP
import { getApp } from 'src/index';

/**
 * It creates a Swagger document, creates a RedocOptions object,
 * and then calls RedocModule.setup() to create the Redoc documentation
 * @param {INestApplication} app - INestApplication - the NestJS application instance
 */
const bootstrap = async (app: INestApplication) => {
  // SWAGGER
  const options = new DocumentBuilder()
    .setTitle('Moonbirds | Data API')
    .setDescription('Moonbirds api for retrieve assets on collection')
    .build();
  const document = SwaggerModule.createDocument(app, options);

  // REDOC
  const redocOptions: RedocOptions = {
    title: 'Moonbirds | Data API',
    sortPropsAlphabetically: true,
    hideHostname: false,
  };

  // START
  await RedocModule.setup('docs', app, document, redocOptions);
  await app.listen(3000);
};

/**
 * It starts the server, waits for the swagger documentation to be generated,
 * then writes the documentation to a file and closes the server
 */
const start = async () => {
  // SERVER
  const app = await getApp();

  // START SWAGGER
  await bootstrap(app);

  // GET JSON
  const request = await axios.get('http://localhost:3000/docs/swagger.json');
  fs.writeFile('docs/swagger.json', JSON.stringify(request.data), (err) => {
    if (err) console.log(err);

    // CLOSE SERVER
    app.close();
  });
};

// START
start();
