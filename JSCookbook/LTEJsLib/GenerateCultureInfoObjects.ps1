$cultures = @("en-US", "en-GB", "de-DE", "sv-SE", "tr-TR", "mi-NZ", "nb-NO", "fil-PH", "pl-PL", "ru-RU", "is-IS", "he-IL", "ja-JP", "fr-FR", "es-ES", "es-MX", "de-AT", "pt-PT", "en-AU", "fr-BE", "pt-BR", "fr-CA", "cs-CZ", "da-DK", "fi-FI", "el-GR", "hi-IN", "ga-IE", "it-IT", "nl-NL");
cls
foreach ($c in $cultures) {
    $ci = New-Object -TypeName:'System.Globalization.CultureInfo' -ArgumentList:@($c);
    
    "new CultureInfo(NumberFormatInfo(""$($ci.NumberFormat.NumberDecimalSeparator)"", ""$($ci.NumberFormat.NumberGroupSeparator)"", """", false), NumberFormatInfo(""$($ci.NumberFormat.CurrencyDecimalSeparator)"", ""$($ci.NumberFormat.CurrencyGroupSeparator)"", ""$($ci.NumberFormat.CurrencySymbol)"", false), NumberFormatInfo(""$($ci.NumberFormat.PercentDecimalSeparator)"", ""$($ci.NumberFormat.PercentGroupSeparator)"", ""$($ci.NumberFormat.PercentSymbol)"", false), ""$c"", ""$($ci.EnglishName)"")," | Write-Output;
}
