// NEST
import { NestFactory } from '@nestjs/core';

// EXPRESS
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';

// APP
import { AppModule } from './app.module';

// FIREBASE
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// PIPES
import { ValidationPipe } from '@nestjs/common';
import { join, resolve } from 'path';

const expressServer = express();
const staticFolder = resolve('.', 'docs');

// CREAR APP DE NEST
export const getApp = async () => {
  // SERVER
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressServer),
  );
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  app.setGlobalPrefix('/v1');

  return app;
};

// INICIAR ADMIN DE FIREBASE
const initFirebase = async () => {
  // FIREBASE INIT
  const config: admin.ServiceAccount = {
    projectId: 'proyecta-app',
    privateKey:
      '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCethMITy/DPVe7\nACuNcIDXcocM2kIs9zS/DrofZUoDiEnSzq9ezoEEFB1Xn9/vlfHWwNV6lvZkJo2y\nGElARuhZ7P2iEFGe1SRxhA2dZniLYXNS0pfFmSslB4aBq1b4A7AzzAGknpsmyeUi\neKndBVUxli8mdUHIIfSwqEtqQ+aSvXuMlGtPQslUER6+4MZoXP/xfvSO/DnOEYMN\n/GhmTDKhahVEmVJmwqtaYFI6UJmkJQcYJf8+mryfcTrrgPLK/MxXTAigpGfZE1Fn\nTdWazzC7vus9FfJP0BZ5yyn6bBmQ5u6cgdZnm/+ZMKYtAaEa22TiWFkRzDCFmuCw\nNVEurs0VAgMBAAECggEAFTZaHFvzEwn1mg+Hgqe0/La4sKHSQu7GbLvD6hLQXeD/\nFu8bdtUsXrZuhonedQfqMw0Ca1hWdaPGf/Vpgu8HOo+nhZvfQNaVgJuI807hESX0\n8y6k7NrQLqqPEnErVkot6HpdhNpS+8/zsVQFxf3iuVYslpwI7v4E1YCk1b7eCCIX\nuAYE/Rdg+59RWm1QMPFNjtk+XQRyfipgHKcxSTW3Lf3lQKQHxmKg1XFCPyiP/Q4r\n7y/W5NSXHunxtGOJQIeCjA41Ew0FCN9nXRXq7ThRJzVrnmQD8S9wPyz2hmywH63m\nmNAQ+wl2K9Gb2+YFAAm3eWN3V994+gCBgeU6mLIZmQKBgQDUEDvrtnSdFDk0lE3b\nmWLsgp+ZuiW7OibS6jtt6OFej6j4wKESSDg0m9BOwmSlmlqSVzamPlXA2DVZSYHZ\noaEth9/XZXHKJZy+Vz071j5yBA1a4mAxscV054uQEvQf8hL/KQ1koXM8Mtu+liOO\nexE2oBWFLN1yv6Nh9Uy9TO3HDQKBgQC/mA9Qx8/19it85ZZ42Q9hv2lEa/6G3DJ1\nqDheldmzjnBJT5wle2cdmE9cDF4MWd23amF3a60nktvL7+vVhdYxaD0+bTkWTmht\n6qAHMbYE++fQFnK6FjOQgdMQS7GfWCw2ZDdFyvf4pikxDJ3Da1vdqhTrzliYijE7\nMO6KQQacKQKBgF/8eSLYEzCGVt5VwmgDpaMn/NW4TBvS1n/hRcUaA+ipXfI6Pq3n\nwokNfdwoYSYUF6rljvbwgCApvPwNKZk4b5wMRGVapYa6P5hoJG9RKjKxYtogXSoh\nLR8dLy6nZZiQGckk68sAyQgWfSBnFPEJA2GWVCdTh2jJFUrhnTqR946BAoGBAIpr\nXYVLFp/ovfp6FIAysb44/+CC9VyRcZM3eaI8ORBUdCNC9NjPkuv6wjsKZFggBOMi\nZFBW5r6Uh1+LcqLNEraXTMfxOTE4bJIc1IjeDVcEd7IKxdBTgeWBJe+8ABPTK/4P\n4S73OLfXtCLPrpsk0TYQTxUd+zwZev/8lhokaJYhAoGAb7yWPRZRsLW6GUY8PVky\nLTDpG0DnssEYPk5KVVmatEhqbhK0FE4K821+HngX25oqcPb0e0C83ctlq37XFBjn\nHUZO6+ljhNUqJlgZwgbYfDsdqh7+4a4+uIFwBlBqESn1L1SL4hDsP/SUyfs3XGiz\nkp853hgC6AcI5TnWAijnSk8=\n-----END PRIVATE KEY-----\n',
    clientEmail: 'firebase-adminsdk-7ziqp@proyecta-app.iam.gserviceaccount.com',
  };
  admin.apps.length === 0
    ? admin.initializeApp({
        credential: admin.credential.cert(config),
        databaseURL: '',
      })
    : admin.app();
};

// INIICAR API NEST
async function bootstrap() {
  // FIREBASE
  await initFirebase();

  // INICAR
  const app = await getApp();
  await app.init();
}

// API
export const api = functions.https.onRequest(async (request, response) => {
  await bootstrap();
  expressServer(request, response);
});

// ENDPOINT DE DOCS
export const docs = functions.https.onRequest(async (req, res) => {
  // RUTA ABSOLUTA
  expressServer.get('/v1', (_req, res) => {
    res.sendFile(join(staticFolder, 'index.html'));
  });

  // API
  expressServer.use('/v1', express.static(staticFolder));
  expressServer(req, res);
});
