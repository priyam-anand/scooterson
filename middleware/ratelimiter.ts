import rateLimit from "express-rate-limit";

const max = 5;

const rateLimiter = rateLimit({
  windowMs: 1000, // 1 second
  max,
  message: `You have exceeded ${max} requests per minute`,
  headers: true,
});

export default rateLimiter;
