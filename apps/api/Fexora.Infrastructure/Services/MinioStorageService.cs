using Fexora.Core.Interfaces;
using Microsoft.Extensions.Configuration;
using Minio;
using Minio.DataModel.Args;

namespace Fexora.Infrastructure.Services;

public class MinioStorageService : IStorageService
{
    private readonly IMinioClient _client;
    private readonly string _endpoint;

    public MinioStorageService(IConfiguration config)
    {
        _endpoint = config["Minio:Endpoint"] ?? "localhost:9000";
        var accessKey = config["Minio:AccessKey"] ?? "fexora";
        var secretKey = config["Minio:SecretKey"] ?? "fexora_dev_123";
        var useSSL = config.GetValue<bool>("Minio:UseSSL");

        var builder = new MinioClient()
            .WithEndpoint(_endpoint)
            .WithCredentials(accessKey, secretKey);

        if (useSSL) builder = builder.WithSSL();

        _client = builder.Build();
    }

    public async Task<string> UploadAsync(string bucket, string key, Stream stream, string contentType)
    {
        await EnsureBucketAsync(bucket);

        await _client.PutObjectAsync(new PutObjectArgs()
            .WithBucket(bucket)
            .WithObject(key)
            .WithStreamData(stream)
            .WithObjectSize(stream.Length)
            .WithContentType(contentType));

        return GetPublicUrl(bucket, key);
    }

    public async Task DeleteAsync(string bucket, string key)
    {
        await _client.RemoveObjectAsync(new RemoveObjectArgs()
            .WithBucket(bucket)
            .WithObject(key));
    }

    public string GetPublicUrl(string bucket, string key)
    {
        var protocol = _endpoint.Contains("localhost") ? "http" : "https";
        return $"{protocol}://{_endpoint}/{bucket}/{key}";
    }

    private async Task EnsureBucketAsync(string bucket)
    {
        var exists = await _client.BucketExistsAsync(new BucketExistsArgs().WithBucket(bucket));
        if (!exists)
        {
            await _client.MakeBucketAsync(new MakeBucketArgs().WithBucket(bucket));
        }
    }
}
