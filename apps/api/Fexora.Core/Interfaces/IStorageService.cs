namespace Fexora.Core.Interfaces;

public interface IStorageService
{
    Task<string> UploadAsync(string bucket, string key, Stream stream, string contentType);
    Task DeleteAsync(string bucket, string key);
    string GetPublicUrl(string bucket, string key);
}
