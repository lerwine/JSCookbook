$HtmlDocument = [System.Xml.XmlDocument]::new();
$HtmlDocument.LoadXml([System.IO.File]::ReadAllText(($PSScriptRoot | Join-Path -ChildPath 'WebColors.html')).Replace('&nbsp;', '&#160;'));

$Script:RgbPattern = [System.Text.RegularExpressions.Regex]::new('rgb\(\s*(?<r>\d+)\s*,\s*(?<g>\d+)\s*,\s*(?<b>\d+)\s*\)', ([System.Text.RegularExpressions.RegexOptions]::Compiled -bor [System.Text.RegularExpressions.RegexOptions]::IgnoreCase));
$Script:HexPattern = [System.Text.RegularExpressions.Regex]::new('\#?((?<r>[a-f\d]{2})\s*(?<g>[a-f\d]{2})\s*(?<b>[a-f\d]{2})|(?<r>[a-f\d])(?<g>[a-f\d])(?<b>[a-f\d]))', ([System.Text.RegularExpressions.RegexOptions]::Compiled -bor [System.Text.RegularExpressions.RegexOptions]::IgnoreCase));
$Script:NumberNamePattern = [System.Text.RegularExpressions.Regex]::new('(?<n>\d+)(\s*\(\s*(?<v>[^\s\(\)]+(\s+[^\s\(\)]+)*)\s*\))?(\s*;?\s*(?<c>\S+))?', ([System.Text.RegularExpressions.RegexOptions]::Compiled -bor [System.Text.RegularExpressions.RegexOptions]::IgnoreCase));
$Script:StyleBgColorNamePattern = [System.Text.RegularExpressions.Regex]::new('(^|;)\s*background:\s*(?<n>[^;\#\(\)\s]+)', ([System.Text.RegularExpressions.RegexOptions]::Compiled -bor [System.Text.RegularExpressions.RegexOptions]::IgnoreCase));
$Script:CamelCasePattern = [System.Text.RegularExpressions.Regex]::new('(^|\G)(?<l>\d+|[A-Z]+|[^\#])(?<r>[^A-Z\d]+)?', [System.Text.RegularExpressions.RegexOptions]::Compiled);

$XmlDocument = [System.Xml.XmlDocument]::new();
$DocumentElement = $XmlDocument.AppendChild($XmlDocument.CreateElement('colors'));

foreach ($PropertyInfo in @([System.Drawing.Color].GetProperties() | Where-Object { $_.CanRead -and $_.GetGetMethod().IsStatic })) {
    [System.Drawing.Color]$Color = $PropertyInfo.GetValue($null);
    if ($Color.A -eq 0) { continue }
    $n = $Color.Name;
    if ($n -eq $null -or $n.Length -eq 0) { $n = $PropertyInfo.Name }
    $XmlElement = $DocumentElement.SelectSingleNode("color[@r=$($Color.R) and @g=$($Color.G) and @b=$($Color.B)]");
    if ($XmlElement -eq $null) {
        $XmlElement = $DocumentElement.AppendChild($XmlDocument.CreateElement('color'));
        $XmlElement.Attributes.Append($XmlDocument.CreateAttribute('name')).Value = $n;
        $XmlElement.Attributes.Append($XmlDocument.CreateAttribute('r')).Value = $Color.R.ToString();
        $XmlElement.Attributes.Append($XmlDocument.CreateAttribute('g')).Value = $Color.G.ToString();
        $XmlElement.Attributes.Append($XmlDocument.CreateAttribute('b')).Value = $Color.B.ToString();
        $XmlElement.Attributes.Append($XmlDocument.CreateAttribute('brightness')).Value = [System.Xml.XmlConvert]::ToString($Color.GetBrightness());
        $XmlElement.Attributes.Append($XmlDocument.CreateAttribute('hue')).Value = [System.Xml.XmlConvert]::ToString($Color.GetHue());
        $XmlElement.Attributes.Append($XmlDocument.CreateAttribute('saturation')).Value = [System.Xml.XmlConvert]::ToString($Color.GetSaturation());
        $XmlElement.Attributes.Append($XmlDocument.CreateAttribute('isCss')).Value = 'false';
        $XmlElement.Attributes.Append($XmlDocument.CreateAttribute('isWebSafe')).Value = 'false';
        $XmlElement.Attributes.Append($XmlDocument.CreateAttribute('isWindows')).Value = 'true';
    } else {
        if ($n.Length -gt 0) { $XmlElement.Attributes.Append($XmlDocument.CreateAttribute('altName')).Value = $n }
    }
}

@(
    @{ colorGroup = 'pink';  XPath = '//*[@id="x11LeftCol"]/tbody/tr[count(preceding-sibling::tr[@id="redColorStart"])=0]' },
    @{ colorGroup = 'red';  XPath = '//*[@id="x11LeftCol"]/tbody/tr[not(count(preceding-sibling::tr[@id="redColorStart"])=0) and count(preceding-sibling::tr[@id="orangeColorStart"])=0]' },
    @{ colorGroup = 'orange';  XPath = '//*[@id="x11LeftCol"]/tbody/tr[not(count(preceding-sibling::tr[@id="orangeColorStart"])=0) and count(preceding-sibling::tr[@id="yellowColorStart"])=0]' },
    @{ colorGroup = 'yellow';  XPath = '//*[@id="x11LeftCol"]/tbody/tr[not(count(preceding-sibling::tr[@id="yellowColorStart"])=0) and count(preceding-sibling::tr[@id="brownColorStart"])=0]' },
    @{ colorGroup = 'brown';  XPath = '//*[@id="x11LeftCol"]/tbody/tr[not(count(preceding-sibling::tr[@id="brownColorStart"])=0)]' },
    @{ colorGroup = 'green';  XPath = '//*[@id="x11CenterCol"]/tbody/tr[count(preceding-sibling::tr[@id="cyanColorStart"])=0]' },
    @{ colorGroup = 'cyan';  XPath = '//*[@id="x11CenterCol"]/tbody/tr[not(count(preceding-sibling::tr[@id="cyanColorStart"])=0) and count(preceding-sibling::tr[@id="blueColorStart"])=0]' },
    @{ colorGroup = 'blue';  XPath = '//*[@id="x11CenterCol"]/tbody/tr[not(count(preceding-sibling::tr[@id="blueColorStart"])=0)]' },
    @{ colorGroup = 'purple';  XPath = '//*[@id="x11RightCol"]/tbody/tr[count(preceding-sibling::tr[@id="whiteColorStart"])=0]' },
    @{ colorGroup = 'white';  XPath = '//*[@id="x11RightCol"]/tbody/tr[not(count(preceding-sibling::tr[@id="whiteColorStart"])=0) and count(preceding-sibling::tr[@id="grayColorStart"])=0]' },
    @{ colorGroup = 'gray';  XPath = '//*[@id="x11RightCol"]/tbody/tr[not(count(preceding-sibling::tr[@id="grayColorStart"])=0)]' }
) | ForEach-Object {
    $TableRows = @($HtmlDocument.SelectNodes($_.XPath));
    "$($_.colorGroup): $($TableRows.Count) matches" | Write-Host;
    for ($RowIndex = 0; $RowIndex -lt $TableRows.Count; $RowIndex++) {
        $X11Code = '';
        $XmlElement = $TableRows[$RowIndex].SelectSingleNode('td[1]/code');
        if ($XmlElement -eq $null) { continue }
        if ($XmlElement.IsEmpty) {
            Write-Warning -Message "At $($_.colorGroup), row $RowIndex`: name is nil";
        } else {
            $X11Code = $XmlElement.InnerText.Trim();
            if ($X11Code.Length -eq 0) { Write-Warning -Message "At $($_.colorGroup), row $RowIndex`: name is empty" }
        }
        $a = $TableRows[$RowIndex].SelectSingleNode('@style');
        $CssName = '';
        if ($a -eq $null) {
            Write-Warning -Message "At $($_.colorGroup), row $RowIndex`: style attribute not found";
            if ($X11Code.Length -eq 0) { continue }
        } else {
            $M = $Script:StyleBgColorNamePattern.Match($a.Value);
            if (-not $M.Success) {
                Write-Warning -Message "At $($_.colorGroup), row $RowIndex`: background color style not found in `"$($a.Value)`"";
                if ($X11Code.Length -eq 0) { continue }
            } else {
                $CssName = $M.Groups['n'].Value.ToLower();
            }
        }
        $XmlElement = $TableRows[$RowIndex].SelectSingleNode('td[2]/code');
        if ($XmlElement -eq $null) { continue }
        if ($XmlElement.IsEmpty) {
            Write-Warning -Message "At $($_.colorGroup), row $RowIndex`: hex is nil";
            continue;
        }
        $Text = $XmlElement.InnerText.Trim();
        if ($Text.Length -eq 0) {
            Write-Warning -Message "At $($_.colorGroup), row $RowIndex`: hex is empty";
            continue;
        }
        $M = $Script:HexPattern.Match($Text);
        $R = 0; $G = 0; $B = 0;
        if (-not $M.Success) {
            Write-Warning -Message "Unable to parse Hex value `"$Text`" at $($_.colorGroup), row $RowIndex";
            continue;
        }
        $t = $M.Groups['r'].Value;
        if ($t.Length -eq 1) { $t = $t + $t }
        if (-not [System.Int32]::TryParse($t, [System.Globalization.NumberStyles]::HexNumber, $null, [ref]$R)) {
            Write-Warning -Message "Unable to parse R value for `"$Text`" at $($_.colorGroup), row $RowIndex";
            continue;
        }
        $t = $M.Groups['g'].Value;
        if ($t.Length -eq 1) { $t = $t + $t }
        if (-not [System.Int32]::TryParse($t, [System.Globalization.NumberStyles]::HexNumber, $null, [ref]$G)) {
            Write-Warning -Message "Unable to parse G value for `"$Text`" at $($_.colorGroup), row $RowIndex";
            continue;
        }
        $t = $M.Groups['b'].Value;
        if ($t.Length -eq 1) { $t = $t + $t }
        if (-not [System.Int32]::TryParse($t, [System.Globalization.NumberStyles]::HexNumber, $null, [ref]$B)) {
            Write-Warning -Message "Unable to parse B value for `"$Text`" at $($_.colorGroup), row $RowIndex";
            continue;
        }

        $XmlElement = $DocumentElement.SelectSingleNode("color[@r=$R and @g=$G and @b=$B]");
        if ($XmlElement -eq $null) {
            $XmlElement = $DocumentElement.AppendChild($XmlDocument.CreateElement('color'));
            if ($CssName.Length -gt 0) {
                $XmlElement.Attributes.Append($XmlDocument.CreateAttribute('name')).Value = $CssName;
            } else {
                $XmlElement.Attributes.Append($XmlDocument.CreateAttribute('name')).Value = "#$($R.ToString('x2'))$($G.ToString('x2'))$($B.ToString('x2'))";
            }
            $XmlElement.Attributes.Append($XmlDocument.CreateAttribute('colorGroup')).Value = $_.colorGroup;
            $XmlElement.Attributes.Append($XmlDocument.CreateAttribute('r')).Value = $R.ToString();
            $XmlElement.Attributes.Append($XmlDocument.CreateAttribute('g')).Value = $G.ToString();
            $XmlElement.Attributes.Append($XmlDocument.CreateAttribute('b')).Value = $B.ToString();
            $Color = [System.Drawing.Color]::FromArgb(255, $R, $G, $B);
            $XmlElement.Attributes.Append($XmlDocument.CreateAttribute('brightness')).Value = [System.Xml.XmlConvert]::ToString($Color.GetBrightness());
            $XmlElement.Attributes.Append($XmlDocument.CreateAttribute('hue')).Value = [System.Xml.XmlConvert]::ToString($Color.GetHue());
            $XmlElement.Attributes.Append($XmlDocument.CreateAttribute('saturation')).Value = [System.Xml.XmlConvert]::ToString($Color.GetSaturation());
            if ($CssName.Length -gt 0) {
                $XmlElement.Attributes.Append($XmlDocument.CreateAttribute('isCss')).Value = 'true';
            } else {
                $XmlElement.Attributes.Append($XmlDocument.CreateAttribute('isCss')).Value = 'false';
            }
            $XmlElement.Attributes.Append($XmlDocument.CreateAttribute('isWebSafe')).Value = 'false';
            $XmlElement.Attributes.Append($XmlDocument.CreateAttribute('isWindows')).Value = 'false';
        } else {
            if ($CssName.Length -gt 0) { $XmlElement.SelectSingleNode('@isCss').Value = 'true' }
            if ($XmlElement.SelectSingleNode('@colorGroup') -eq $null) {
                $XmlElement.Attributes.Append($XmlDocument.CreateAttribute('colorGroup')).Value = $_.colorGroup;
            }
        }
        if ($CssName.Length -gt 0) {
            $a = $XmlElement.SelectSingleNode('@cssName');
            if ($a -eq $null) {
                $XmlElement.Attributes.Append($XmlDocument.CreateAttribute('cssName')).Value = $CssName;
            } else {
                $s = $a;
                $a = $XmlElement.SelectSingleNode('@cssAlias');
                if ($a -eq $null) {
                    $XmlElement.Attributes.Append($XmlDocument.CreateAttribute('cssAlias')).Value = $s.Value;
                    $s.Value = $CssName;
                } else {
                    if ($s.Value -ine $CssName -and $a.Value -ine $CssName) { Write-Warning -Message "CSS name $CssName for $R, $G, $B in `"$Text`" at $($_.colorGroup), row $RowIndex does not match $($s.Value) or $($a.Value)" }
                }
            }
        }
        if ($X11Code.Length -gt 0) {
            $a = $XmlElement.SelectSingleNode('@x11Code');
            if ($a -eq $null) {
                $XmlElement.Attributes.Append($XmlDocument.CreateAttribute('x11Code')).Value = $X11Code;
            } else {
                $s = $a;
                $a = $XmlElement.SelectSingleNode('@x11Alias');
                if ($a -eq $null) {
                    $XmlElement.Attributes.Append($XmlDocument.CreateAttribute('x11Alias')).Value = $s.Value;
                    $s.Value = $X11Code;
                } else {
                    if ($s.Value -ine $X11Code -and $a.Value -ine $X11Code) { Write-Warning -Message "X11 alias $X11Code for $R, $G, $B in `"$Text`" at $($_.colorGroup), row $RowIndex does not match $($s.Value) or $($a.Value)" }
                }
            }
        }
    }
}

$XPath = '/html/body/table[@id="htmlColors"]/tbody/tr';
$XPath = '//*[@id="htmlColors"]/tbody/tr';
$TableRows = @($HtmlDocument.SelectNodes($XPath));
for ($RowIndex = 0; $RowIndex -lt $TableRows.Count; $RowIndex++) {
    $XmlElement = $TableRows[$RowIndex].SelectSingleNode('td[1]');
    if ($XmlElement -eq $null) {
        Write-Warning -Message "No element found at $XPath[$($RowIndex + 1)]/td[1]";
        continue;
    }
    if ($XmlElement.IsEmpty) {
        Write-Warning -Message "Element is nil at $XPath[$($RowIndex + 1)]/td[1]";
        continue;
    }
    $Text = $XmlElement.InnerText.Trim();
    if ($Text.Length -eq 0) {
        Write-Warning -Message "Element is empty at $XPath[$($RowIndex + 1)]/td[1]";
        continue;
    }
    $M = $Script:HexPattern.Match($Text);
    $R = 0; $G = 0; $B = 0;
    if (-not $M.Success) {
        $M = $Script:RgbPattern.Match($Text);
        if (-not $M.Success) {
            Write-Warning -Message "Unable to parse Hex or RGB value `"$Text`" at $XPath[$($RowIndex + 1)]/td[1]";
            continue;
        }
        if (-not [System.Int32]::TryParse($M.Groups['r'].Value, [ref]$R)) {
            Write-Warning -Message "Unable to parse R value for `"$Text`" at $XPath[$($RowIndex + 1)]/td[1]";
            continue;
        }
        if (-not [System.Int32]::TryParse($M.Groups['g'].Value, [ref]$G)) {
            Write-Warning -Message "Unable to parse G value for `"$Text`" at $XPath[$($RowIndex + 1)]/td[1]";
            continue;
        }
        if (-not [System.Int32]::TryParse($M.Groups['b'].Value, [ref]$B)) {
            Write-Warning -Message "Unable to parse B value for `"$Text`" at $XPath[$($RowIndex + 1)]/td[1]";
            continue;
        }
        if ($R -gt 255) {
            Write-Warning -Message "Invalid R value in `"$Text`" at $XPath[$($RowIndex + 1)]/td[1]";
            continue;
        }
        if ($G -gt 255) {
            Write-Warning -Message "Invalid G value in `"$Text`" at $XPath[$($RowIndex + 1)]/td[1]";
            continue;
        }
        if ($B -gt 255) {
            Write-Warning -Message "Invalid B value in `"$Text`" at $XPath[$($RowIndex + 1)]/td[1]";
            continue;
        }
    } else {
        $t = $M.Groups['r'].Value;
        if ($t.Length -eq 1) { $t = $t + $t }
        if (-not [System.Int32]::TryParse($t, [System.Globalization.NumberStyles]::HexNumber, $null, [ref]$R)) {
            Write-Warning -Message "Unable to parse R value for `"$Text`" at $XPath[$($RowIndex + 1)]/td[1]";
            continue;
        }
        $t = $M.Groups['g'].Value;
        if ($t.Length -eq 1) { $t = $t + $t }
        if (-not [System.Int32]::TryParse($t, [System.Globalization.NumberStyles]::HexNumber, $null, [ref]$G)) {
            Write-Warning -Message "Unable to parse G value for `"$Text`" at $XPath[$($RowIndex + 1)]/td[1]";
            continue;
        }
        $t = $M.Groups['b'].Value;
        if ($t.Length -eq 1) { $t = $t + $t }
        if (-not [System.Int32]::TryParse($t, [System.Globalization.NumberStyles]::HexNumber, $null, [ref]$B)) {
            Write-Warning -Message "Unable to parse B value for `"$Text`" at $XPath[$($RowIndex + 1)]/td[1]";
            continue;
        }
    }
    $XmlElement = $TableRows[$RowIndex].SelectSingleNode('td[10]');
    if ($XmlElement -eq $null) {
        Write-Warning -Message "No element found at $XPath[$($RowIndex + 1)]/td[10]";
        continue;
    }
    if ($XmlElement.IsEmpty) {
        Write-Warning -Message "Element is nil at $XPath[$($RowIndex + 1)]/td[10]";
        continue;
    }
    $Text = $XmlElement.InnerText.Trim();
    if ($Text.Length -eq 0) {
        Write-Warning -Message "Element is empty at $XPath[$($RowIndex + 1)]/td[10]";
        continue;
    }
    $M = $Script:NumberNamePattern.Match($Text);
    if (-not $M.Success) {
        Write-Warning -Message "Name/Number pattern not found at $XPath[$($RowIndex + 1)]/td[10]";
        continue;
    }
    $CssNumber = 0;
    if (-not [System.Int32]::TryParse($M.Groups['n'].Value, [ref]$CssNumber)) {
        Write-Warning -Message "Unable to parse CSS Number at $XPath[$($RowIndex + 1)]/td[10]";
        continue;
    }
    $VgaName = '';
    if ($M.Groups['v'].Success) { $VgaName = $M.Groups['v'].Value }
    $CssAlias = '';
    if ($M.Groups['c'].Success) { $CssAlias = $M.Groups['c'].Value.ToLower() }

    $XmlElement = $DocumentElement.SelectSingleNode("color[@r=$R and @g=$G and @b=$B]");
    if ($XmlElement -eq $null) {
        $XmlElement = $DocumentElement.AppendChild($XmlDocument.CreateElement('color'));
        if ($VgaName.Length -gt 0) {
            $XmlElement.Attributes.Append($XmlDocument.CreateAttribute('name')).Value = $VgaName;
        } else {
            $XmlElement.Attributes.Append($XmlDocument.CreateAttribute('name')).Value = $CssAlias;
        }
        $XmlElement.Attributes.Append($XmlDocument.CreateAttribute('r')).Value = $R.ToString();
        $XmlElement.Attributes.Append($XmlDocument.CreateAttribute('g')).Value = $G.ToString();
        $XmlElement.Attributes.Append($XmlDocument.CreateAttribute('b')).Value = $B.ToString();
        $Color = [System.Drawing.Color]::FromArgb(255, $R, $G, $B);
        $XmlElement.Attributes.Append($XmlDocument.CreateAttribute('brightness')).Value = [System.Xml.XmlConvert]::ToString($Color.GetBrightness());
        $XmlElement.Attributes.Append($XmlDocument.CreateAttribute('hue')).Value = [System.Xml.XmlConvert]::ToString($Color.GetHue());
        $XmlElement.Attributes.Append($XmlDocument.CreateAttribute('saturation')).Value = [System.Xml.XmlConvert]::ToString($Color.GetSaturation());
        if ($CssAlias.Length -gt 0) {
            $XmlElement.Attributes.Append($XmlDocument.CreateAttribute('isCss')).Value = 'true';
        } else {
            $XmlElement.Attributes.Append($XmlDocument.CreateAttribute('isCss')).Value = 'false';
        }
        $XmlElement.Attributes.Append($XmlDocument.CreateAttribute('isWebSafe')).Value = 'false';
        $XmlElement.Attributes.Append($XmlDocument.CreateAttribute('isWindows')).Value = 'false';
    } else {
        $a =$XmlElement.SelectSingleNode('@name');
        if ($a.Value.Substring(0, 1) -eq '#' -and $VgaName.Length -gt 0) { $a.Value = $VgaName }
        if ($CssAlias.Length -gt 0) {
            $XmlElement.SelectSingleNode('@isCss').Value = 'true';
            if ($a.Value.Substring(0, 1) -eq '#') { $a.Value = $CssAlias }
        }
    }
    if ($CssAlias.Length -gt 0) {
        $a = $XmlElement.SelectSingleNode('@cssName');
        if ($a -eq $null) {
            $XmlElement.Attributes.Append($XmlDocument.CreateAttribute('cssName')).Value = $CssAlias;
        } else {
            $s = $a;
            $a = $XmlElement.SelectSingleNode('@cssAlias');
            if ($a -eq $null) {
                $XmlElement.Attributes.Append($XmlDocument.CreateAttribute('cssAlias')).Value = $CssAlias;
            } else {
                if ($s.Value -ine $CssAlias -and $a.Value -ine $CssAlias) { Write-Warning -Message "CSS alias $CssAlias for $R, $G, $B in `"$Text`" at $($_.colorGroup), row $RowIndex does not match $($s.Value) or $($a.Value)" }
            }
        }
    }
    if ($VgaName.Length -gt 0) {
        $a = $XmlElement.SelectSingleNode('@vgaName');
        if ($a -eq $null) {
            $XmlElement.Attributes.Append($XmlDocument.CreateAttribute('vgaName')).Value = $VgaName;
        } else {
            if ($a.Value -ine $VgaName) { Write-Warning -Message "X11 name $VgaName for $R, $G, $B in `"$Text`" at $($_.colorGroup), row $RowIndex does not match $($a.Value)" }
        }
    }
}

$XPath = '//*[@id="webSafeColors"]/tbody/tr';
$TableRows = @($HtmlDocument.SelectNodes($XPath));
for ($RowIndex = 0; $RowIndex -lt $TableRows.Count; $RowIndex++) {
    $TableCells = @($TableRows[$RowIndex].SelectNodes('td'));
    for ($CellIndex = 0; $CellIndex -lt $TableCells.Count; $CellIndex++) {
        if ($TableCells[$CellIndex].IsEmpty) {
            Write-Warning -Message "Element is nil at $XPath[$($RowIndex + 1)]/td[$($CellIndex + 1)]";
            continue;
        }
        $Text = $TableCells[$CellIndex].InnerText.Trim();
        if ($Text.Length -eq 0) {
            Write-Warning -Message "Element is empty at $XPath[$($RowIndex + 1)]/td[$($CellIndex + 1)]";
            continue;
        }
        $M = $Script:HexPattern.Match($Text);
        $R = 0; $G = 0; $B = 0;
        if (-not $M.Success) {
            Write-Warning -Message "Unable to parse Hex value `"$Text`" at $XPath[$($RowIndex + 1)]/td[$($CellIndex + 1)]";
            continue;
        }
        $t = $M.Groups['r'].Value;
        if ($t.Length -eq 1) { $t = $t + $t }
        if (-not [System.Int32]::TryParse($t, [System.Globalization.NumberStyles]::HexNumber, $null, [ref]$R)) {
            Write-Warning -Message "Unable to parse R value for `"$Text`" at $XPath[$($RowIndex + 1)]/td[$($CellIndex + 1)]";
            continue;
        }
        $t = $M.Groups['g'].Value;
        if ($t.Length -eq 1) { $t = $t + $t }
        if (-not [System.Int32]::TryParse($t, [System.Globalization.NumberStyles]::HexNumber, $null, [ref]$G)) {
            Write-Warning -Message "Unable to parse G value for `"$Text`" at $XPath[$($RowIndex + 1)]/td[$($CellIndex + 1)]";
            continue;
        }
        $t = $M.Groups['b'].Value;
        if ($t.Length -eq 1) { $t = $t + $t }
        if (-not [System.Int32]::TryParse($t, [System.Globalization.NumberStyles]::HexNumber, $null, [ref]$B)) {
            Write-Warning -Message "Unable to parse B value for `"$Text`" at $XPath[$($RowIndex + 1)]/td[$($CellIndex + 1)]";
            continue;
        }

        $XmlElement = $DocumentElement.SelectSingleNode("color[@r=$R and @g=$G and @b=$B]");
        if ($XmlElement -eq $null) {
            $XmlElement = $DocumentElement.AppendChild($XmlDocument.CreateElement('color'));
            $XmlElement.Attributes.Append($XmlDocument.CreateAttribute('name')).Value = "#$($R.ToString('x2'))$($G.ToString('x2'))$($B.ToString('x2'))";
            $XmlElement.Attributes.Append($XmlDocument.CreateAttribute('r')).Value = $R.ToString();
            $XmlElement.Attributes.Append($XmlDocument.CreateAttribute('g')).Value = $G.ToString();
            $XmlElement.Attributes.Append($XmlDocument.CreateAttribute('b')).Value = $B.ToString();
            $Color = [System.Drawing.Color]::FromArgb(255, $R, $G, $B);
            $XmlElement.Attributes.Append($XmlDocument.CreateAttribute('brightness')).Value = [System.Xml.XmlConvert]::ToString($Color.GetBrightness());
            $XmlElement.Attributes.Append($XmlDocument.CreateAttribute('hue')).Value = [System.Xml.XmlConvert]::ToString($Color.GetHue());
            $XmlElement.Attributes.Append($XmlDocument.CreateAttribute('saturation')).Value = [System.Xml.XmlConvert]::ToString($Color.GetSaturation());
            $XmlElement.Attributes.Append($XmlDocument.CreateAttribute('isWebSafe')).Value = 'true';
            $XmlElement.Attributes.Append($XmlDocument.CreateAttribute('isCss')).Value = 'false';
            $XmlElement.Attributes.Append($XmlDocument.CreateAttribute('isWindows')).Value = 'false';
        } else {
            $XmlElement.SelectSingleNode('@isWebSafe').Value = 'true';
        }
    }
}

$intValues = @('r', 'g', 'b');
$boolValues = @('isCss', 'isWebSafe', 'isWindows');
$nValues = @('brightness', 'hue', 'saturation');
$allValues = $intValues + @('cssName', 'vgaName', 'x11Code', 'cssAlias', 'x11Alias') + $nValues + $boolValues + @('colorGroup');
$SortedNodes = (@($XmlDocument.SelectNodes('/colors/color')) | ForEach-Object {
    $colorElement = $_;
    $Properties = @{ Element = $_; name = $colorElement.SelectSingleNode('@name').Value; hue = 0.0; brightness = 0.0; saturation = 0.0 };
    $mc = $Script:CamelCasePattern.Matches($Name);
    if ($mc.Count -eq 0) {
        $a = $colorElement.SelectSingleNode('@vgaName');
        if ($a -eq $null) {
            $Properties['title'] = "RGB($($colorElement.SelectSingleNode('@r').Value), $($colorElement.SelectSingleNode('@g').Value), $($colorElement.SelectSingleNode('@b').Value))";
        } else {
            $Properties['title'] = ($a.Value.Split(' ') | ForEach-Object { $_.Substring(0, 1).ToUpper() + $_.Substring(1) }) -join ' ';
        }
    } else {
        $Properties['title'] = "$((@(@($mc) | ForEach-Object { if ($_.Groups['r'].Success) { $_.Groups['l'].Value.ToUpper() + $_.Groups['r'].Value } else { $_.Groups['l'].Value.ToUpper() } }) -join ' ').Replace('"', '\"'))";            
    }
    $allValues | ForEach-Object {
        $a = $colorElement.SelectSingleNode('@' + $_);
        if ($a -eq $null -or $a.Value.Length -eq 0) {
            if ($intValues -contains $_ -or $nValues -contains $_) {
                Write-Warning -Message "Encountered an empty $_ value";
                $Properties[$_] = $null;
            } else {
                if ($boolValues -contains $_) { $ValueText += $false } else { $ValueText += '' }
            }
        } else {
            if ($nValues -contains $_) {
                $Properties[$_] = [System.Single]::Parse($a.Value);
            } else {
                if ($intValues -contains $_) {
                    $Properties[$_] = [System.Int32]::Parse($a.Value);
                } else {
                    if ($boolValues -contains $_) {
                        $Properties[$_] = [System.Boolean]::Parse($a.Value);
                    } else {
                        $Properties[$_] = $a.Value;
                    }
                }
            }
        }
    }
    [float]$delta = $Properties['hue'] + (($Properties['brightness'] + $Properties['saturation']) / 2.0);
    $Properties['delta'] = $delta;
    New-Object -TypeName 'System.Management.Automation.PSObject' -Property $Properties;
} | Sort-Object -Property 'Delta');

$SortedDocument = [System.Xml.XmlDocument]::new();
$DocumentElement = $SortedDocument.AppendChild($SortedDocument.CreateElement('colors'));

$allValues = @('title') + $allValues + @('isSecondaryGroupMember');
$HtmlDocument.DocumentElement.SelectSingleNode('head/title').InnerText = 'Colors by Hue';
$HtmlDocument.DocumentElement.RemoveChild($HtmlDocument.DocumentElement.SelectSingleNode('body')) | Out-Null;
$BodyElement = $HtmlDocument.DocumentElement.AppendChild($HtmlDocument.CreateElement('body'));
$TableElement = $BodyElement.AppendChild($HtmlDocument.CreateElement('table'));
$TableRow = $TableElement.AppendChild($HtmlDocument.CreateElement('tr'));
$TableRow.AppendChild($HtmlDocument.CreateElement('th')).InnerText = 'Name';
$allValues | ForEach-Object {
    $TableRow.AppendChild($HtmlDocument.CreateElement('th')).InnerText = $_;
}
$TableRow.InsertBefore($HtmlDocument.CreateElement('th'), $TableRow.SelectSingleNode('th[6]')).InnerText = 'Hex';
$colorGroup = 'gray';
$boolValues += @('isSecondaryGroupMember');
$Lines = @($SortedNodes | ForEach-Object {
    $node = $_;
    $isSecondaryGroupMember = [String]::IsNullOrEmpty($node.colorGroup);
    if (-not $isSecondaryGroupMember) { $colorGroup = $node.colorGroup }
    $Element = $DocumentElement.AppendChild($SortedDocument.ImportNode($node.Element, $true));
    $a = $Element.SelectSingleNode('@colorGroup');
    if ($a -eq $null) {
        $Element.Attributes.Append($SortedDocument.CreateAttribute('colorGroup')).Value = $colorGroup;
    } else {
        if ($a.Value.Length -eq 0) { $a.Value =  $colorGroup }
    }
    $Element.Attributes.Append($SortedDocument.CreateAttribute('title')).Value = $node.title;
    $Element.Attributes.Append($SortedDocument.CreateAttribute('isSecondaryGroupMember')).Value = $isSecondaryGroupMember.ToString().ToLower();
    $OutputText = @();
    $CurrentLine = "    { `"name`": `"$($node.name.Replace('"', '\"'))`"";
    $node | Add-Member -MemberType NoteProperty -Name 'isSecondaryGroupMember' -Value $isSecondaryGroupMember;
    $TableRow = $TableElement.AppendChild($HtmlDocument.CreateElement('tr'));
    $CellElement = $TableRow.AppendChild($HtmlDocument.CreateElement('td'));
    $rgb = "#$($node.r.ToString('X2'))$($node.g.ToString('X2'))$($node.b.ToString('X2'))";
    $c = $node.cssName;
    if ([string]::IsNullOrEmpty($node.cssName)) { $c = $rgb }
    $CellElement.InnerText = $node.name;
    $CellElement.Attributes.Append($HtmlDocument.CreateAttribute('style')).Value = "background-color: $c";
    $allValues | ForEach-Object {
        $v = $node.($_);
        if ($_ -eq 'colorGroup') { $v = $colorGroup }
        if ($v -eq $null) { $v = '' };
        if ($v -isnot [string]) { $v = $v.ToString() }
        $TableRow.AppendChild($HtmlDocument.CreateElement('td')).InnerText = $v;
    }
    $TableRow.InsertBefore($HtmlDocument.CreateElement('td'), $TableRow.SelectSingleNode('td[6]')).InnerText = $rgb;
    foreach ($pn in $allValues) {
        $ValueText = "`"$pn`": ";
        $Value = $node.($pn);
        if ($Value -eq $null) {
            $ValueText += 'null';
        } else {
            if ($Value -is [string]) {
                $ValueText += "`"$($Value.Replace('"', '\"'))`"";
            } else {
                $s = $Value.ToString().ToLower();
                $ValueText += $s;
                if (-not ($boolValues -contains $pn -or $intValues -contains $pn -or $s.Contains('.'))) {
                     $ValueText += ".0";
                }
            }
        }
        if (($CurrentLine.Length + $ValueText.Length + 2) -gt 120) {
            $OutputText += $CurrentLine
            $CurrentLine = "        $ValueText";
        } else {
            $CurrentLine = "$CurrentLine, $ValueText";
        }
    }
    $CurrentLine += " }";
    $OutputText += $CurrentLine;
    $OutputText -join ",`n";
});


$XmlWriterSettings = [System.Xml.XmlWriterSettings]::new();
$XmlWriterSettings.Indent = $true;
$XmlWriterSettings.OmitXmlDeclaration = $true;
$XmlWriterSettings.Encoding = [System.Text.UTF8Encoding]::new($false);
$XmlWriter = [System.Xml.XmlWriter]::Create(($PSScriptRoot | Join-Path -ChildPath 'WebColors.xml'), $XmlWriterSettings);
$SortedDocument.WriteTo($XmlWriter);
$XmlWriter.Flush();
$XmlWriter.Close();

$XmlWriterSettings = [System.Xml.XmlWriterSettings]::new();
$XmlWriterSettings.Indent = $true;
$XmlWriterSettings.OmitXmlDeclaration = $true;
$XmlWriterSettings.Encoding = [System.Text.UTF8Encoding]::new($false);
$XmlWriter = [System.Xml.XmlWriter]::Create(($PSScriptRoot | Join-Path -ChildPath 'WebColors.htm'), $XmlWriterSettings);
$HtmlDocument.WriteTo($XmlWriter);
$XmlWriter.Flush();
$XmlWriter.Close();

$JSON = $Lines -join ",`n";
[System.IO.File]::WriteAllText(($PSScriptRoot | Join-Path -ChildPath 'WebColors.json'), ("[`n" + $JSON.Substring(1) + "`n]"));