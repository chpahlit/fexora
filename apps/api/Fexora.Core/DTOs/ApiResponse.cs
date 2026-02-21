namespace Fexora.Core.DTOs;

public class ApiResponse<T>
{
    public T? Data { get; set; }
    public bool Success { get; set; }
    public string? Error { get; set; }

    public static ApiResponse<T> Ok(T data) => new() { Data = data, Success = true };
    public static ApiResponse<T> Fail(string error) => new() { Success = false, Error = error };
}
