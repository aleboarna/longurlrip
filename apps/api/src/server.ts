import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import Ajv, { JTDSchemaType } from 'ajv/dist/jtd';
import { RequestCreate } from './interfaces';
import { PlatformException } from './exceptions/PlatformException';
import { ErrorTypes } from './exceptions';
import { UrlService } from './services/url_service';

const ajv = new Ajv();

const app: Application = express();
const service: UrlService = new UrlService();

app.use(helmet());
app.use(cors());
app.use(express.json());

const schema: JTDSchemaType<RequestCreate> = {
  properties: {
    url: { type: 'string' },
  },
  optionalProperties: {
    length: { type: 'int32' },
    customSlug: { type: 'string' },
  },
};
const validate = ajv.compile(schema);

// Middleware to log incoming requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

//=====HTTP VERBS
//=====ORDER COUNTS FOR VERBS
app.post('/v1/slugs/create', async (req: Request, res: Response) => {
  if (validate(req.body)) {
    const { url, length, customSlug } = req.body;
    try {
      const slug = await service.addEntry(url, length, customSlug);
      res.json({ slug });
    } catch (e) {
      const error = <PlatformException>e;
      res
        .status(error.status)
        .json({ message: error.message, code: error.name });
    }
  } else {
    const error = new PlatformException(
      ErrorTypes.APIErrorCodes.INVALID_REQUEST_BODY
    );
    res.status(error.status).json({
      message: validate.errors ? validate.errors[0].message : error.message,
      code: error.name,
    });
  }
});

app.get(
  '/v1/slug/:slug',
  async (req: Request, res: Response, next: NextFunction) => {
    const { slug } = req.params;
    const url = await service.getEntry(slug);
    if (url !== undefined) {
      res.json({ url });
    } else {
      const error = new PlatformException(
        ErrorTypes.APIErrorCodes.INVALID_REQUEST_PATH
      );
      res
        .status(error.status)
        .json({ message: error.message, code: error.name });
    }
  }
);

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new PlatformException(ErrorTypes.APIErrorCodes.INVALID_REQUEST_PATH));
});
//=====HTTP VERBS

//=====MIDDLEWARE
//=====ORDER COUNTS FOR MIDDLEWARES
app.use(
  (err: PlatformException, req: Request, res: Response, next: NextFunction) => {
    if (err) {
      res.status(err.status).json({ message: err.message, code: err.name });
    } else {
      next();
    }
  }
);
//=====MIDDLEWARE

export { app };
