export default () => ({
    port: parseInt(process.env.PORT || '4000', 10),
    
    app: {
      name: 'EveraPharma API',
      url: process.env.API_URL || 'http://localhost:4000',
      frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
    },
    
    database: {
      url: process.env.DATABASE_URL,
    },
    
    redis: {
      url: process.env.REDIS_URL,
    },
    
    auth: {
      supabase: {
        url: process.env.SUPABASE_URL,
        anonKey: process.env.SUPABASE_ANON_KEY,
        serviceKey: process.env.SUPABASE_SERVICE_KEY,
      },
      jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: '24h',
      },
      bcrypt: {
        rounds: 10,
      },
    },
    
    storage: {
      spaces: {
        key: process.env.DO_SPACES_KEY,
        secret: process.env.DO_SPACES_SECRET,
        endpoint: process.env.DO_SPACES_ENDPOINT,
        bucket: process.env.DO_SPACES_BUCKET,
        region: process.env.DO_SPACES_REGION || 'nyc3',
        cdnEndpoint: process.env.DO_SPACES_CDN_ENDPOINT,
      },
    },
    
    email: {
      sendgrid: {
        apiKey: process.env.SENDGRID_API_KEY,
        fromEmail: process.env.SENDGRID_FROM_EMAIL || 'noreply@everapharm.com',
        replyTo: process.env.SENDGRID_REPLY_TO || 'support@everapharm.com',
      },
    },
    
    payment: {
      stripe: {
        secretKey: process.env.STRIPE_SECRET_KEY,
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
        currency: 'usd',
      },
    },
    
    search: {
      typesense: {
        host: process.env.TYPESENSE_HOST,
        port: parseInt(process.env.TYPESENSE_PORT || '443', 10),
        protocol: process.env.TYPESENSE_PROTOCOL || 'https',
        apiKey: process.env.TYPESENSE_API_KEY,
      },
    },
    
    throttle: {
      ttl: parseInt(process.env.RATE_LIMIT_WINDOW || '900000', 10), // 15 minutes
      limit: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
    },
    
    cache: {
      ttl: {
        default: 3600, // 1 hour
        products: 3600,
        categories: 86400, // 24 hours
        pricing: 900, // 15 minutes
      },
    },
    
    security: {
      cors: {
        origins: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
      },
      ipWhitelist: {
        enabled: process.env.ENABLE_IP_WHITELIST === 'true',
        ips: process.env.WHITELISTED_IPS?.split(',') || [],
      },
    },
    
    features: {
      twoFactorAuth: process.env.ENABLE_2FA === 'true',
      auditLog: process.env.ENABLE_AUDIT_LOG === 'true',
      maintenanceMode: process.env.MAINTENANCE_MODE === 'true',
    },
    
    pagination: {
      defaultLimit: 20,
      maxLimit: 100,
    },
    
    files: {
      maxSize: 10 * 1024 * 1024, // 10MB
      allowedTypes: [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/gif',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ],
    },
  })