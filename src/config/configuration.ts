export default () => ({
  host: process.env.HOST,
  env: process.env.ENV_NAME,
  isDev: process.env.ENV_NAME === 'development',
  isProd: process.env.ENV_NAME === 'production',
  postgres: {
    url: process.env.POSTGRES_URL,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT, 10),
  },
  secrets: {
    jwtSecret: process.env.JWT_SECRET,

    googleAppId: process.env.GOOGLE_APP_ID,
    googleAppSecret: process.env.GOOGLE_APP_SECRET,

    emailAccessKeyId: process.env.EMAIL_ACCESS_KEY_ID,
    emailSecretAccessKey: process.env.EMAIL_SECRET_ACCESS_KEY,
  },
  email: {
    emailDebug: process.env.EMAIL_DEBUG === 'true',
    fromEmail: process.env.FROM_EMAIL,
    replyToDomain: process.env.REPLY_TO_DOMAIN,
  },
});