using Backend.Models.Requests;
using Backend.Utilites;
using Microsoft.AspNetCore.Mvc;
using System.Text;
using System.Text.RegularExpressions;

namespace Backend.Controllers;

[ApiController]
[Route("[controller]/[action]")]
public class ContentDecodeController : ControllerBase
{
    private readonly ILogger<ContentDecodeController> _logger;
    private readonly IValidDateSubstituter _validDateSubstituter;

    public ContentDecodeController(ILogger<ContentDecodeController> logger,
                                   IValidDateSubstituter validDateSubstituter)
    {
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _validDateSubstituter = validDateSubstituter ?? throw new ArgumentNullException(nameof(validDateSubstituter));
    }

    [HttpPost]
    public string GetDecodedString([FromBody] GetDecodedStringRequest request)
    {
        if (request is null)
            throw new ArgumentNullException(nameof(request));

        string decodedString;

        try
        {
            var decodedBytes = Convert.FromBase64String(request.encodedString);

            decodedString = Encoding.UTF8.GetString(decodedBytes, 0, decodedBytes.Length);

            decodedString = _validDateSubstituter.ReplaceDateInitializersWithCorrectValues(decodedString);
        }
        catch (FormatException ex)
        {
            throw new Exception($"Строка содержит дату некорректного формата {ex.Message}");
        }
        catch (Exception ex)
        {
            throw new Exception($"Произошла ошибка при дешифровке строки {ex.Message}"); 
        } 

        return decodedString;
    }
}