namespace Fexora.Core.Interfaces;

public interface IWatermarkService
{
    Task<Stream> ApplyWatermark(Stream imageStream, string watermarkText);
}
