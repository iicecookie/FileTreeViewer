using System.Text.RegularExpressions;

namespace Backend.Utilites;

public class ValidDateSubstituter : IValidDateSubstituter
{
    public string ReplaceDateInitializersWithCorrectValues(string stringToCorrect)
    {
        var dateRegex = new Regex(@"new Date\([12]\d{3}, [0-9]{1,2}, ([0-9]{1,2})\)");
        var matches = dateRegex.Matches(stringToCorrect);

        foreach (Match match in matches)
        {
            var dateString = match.Value.Replace("new Date(", string.Empty).Replace(")", string.Empty);
            var date = DateTime.Parse(dateString);
            stringToCorrect = stringToCorrect.Replace(match.Value,$"\"{date.ToString("d")}\"");
        }

        return stringToCorrect;
    }
}