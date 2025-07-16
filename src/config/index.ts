export default {
    aws_remote_config: {
        accessKeyId: process.env.awsak,
        secretAccessKey: process.env.awssk,
        region: process.env.awsr,
    },
    cognito_userpool: process.env.cognito_userpool,
    cognito_client: process.env.cognito_client,
    google_client_id: process.env.google_client_id,
    s3_bucket: process.env.s3_bucket,
    cloudfront_domain: process.env.cloudfront_domain,
    allowed_image_mimetype: process.env.allowed_image_mimetype.split("|"),
    app_ui_url: process.env.app_ui_url,

    postgres_host: process.env.postgres_host,
    postgres_username: process.env.postgres_username,
    postgres_password: process.env.postgres_password,
    postgres_database: process.env.postgres_database,

    port: 8000,
};
