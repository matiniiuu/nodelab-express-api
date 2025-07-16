import { AWSError, S3 } from "aws-sdk";
import { AwsError } from "../../packages/errors/aws-error";
import config from "../../config";

const s3Client = new S3({ region: config.aws_remote_config.region });

export const uploadObject = (key: string, body: S3.Body): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
        s3Client.upload(
            {
                Bucket: config.s3_bucket,
                Key: key,
                Body: body,
                ACL: "public-read",
            },
            {},
            (err: AWSError, result) => {
                if (err)
                    return reject(new AwsError(err.statusCode, err.message));
                resolve(`${config.cloudfront_domain}/${key}`);
            },
        );
    });
};
export const deleteObject = (url: string) => {
    const key = url.replace(`${config.cloudfront_domain}/`, "");
    return new Promise<void>((resolve, reject) => {
        s3Client.deleteObject(
            {
                Bucket: config.s3_bucket,
                Key: key,
            },
            (err: AWSError, result) => {
                if (err)
                    return reject(new AwsError(err.statusCode, err.message));
                resolve();
            },
        );
    });
};
