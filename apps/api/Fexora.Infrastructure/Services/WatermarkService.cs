using Fexora.Core.Interfaces;
using SkiaSharp;

namespace Fexora.Infrastructure.Services;

public class WatermarkService : IWatermarkService
{
    public Task<Stream> ApplyWatermark(Stream imageStream, string watermarkText)
    {
        using var original = SKBitmap.Decode(imageStream);
        using var surface = SKSurface.Create(new SKImageInfo(original.Width, original.Height));
        var canvas = surface.Canvas;

        canvas.DrawBitmap(original, 0, 0);

        // Semi-transparent watermark
        var fontSize = Math.Max(original.Width / 20f, 24f);
        using var font = new SKFont(SKTypeface.Default, fontSize);
        using var paint = new SKPaint
        {
            Color = new SKColor(255, 255, 255, 80),
            IsAntialias = true,
        };

        // Draw watermark diagonally across the image
        canvas.Save();
        canvas.RotateDegrees(-30, original.Width / 2f, original.Height / 2f);

        var textWidth = font.MeasureText(watermarkText);
        var x = (original.Width - textWidth) / 2f;
        var y = original.Height / 2f;

        // Draw multiple times for tiled effect
        for (var row = -1; row <= 2; row++)
        {
            for (var col = -1; col <= 2; col++)
            {
                canvas.DrawText(
                    watermarkText,
                    x + col * (textWidth + 100),
                    y + row * (fontSize + 80),
                    SKTextAlign.Left,
                    font,
                    paint
                );
            }
        }

        canvas.Restore();

        using var image = surface.Snapshot();
        var data = image.Encode(SKEncodedImageFormat.Png, 90);

        var result = new MemoryStream();
        data.SaveTo(result);
        result.Position = 0;

        return Task.FromResult<Stream>(result);
    }
}
