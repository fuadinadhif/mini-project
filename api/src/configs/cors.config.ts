import { CorsOptions } from "cors";

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",");

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    console.log(allowedOrigins);
    if (!origin || allowedOrigins?.includes(origin))
      return callback(null, true);

    callback(new Error("Not allowed by CORS"));
  },
};
