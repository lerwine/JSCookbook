Function Get-ColorInfo {
    Param(
        [Parameter(Mandatory = $true)]
        [ValidateRange(0, 255)]
        [int]$R,

        [Parameter(Mandatory = $true)]
        [ValidateRange(0, 255)]
        [int]$G,
        
        [Parameter(Mandatory = $true)]
        [ValidateRange(0, 255)]
        [int]$B
    )
    
    $ColorInfo = $Script:AllColorData | Where-Object { $_.R -eq $R -and $_.G -eq $G -and $_.B -eq $B }
    if ($ColorInfo -eq $null) {
        $ColorInfo = New-Object -TypeName 'System.Management.Automation.PSObject' -Property @{
            ID = "$($R.ToString('x2'))$($G.ToString('x2'))$($B.ToString('x2'))"; R = $R; G = $G; B = $B
        };
        $Script:AllColorData.Add($ColorInfo);
    }
    $ColorInfo | Write-Output;
}

Function Add-ColorInfo {
    Param(
        [Parameter(Mandatory = $true)]
        [ValidateRange(0, 255)]
        [int]$R,

        [Parameter(Mandatory = $true)]
        [ValidateRange(0, 255)]
        [int]$G,
        
        [Parameter(Mandatory = $true)]
        [ValidateRange(0, 255)]
        [int]$B,

        [Parameter(Mandatory = $true)]
        [ValidateSet('Windows', 'X11', 'HtmlColor', 'WebSafeColor')]
        [string]$Source,

        [ValidateRange(0.0, 1.0)]
        [float]$Brightness,

        [ValidateRange(0.0, 1.0)]
        [float]$Saturation,

        [ValidateRange(0.0, 360.0)]
        [float]$Hue,

        [AllowEmptyString()]
        [string]$WindowsName = "",
        
        [AllowEmptyString()]
        [string]$CssName = "",
        
        [AllowEmptyString()]
        [string]$CssAlias = "",
        
        [int]$CssNumber,

        [AllowEmptyString()]
        [string]$X11Code = "",
        
        [AllowEmptyString()]
        [string]$VgaName = "",

        [string]$ColorGroup
    )
    
    $ColorInfo = Get-ColorInfo -R $R -G $G -B $B;
    if (-not $ColorInfo.("Is$Source")) {
        $ColorInfo | Add-Member -MemberType NoteProperty -Name "Is$Source" -Value $true;
    }
    if ($PSBoundParameters.ContainsKey('Brightness') -and $ColorInfo.Brightness -eq $null) {
        $ColorInfo | Add-Member -MemberType NoteProperty -Name 'Brightness' -Value $Brightness;
    }
    if ($PSBoundParameters.ContainsKey('Saturation') -and $ColorInfo.Saturation -eq $null) {
        $ColorInfo | Add-Member -MemberType NoteProperty -Name 'Saturation' -Value $Saturation;
    }
    if ($PSBoundParameters.ContainsKey('Hue') -and $ColorInfo.Hue -eq $null) {
        $ColorInfo | Add-Member -MemberType NoteProperty -Name 'Hue' -Value $Hue;
    }
    if ($PSBoundParameters.ContainsKey('ColorGroup')) {
        if ($ColorInfo.Group -eq $null) {
            $ColorInfo | Add-Member -MemberType NoteProperty -Name 'Group' -Value $ColorGroup;
        } else {
            if ($ColorInfo.Group -ne $ColorGroup) {
                Write-Warning "Cannot set group $ColorGroup for ($R,$G,$B): Color already is in group $($ColorInfo.Group)."
            }
        }
    }
    if ($CssName.Length -gt 0) {
        $NameInfo = $Script:AllCssNames | Where-Object { $_.Name -ieq $CssName };
        if ($NameInfo -ne $null) {
            if ($NameInfo.Colors -inotcontains $ColorInfo.ID) { $NameInfo.Colors.Add($ColorInfo.ID); }
        } else {
            $NameInfo = New-Object -TypeName 'System.Management.Automation.PSObject' -Property @{
                Name = $CssName;
                Colors = [System.Collections.ObjectModel.Collection[System.String]]::new();
            };
            $NameInfo.Colors.Add($ColorInfo.ID);
            $Script:AllCssNames.Add($NameInfo);
        }
    }
    if ($CssAlias.Length -gt 0) {
        $NameInfo = $Script:AllCssAliases | Where-Object { $_.Name -ieq $CssAlias };
        if ($NameInfo -ne $null) {
            if ($NameInfo.Colors -inotcontains $ColorInfo.ID) { $NameInfo.Colors.Add($ColorInfo.ID); }
        } else {
            $NameInfo = New-Object -TypeName 'System.Management.Automation.PSObject' -Property @{
                Name = $CssAlias;
                Colors = [System.Collections.ObjectModel.Collection[System.String]]::new();
            };
            $NameInfo.Colors.Add($ColorInfo.ID);
            $Script:AllCssAliases.Add($NameInfo);
        }
    }
    if ($PSBoundParameters.ContainsKey('CssNumber')) {
        $NumberInfo = $Script:AllCssNumbers | Where-Object { $_.Number -eq $CssNumber };
        if ($NumberInfo -ne $null) {
            if ($NumberInfo.Colors -inotcontains $ColorInfo.ID) { $NumberInfo.Colors.Add($ColorInfo.ID); }
        } else {
            $NumberInfo = New-Object -TypeName 'System.Management.Automation.PSObject' -Property @{
                Number = $CssNumber;
                Colors = [System.Collections.ObjectModel.Collection[System.String]]::new();
            };
            $NumberInfo.Colors.Add($ColorInfo.ID);
            $Script:AllCssNumbers.Add($NumberInfo);
        }
    }
    if ($X11Code.Length -gt 0) {
        $NameInfo = $Script:AllX11Codes | Where-Object { $_.Name -ieq $X11Code };
        if ($NameInfo -ne $null) {
            if ($NameInfo.Colors -inotcontains $ColorInfo.ID) { $NameInfo.Colors.Add($ColorInfo.ID); }
        } else {
            $NameInfo = New-Object -TypeName 'System.Management.Automation.PSObject' -Property @{
                Name = $X11Code;
                Colors = [System.Collections.ObjectModel.Collection[System.String]]::new();
            };
            $NameInfo.Colors.Add($ColorInfo.ID);
            $Script:AllX11Codes.Add($NameInfo);
        }
    }
    if ($VgaName.Length -gt 0) {
        $NameInfo = $Script:AllVGANames | Where-Object { $_.Name -ieq $VgaName };
        if ($NameInfo -ne $null) {
            if ($NameInfo.Colors -inotcontains $ColorInfo.ID) { $NameInfo.Colors.Add($ColorInfo.ID); }
        } else {
            $NameInfo = New-Object -TypeName 'System.Management.Automation.PSObject' -Property @{
                Name = $VgaName;
                Colors = [System.Collections.ObjectModel.Collection[System.String]]::new();
            };
            $NameInfo.Colors.Add($ColorInfo.ID);
            $Script:AllVGANames.Add($NameInfo);
        }
    }
    if ($WindowsName.Length -gt 0) {
        $NameInfo = $Script:AllWindowsNames | Where-Object { $_.Name -ieq $WindowsName };
        if ($NameInfo -ne $null) {
            if ($NameInfo.Colors -inotcontains $ColorInfo.ID) { $NameInfo.Colors.Add($ColorInfo.ID); }
        } else {
            $NameInfo = New-Object -TypeName 'System.Management.Automation.PSObject' -Property @{
                Name = $WindowsName;
                Colors = [System.Collections.ObjectModel.Collection[System.String]]::new();
            };
            $NameInfo.Colors.Add($ColorInfo.ID);
            $Script:AllWindowsNames.Add($NameInfo);
        }
    }
}

Function ConvertFrom-CamelCase {
    Param(
        [Parameter(Mandatory = $true)]
        [string]$Name
    )
    $MatchCollection = $Script:CamelCasePattern.Matches($Name.Trim());
    if ($MatchCollection.Count -eq 0) {
        if ($Name.Length -lt 2) { return $Name.ToUpper() }
        return $Name.Substring(0, 1).ToUpper() + $Name.Substring(1);
    } else {
        (@($MatchCollection) | ForEach-Object {
            if ($_.Groups['r'].Success) {
                ($_.Groups['l'].Value.ToUpper() + $_.Groups['r'].Value);
            } else {
                $_.Groups['l'].Value.ToUpper()
            }
        }) -join ' ';
    }
}

$Script:AllColorData = [System.Collections.ObjectModel.Collection[System.Management.Automation.PSObject]]::new();
$Script:AllCssNames = [System.Collections.ObjectModel.Collection[System.Management.Automation.PSObject]]::new();
$Script:AllCssNumbers = [System.Collections.ObjectModel.Collection[System.Management.Automation.PSObject]]::new();
$Script:AllCssAliases = [System.Collections.ObjectModel.Collection[System.Management.Automation.PSObject]]::new();
$Script:AllX11Codes = [System.Collections.ObjectModel.Collection[System.Management.Automation.PSObject]]::new();
$Script:AllVGANames = [System.Collections.ObjectModel.Collection[System.Management.Automation.PSObject]]::new();
256-16
$Script:ColorGroupDefinitions = @(
    @{ colorGroup = 'pink'; HueRange = @(316.0, 346.0); BrightnessRange = @(0.01, 1.1); Color = [System.Drawing.Color]::FromArgb(255, 255, 0, 255); XPath = '//*[@id="x11LeftCol"]/tbody/tr[count(preceding-sibling::tr[@id="redColorStart"])=0]' },
    @{ colorGroup = 'red'; HueRange = @(346.0, 16.0); BrightnessRange = @(0.01, 1.1); Color = [System.Drawing.Color]::FromArgb(255, 255, 0, 0); XPath = '//*[@id="x11LeftCol"]/tbody/tr[not(count(preceding-sibling::tr[@id="redColorStart"])=0) and count(preceding-sibling::tr[@id="orangeColorStart"])=0]' },
    @{ colorGroup = 'orange'; HueRange = @(16.0, 46.0); BrightnessRange = @(0.01, 1.1); Color = [System.Drawing.Color]::FromArgb(255, 255, 95, 0); XPath = '//*[@id="x11LeftCol"]/tbody/tr[not(count(preceding-sibling::tr[@id="orangeColorStart"])=0) and count(preceding-sibling::tr[@id="yellowColorStart"])=0]' },
    @{ colorGroup = 'yellow'; HueRange = @(46.0, 90.0); BrightnessRange = @(0.5, 1.1); Color = [System.Drawing.Color]::FromArgb(255, 255, 255, 0); XPath = '//*[@id="x11LeftCol"]/tbody/tr[not(count(preceding-sibling::tr[@id="yellowColorStart"])=0) and count(preceding-sibling::tr[@id="brownColorStart"])=0]' },
    @{ colorGroup = 'brown'; HueRange = @(46.0, 90.0); BrightnessRange = @(0.01, 1.1); Color = [System.Drawing.Color]::FromArgb(255, 63, 23, 0); XPath = '//*[@id="x11LeftCol"]/tbody/tr[not(count(preceding-sibling::tr[@id="brownColorStart"])=0)]' },
    @{ colorGroup = 'green'; HueRange = @(90.0, 150.0); BrightnessRange = @(0.01, 1.1); Color = [System.Drawing.Color]::FromArgb(255, 0, 255, 0); XPath = '//*[@id="x11CenterCol"]/tbody/tr[count(preceding-sibling::tr[@id="cyanColorStart"])=0]' },
    @{ colorGroup = 'cyan'; HueRange = @(150.0, 210.0); BrightnessRange = @(0.01, 1.1); Color = [System.Drawing.Color]::FromArgb(255, 0, 255, 255); XPath = '//*[@id="x11CenterCol"]/tbody/tr[not(count(preceding-sibling::tr[@id="cyanColorStart"])=0) and count(preceding-sibling::tr[@id="blueColorStart"])=0]' },
    @{ colorGroup = 'blue'; HueRange = @(210.0, 270.0); BrightnessRange = @(0.01, 1.1); Color = [System.Drawing.Color]::FromArgb(255, 0, 0, 255); XPath = '//*[@id="x11CenterCol"]/tbody/tr[not(count(preceding-sibling::tr[@id="blueColorStart"])=0)]' },
    @{ colorGroup = 'purple'; HueRange = @(270.0, 316.0); BrightnessRange = @(0.01, 1.1); Color = [System.Drawing.Color]::FromArgb(255, 127, 0, 255); XPath = '//*[@id="x11RightCol"]/tbody/tr[count(preceding-sibling::tr[@id="whiteColorStart"])=0]' },
    @{ colorGroup = 'white'; HueRange = @(0.0, 360.0); BrightnessRange = @(1.1, 1.1); Color = [System.Drawing.Color]::FromArgb(255, 255, 255, 255); XPath = '//*[@id="x11RightCol"]/tbody/tr[not(count(preceding-sibling::tr[@id="whiteColorStart"])=0) and count(preceding-sibling::tr[@id="grayColorStart"])=0]' },
    @{ colorGroup = 'gray'; HueRange = @(0.0, 360.0); BrightnessRange = @(0.0, 0.01); Color = [System.Drawing.Color]::FromArgb(255, 00, 00, 00); XPath = '//*[@id="x11RightCol"]/tbody/tr[not(count(preceding-sibling::tr[@id="grayColorStart"])=0)]' }
);
$Script:ColorsXmlDocument = [System.Xml.XmlDocument]::new();
$Path = $PSScriptRoot | Join-Path -ChildPath 'WebColors.xml';
$Script:ColorsXmlDocument.Load($Path);

[System.IO.File]::Copy($Path, ($PSScriptRoot | Join-Path -ChildPath "WebColors-backup$([DateTime]::Now.ToString('yyyyMMddHHmmssffffff')).xml"));
$WebColorsHtmlDocument = [System.Xml.XmlDocument]::new();
$originalDataText = $Script:ColorsXmlDocument.SelectSingleNode('/colors/originalData').InnerText;
$WebColorsHtmlDocument.LoadXml($originalDataText.Replace('&nbsp;', '&#160;'));

$Script:RgbPattern = [System.Text.RegularExpressions.Regex]::new('rgb\(\s*(?<r>\d+)\s*,\s*(?<g>\d+)\s*,\s*(?<b>\d+)\s*\)', ([System.Text.RegularExpressions.RegexOptions]::Compiled -bor [System.Text.RegularExpressions.RegexOptions]::IgnoreCase));
$Script:HexPattern = [System.Text.RegularExpressions.Regex]::new('\#?((?<r>[a-f\d]{2})\s*(?<g>[a-f\d]{2})\s*(?<b>[a-f\d]{2})|(?<r>[a-f\d])(?<g>[a-f\d])(?<b>[a-f\d]))', ([System.Text.RegularExpressions.RegexOptions]::Compiled -bor [System.Text.RegularExpressions.RegexOptions]::IgnoreCase));
$Script:NumberNamePattern = [System.Text.RegularExpressions.Regex]::new('(?<n>\d+)(\s*\(\s*(?<v>[^\s\(\)]+(\s+[^\s\(\)]+)*)\s*\))?(\s*;?\s*(?<c>\S+))?', ([System.Text.RegularExpressions.RegexOptions]::Compiled -bor [System.Text.RegularExpressions.RegexOptions]::IgnoreCase));
$Script:StyleBgColorNamePattern = [System.Text.RegularExpressions.Regex]::new('(^|;)\s*background:\s*(?<n>[^;\#\(\)\s]+)', ([System.Text.RegularExpressions.RegexOptions]::Compiled -bor [System.Text.RegularExpressions.RegexOptions]::IgnoreCase));
$Script:CamelCasePattern = [System.Text.RegularExpressions.Regex]::new('(^|\G)\s*(?<l>\d+|[A-Z]+|[^\#\s])(?<r>[^A-Z\d\s]+)?', [System.Text.RegularExpressions.RegexOptions]::Compiled);

$Script:ColorsXmlDocument = [System.Xml.XmlDocument]::new();
$Script:ColorsXmlDocument.AppendChild($Script:ColorsXmlDocument.CreateElement('colors')) | Out-Null;

foreach ($PropertyInfo in @([System.Drawing.Color].GetProperties() | Where-Object { $_.CanRead -and $_.GetGetMethod().IsStatic })) {
    [System.Drawing.Color]$Color = $PropertyInfo.GetValue($null);
    if ($Color.A -eq 0) { continue }
    $n = $Color.Name;
    if ($n -eq $null -or $n.Length -eq 0) { $n = $PropertyInfo.Name }
    Add-ColorInfo -R $Color.R -G $Color.G -B $Color.B -Brightness $Color.GetBrightness() -Saturation $Color.GetSaturation() -Hue $Color.GetHue() -WindowsName $n -Source 'Windows';
}

$Script:ColorGroupDefinitions | ForEach-Object {
    $TableRows = @($WebColorsHtmlDocument.SelectNodes($_.XPath));
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
                $CssName = $M.Groups['n'].Value;
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
        Add-ColorInfo -R $R -G $G -B $B -Source 'X11' -CssName $CssName -X11Code $X11Code -ColorGroup $_.colorGroup;
    }
}

$XPath = '/html/body/table[@id="htmlColors"]/tbody/tr';
$XPath = '//*[@id="htmlColors"]/tbody/tr';
$TableRows = @($WebColorsHtmlDocument.SelectNodes($XPath));
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
    if ($M.Groups['c'].Success) { $CssAlias = $M.Groups['c'].Value }

    Add-ColorInfo -R $R -G $G -B $B -Source 'HtmlColor' -CssAlias $CssAlias -CssNumber $CssNumber -VgaName $VgaName;
}

$XPath = '//*[@id="webSafeColors"]/tbody/tr';
$TableRows = @($WebColorsHtmlDocument.SelectNodes($XPath));
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

        Add-ColorInfo -R $R -G $G -B $B -Source 'WebSafeColor';
    }
}

foreach ($CssAliasInfo in $Script:AllCssAliases) {
    $NameInfo = $Script:AllCssAliases | Where-Object { $_.Name -ieq $CssAliasInfo.Name };
    if ($NameInfo -eq $null) {
        $AllCssNames.Insert(0, $CssAliasInfo);
    } else {
        for ($i = $CssAliasInfo.Colors.Count - 1; $i -ge 0; $i--) {
            if (-not $NameInfo.Colors.Contains($CssAliasInfo.Colors[$i])) { $NameInfo.Colors.Add($CssAliasInfo.Colors[$i]) }
        }
    }
};

$Script:OutputXmlDocument = [System.Xml.XmlDocument]::new();
$Script:OutputXmlDocument.AppendChild($Script:OutputXmlDocument.CreateElement('colors')) | Out-Null;
$TextWriter = [System.IO.StreamWriter]::new(($PSScriptRoot | Join-Path -ChildPath 'WebColors.json'), ([System.Text.UTF8Encoding]::new($false)));
$TextWriter.WriteLine('{');
$groupNamesElement = $Script:OutputXmlDocument.DocumentElement.AppendChild($Script:OutputXmlDocument.CreateElement('groupNames'));
$CurrentLine = '';
$Script:ColorGroupDefinitions | ForEach-Object {
    $groupNamesElement.AppendChild($Script:OutputXmlDocument.CreateElement('n')).InnerText = $_.colorGroup;
    if ($CurrentLine.Length -eq 0) {
        $CurrentLine = "    `"groupNames`": [ `"$($_.colorGroup)`"";
    } else {
        if (($CurrentLine.Length + $_.colorGroup.Length + 4) -gt 120) {
            $TextWriter.WriteLine("$CurrentLine,");
            $CurrentLine = "        `"$($_.colorGroup)`"";
        } else {
            $CurrentLine = "$CurrentLine, `"$($_.colorGroup)`"";
        }
    }
}
$TextWriter.WriteLine("$CurrentLine ],");
$TextWriter.WriteLine("    `"colors`": [");

foreach ($ColorInfo in $Script:AllColorData) {
    if ($ColorInfo.Hue -eq $null) {
        $Color = [System.Drawing.Color]::FromArgb(255, $ColorInfo.R, $ColorInfo.G, $ColorInfo.B);
        $ColorInfo | Add-Member -MemberType NoteProperty -Name 'Brightness' -Value $Color.GetBrightness();
        $ColorInfo | Add-Member -MemberType NoteProperty -Name 'Saturation' -Value $Color.GetSaturation();
        $ColorInfo | Add-Member -MemberType NoteProperty -Name 'Hue' -Value $Color.GetHue();
    }
}
$Script:AllColorData = @($Script:AllColorData | Sort-Object -Property 'Hue', 'Brightness', 'Saturation', 'ID');
$CurrentLine = '';
foreach ($ColorInfo in $Script:AllColorData) {
    if ($CurrentLine.Length -gt 0) {
        $TextWriter.WriteLine("$CurrentLine,")
    }
    $CurrentLine = "        { `"id`": `"$($ColorInfo.ID)`"";
    
    if ($ColorInfo.Group -eq $null) {
        $cgd = $null;
        $v = $ColorInfo.Brightness;
        if ($ColorInfo.Saturation -lt 0.15) {
            if ($ColorInfo.Brightness -lt 0.75) {
                $cgd = $Script:ColorGroupDefinitions | Where-Object { $_.colorGroup -eq 'gray' }
            } else {
                $cgd = $Script:ColorGroupDefinitions | Where-Object { $_.colorGroup -eq 'white' }
            }
        } else {
            if ($ColorInfo.Saturation -lt 0.5) {
                if ($ColorInfo.Brightness -lt 0.15) {
                    $cgd = $Script:ColorGroupDefinitions | Where-Object { $_.colorGroup -eq 'gray' }
                } else {
                    if ($ColorInfo.Brightness -gt 0.95) {
                        $cgd = $Script:ColorGroupDefinitions | Where-Object { $_.colorGroup -eq 'white' }
                    }
                }
            }
        }
        if ($cgd -eq $null) {
            $cgd = $Script:ColorGroupDefinitions | Where-Object {
                if ($_.HueRange[0] -gt $_.HueRange[1]) {
                    if ($ColorInfo.Hue -ge $_.HueRange[1] -and $ColorInfo.Hue -lt $_.HueRange[0]) { return $false }
                } else {
                    if ($ColorInfo.Hue -lt $_.HueRange[0] -or $ColorInfo.Hue -ge $_.HueRange[1]) { return $false }
                }
                return ($ColorInfo.Brightness -ge $_.BrightnessRange[0] -and $ColorInfo.Brightness -lt $_.BrightnessRange[1]);
            };
        }
        <#$ShortestDistance = [float]::MaxValue;
        $cgd = $Script:ColorGroupDefinitions[0];
        foreach ($Def in $Script:ColorGroupDefinitions) {
            $b = ($ColorInfo.Brightness - $Def.Color.GetBrightness()) * 18.0;
            $s = ($ColorInfo.Saturation - $Def.Color.GetSaturation()) * 18.0;
            $h = ($ColorInfo.Hue - $Def.Color.GetHue()) / 10.0;
            if ($h -lt -180.0) {
                $h += 180.0;
            } else {
                if ($h -gt 180.0) { $h -= 180.0 }
            }
            $d = [System.Math]::Sqrt(($b * $b) + ($s * $s) + ($h * $h));
            if ($d -lt $ShortestDistance) {
                $ShortestDistance = $d;
                $cgd = $Def;
                if ($d -eq 0.0) { break }
            }
        }#>
        $ColorInfo | Add-Member -MemberType NoteProperty -Name 'Group' -Value $cgd.colorGroup;
    }
    $NameInfo = $Script:AllWindowsNames | Where-Object { $_.Colors.Contains($ColorInfo.ID) } | Select-Object -Last 1;
    if ($NameInfo -eq $null) {
        $NameInfo = $Script:AllCssNames | Where-Object { $_.Colors.Contains($ColorInfo.ID) } | Select-Object -Last 1;
        if ($NameInfo -eq $null) {
            $NameInfo = $Script:AllX11Codes | Where-Object { $_.Colors.Contains($ColorInfo.ID) } | Select-Object -Last 1;
            if ($NameInfo -eq $null) {
                $NameInfo = $Script:AllVGANames | Where-Object { $_.Colors.Contains($ColorInfo.ID) } | Select-Object -Last 1;
            }
        }
    }
    $JSONPairs = @();
    if ($NameInfo -ne $null) {
        $ColorInfo | Add-Member -MemberType NoteProperty -Name 'Name' -Value (ConvertFrom-CamelCase -Name $NameInfo.Name);
        $JSONPairs += @("`"name`": `"$($ColorInfo.Name)`"");
    } else {
        $JSONPairs += @('"name": null');
    }
    
    $XmlElement = $Script:OutputXmlDocument.DocumentElement.AppendChild($Script:OutputXmlDocument.CreateElement('color'));
    $XmlElement.Attributes.Append($Script:OutputXmlDocument.CreateAttribute('id')).Value = $ColorInfo.ID;
    $XmlElement.Attributes.Append($Script:OutputXmlDocument.CreateAttribute('r')).Value = $ColorInfo.R;
    $XmlElement.Attributes.Append($Script:OutputXmlDocument.CreateAttribute('g')).Value = $ColorInfo.G;
    $XmlElement.Attributes.Append($Script:OutputXmlDocument.CreateAttribute('b')).Value = $ColorInfo.B;
    $XmlElement.Attributes.Append($Script:OutputXmlDocument.CreateAttribute('hue')).Value = $ColorInfo.Hue;
    $XmlElement.Attributes.Append($Script:OutputXmlDocument.CreateAttribute('brightness')).Value = $ColorInfo.Brightness;
    $XmlElement.Attributes.Append($Script:OutputXmlDocument.CreateAttribute('saturation')).Value = $ColorInfo.Saturation;
    $XmlElement.Attributes.Append($Script:OutputXmlDocument.CreateAttribute('group')).Value = $ColorInfo.Group;
    
    $JSONPairs += @("`"group`": `"$($ColorInfo.Group)`"");
    $JSONPairs += @("`"r`": $($ColorInfo.R)", "`"g`": $($ColorInfo.G)", "`"b`": $($ColorInfo.B)");
    $s = $ColorInfo.Hue.ToString();
    if (-not $s.Contains(".")) { $s = "$s.0" }
    $JSONPairs += @("`"hue`": $s");
    $s = $ColorInfo.Brightness.ToString();
    if (-not $s.Contains(".")) { $s = "$s.0" }
    $JSONPairs += @("`"brightness`": $s");
    $s = $ColorInfo.Saturation.ToString();
    if (-not $s.Contains(".")) { $s = "$s.0" }
    $JSONPairs += @("`"saturation`": $s");
    if ($ColorInfo.IsWindows) {
        $XmlElement.Attributes.Append($Script:OutputXmlDocument.CreateAttribute('isWindows')).Value = 'true';
        $JSONPairs += @('"isWindows": true');
    } else {
        $JSONPairs += @('"isWindows": false');
    }
    if ($ColorInfo.IsX11) {
        $XmlElement.Attributes.Append($Script:OutputXmlDocument.CreateAttribute('isX11')).Value = 'true';
        $JSONPairs += @('"isX11": true');
    } else {
        $JSONPairs += @('"isX11": false');
    }
    if ($ColorInfo.IsHtml) {
        $XmlElement.Attributes.Append($Script:OutputXmlDocument.CreateAttribute('isHtml')).Value = 'true';
        $JSONPairs += @('"isHtml": true');
    } else {
        $JSONPairs += @('"isHtml": false');
    }
    if ($ColorInfo.IsWebSafe) {
        $XmlElement.Attributes.Append($Script:OutputXmlDocument.CreateAttribute('isWebSafe')).Value = 'true';
        $JSONPairs += @('"isWebSafe": true');
    } else {
        $JSONPairs += @('"isWebSafe": false');
    }

    $JSONPairs | ForEach-Object {
        if (($CurrentLine.Length + $_.Length + 2) -gt 120) {
            $TextWriter.WriteLine("$CurrentLine,");
            $CurrentLine = "            $_";
        } else {
            $CurrentLine = "$CurrentLine, $_";
        }
    }

    $CurrentLine += " }";
}
$TextWriter.WriteLine($CurrentLine);
$TextWriter.WriteLine("    ],");
$TextWriter.WriteLine("    `"cssNumbers`": [");

$BodyElement = $WebColorsHtmlDocument.DocumentElement.SelectSingleNode('body');
$BodyElement.RemoveAll();
$TableElement = $BodyElement.AppendChild($WebColorsHtmlDocument.CreateElement('table'));
$TableRowElement = $TableElement.AppendChild($WebColorsHtmlDocument.CreateElement('tr'));
$TableRowElement.AppendChild($WebColorsHtmlDocument.CreateElement('th')).InnerText = 'ID';
$TableRowElement.AppendChild($WebColorsHtmlDocument.CreateElement('th')).InnerText = 'RGB';
$TableRowElement.AppendChild($WebColorsHtmlDocument.CreateElement('th')).InnerText = 'HSB';
$TableRowElement.AppendChild($WebColorsHtmlDocument.CreateElement('th')).InnerText = 'CSS #';
$TableRowElement.AppendChild($WebColorsHtmlDocument.CreateElement('th')).InnerText = 'CSS name';
$TableRowElement.AppendChild($WebColorsHtmlDocument.CreateElement('th')).InnerText = 'X11 name';
$TableRowElement.AppendChild($WebColorsHtmlDocument.CreateElement('th')).InnerText = 'VGA name';
$TableRowElement.AppendChild($WebColorsHtmlDocument.CreateElement('th')).InnerText = 'Windows name';

$CurrentGroup = '';
foreach ($ColorInfo in @($Script:AllColorData | Sort-Object -Property 'Group', 'Hue', 'Brightness', 'Saturation')) {
    if ($CurrentGroup -ne $ColorInfo.Group) {
        $CurrentGroup = $ColorInfo.Group;
        $TableRowElement = $TableElement.AppendChild($WebColorsHtmlDocument.CreateElement('tr'));
        $TableDataElement = $TableRowElement.AppendChild($WebColorsHtmlDocument.CreateElement('td'));
        $TableDataElement.Attributes.Append($WebColorsHtmlDocument.CreateAttribute('style')).Value = 'font-weight: bold';
        $TableDataElement.Attributes.Append($WebColorsHtmlDocument.CreateAttribute('colspan')).Value = '7';
        $TableDataElement.InnerText = $CurrentGroup;
    }
    $TableRowElement = $TableElement.AppendChild($WebColorsHtmlDocument.CreateElement('tr'));
    $TableDataElement = $TableRowElement.AppendChild($WebColorsHtmlDocument.CreateElement('td'));
    $TableDataElement.Attributes.Append($WebColorsHtmlDocument.CreateAttribute('style')).Value = "background-color: #$($ColorInfo.ID)";
    $TableDataElement.InnerText = $ColorInfo.ID;
    $TableRowElement.AppendChild($WebColorsHtmlDocument.CreateElement('td')).InnerText = "$($ColorInfo.R), $($ColorInfo.G), $($ColorInfo.B)";
    $TableRowElement.AppendChild($WebColorsHtmlDocument.CreateElement('td')).InnerText = "$($ColorInfo.Hue), $($ColorInfo.Saturation), $($ColorInfo.Brightness)";
    $TableRowElement.AppendChild($WebColorsHtmlDocument.CreateElement('td')).InnerText = ($Script:AllCssNumbers | Where-Object { $_.Colors.Contains($ColorInfo.ID) } | ForEach-Object { $_.Number }) -join ", ";
    $TableRowElement.AppendChild($WebColorsHtmlDocument.CreateElement('td')).InnerText = ($Script:AllCssNames | Where-Object { $_.Colors.Contains($ColorInfo.ID) } | ForEach-Object { $_.Name }) -join ", ";
    $TableRowElement.AppendChild($WebColorsHtmlDocument.CreateElement('td')).InnerText = ($Script:AllX11Codes | Where-Object { $_.Colors.Contains($ColorInfo.ID) } | ForEach-Object { $_.Name }) -join ", ";
    $TableRowElement.AppendChild($WebColorsHtmlDocument.CreateElement('td')).InnerText = ($Script:AllVgaNames | Where-Object { $_.Colors.Contains($ColorInfo.ID) } | ForEach-Object { $_.Name }) -join ", ";
    $TableRowElement.AppendChild($WebColorsHtmlDocument.CreateElement('td')).InnerText = ($Script:AllWindowsNames | Where-Object { $_.Colors.Contains($ColorInfo.ID) } | ForEach-Object { $_.Name }) -join ", ";
}

$CssNumbersElement = $Script:OutputXmlDocument.DocumentElement.AppendChild($Script:OutputXmlDocument.CreateElement('cssNumbers'));
$CurrentLine = '';
($Script:AllCssNumbers | Sort-Object -Property 'Number') | ForEach-Object {
    $XmlElement = $CssNumbersElement.AppendChild($Script:OutputXmlDocument.CreateElement('number'));
    $XmlElement.Attributes.Append($Script:OutputXmlDocument.CreateAttribute('value')).Value = $_.Number.ToString();
    if ($CurrentLine.Length -gt 0) {
        $TextWriter.WriteLine("$CurrentLine,")
    }
    if ($_.Colors.Count -gt 1) { Write-Warning -Message "CSS Number $($_.Number) has $($_.Color.Count) colors." }
    $CurrentLine = "        { `"number`": $($_.Number), `"id`": `"$($_.Colors[0])`" }";
    $XmlElement.Attributes.Append($Script:OutputXmlDocument.CreateAttribute('id')).Value = $_.Colors[0];
}
$TextWriter.WriteLine($CurrentLine);
$TextWriter.WriteLine("    ],");

$TextWriter.WriteLine("    `"cssNames`": [");
$CssNamesElement = $Script:OutputXmlDocument.DocumentElement.AppendChild($Script:OutputXmlDocument.CreateElement('cssNames'));
$CurrentLine = '';
($Script:AllCssNames | Sort-Object -Property 'Name') | ForEach-Object {
    $XmlElement = $CssNamesElement.AppendChild($Script:OutputXmlDocument.CreateElement('name'));
    $XmlElement.Attributes.Append($Script:OutputXmlDocument.CreateAttribute('value')).Value = $_.Name;
    if ($CurrentLine.Length -gt 0) {
        $TextWriter.WriteLine("$CurrentLine,")
    }
    if ($_.Colors.Count -gt 1) { Write-Warning -Message "CSS Name $($_.Name) has $($_.Color.Count) colors." }
    $CurrentLine = "        { `"name`": `"$($_.Name)`", `"id`": `"$($_.Colors[0])`" }";
    $XmlElement.Attributes.Append($Script:OutputXmlDocument.CreateAttribute('id')).Value = $_.Colors[0];
}
$TextWriter.WriteLine($CurrentLine);
$TextWriter.WriteLine("    ],");

$TextWriter.WriteLine("    `"x11Codes`": [");
$X11NamesElement = $Script:OutputXmlDocument.DocumentElement.AppendChild($Script:OutputXmlDocument.CreateElement('x11Codes'));
$CurrentLine = '';
($Script:AllX11Codes | Sort-Object -Property 'Name') | ForEach-Object {
    $XmlElement = $X11NamesElement.AppendChild($Script:OutputXmlDocument.CreateElement('code'));
    $XmlElement.Attributes.Append($Script:OutputXmlDocument.CreateAttribute('value')).Value = $_.Name;
    if ($CurrentLine.Length -gt 0) {
        $TextWriter.WriteLine("$CurrentLine,")
    }
    if ($_.Colors.Count -gt 1) { Write-Warning -Message "X11 Name $($_.Name) has $($_.Color.Count) colors." }
    $CurrentLine = "        { `"code`": `"$($_.Name)`", `"id`": `"$($_.Colors[0])`" }";
    $XmlElement.Attributes.Append($Script:OutputXmlDocument.CreateAttribute('id')).Value = $_.Colors[0];
}
$TextWriter.WriteLine($CurrentLine);
$TextWriter.WriteLine("    ],");

$TextWriter.WriteLine("    `"vgaNames`": [");
$VGANamesElement = $Script:OutputXmlDocument.DocumentElement.AppendChild($Script:OutputXmlDocument.CreateElement('vgaNames'));
$CurrentLine = '';
($Script:AllVGANames | Sort-Object -Property 'Name') | ForEach-Object {
    $XmlElement = $VGANamesElement.AppendChild($Script:OutputXmlDocument.CreateElement('name'));
    $XmlElement.Attributes.Append($Script:OutputXmlDocument.CreateAttribute('value')).Value = $_.Name;
    if ($CurrentLine.Length -gt 0) {
        $TextWriter.WriteLine("$CurrentLine,")
    }
    if ($_.Colors.Count -gt 1) { Write-Warning -Message "VGA Name $($_.Name) has $($_.Color.Count) colors." }
    $CurrentLine = "        { `"name`": `"$($_.Name)`", `"id`": `"$($_.Colors[0])`" }";
    $XmlElement.Attributes.Append($Script:OutputXmlDocument.CreateAttribute('id')).Value = $_.Colors[0];
}
$TextWriter.WriteLine($CurrentLine);
$TextWriter.WriteLine("    ],");

$TextWriter.WriteLine("    `"windowsNames`": [");
$WindowsNamesElement = $Script:OutputXmlDocument.DocumentElement.AppendChild($Script:OutputXmlDocument.CreateElement('windowsNames'));
$CurrentLine = '';
($Script:AllWindowsNames | Sort-Object -Property 'Name') | ForEach-Object {
    $XmlElement = $WindowsNamesElement.AppendChild($Script:OutputXmlDocument.CreateElement('name'));
    $XmlElement.Attributes.Append($Script:OutputXmlDocument.CreateAttribute('value')).Value = $_.Name;
    if ($CurrentLine.Length -gt 0) {
        $TextWriter.WriteLine("$CurrentLine,")
    }
    if ($_.Colors.Count -gt 1) { Write-Warning -Message "Windows Name $($_.Name) has $($_.Color.Count) colors." }
    $CurrentLine = "        { `"name`": `"$($_.Name)`", `"id`": `"$($_.Colors[0])`" }";
    $XmlElement.Attributes.Append($Script:OutputXmlDocument.CreateAttribute('id')).Value = $_.Colors[0];
}
$TextWriter.WriteLine($CurrentLine);
$TextWriter.WriteLine("    ]");
$TextWriter.WriteLine("}");

$Script:OutputXmlDocument.DocumentElement.AppendChild($Script:OutputXmlDocument.CreateElement('originalData')).AppendChild($Script:OutputXmlDocument.CreateCDataSection($originalDataText)) | Out-Null;

$XmlWriterSettings = [System.Xml.XmlWriterSettings]::new();
$XmlWriterSettings.Indent = $true;
$XmlWriterSettings.OmitXmlDeclaration = $true;
$XmlWriterSettings.Encoding = [System.Text.UTF8Encoding]::new($false);
$XmlWriter = [System.Xml.XmlWriter]::Create($Path, $XmlWriterSettings);
$Script:OutputXmlDocument.WriteTo($XmlWriter);
$XmlWriter.Flush();
$XmlWriter.Close();
$TextWriter.Flush();
$TextWriter.Close();

$MemoryStream = [System.IO.MemoryStream]::new();
$XmlWriter = [System.Xml.XmlWriter]::Create($MemoryStream, $XmlWriterSettings);
$WebColorsHtmlDocument.WriteTo($XmlWriter);
$XmlWriter.Flush();
[System.IO.File]::WriteAllText(($PSScriptRoot | Join-Path -ChildPath 'WebColors.html'), $XmlWriterSettings.Encoding.GetString($MemoryStream.ToArray()).Replace('&#160;', '&nbsp;'));
#[System.IO.File]::WriteAllText('C:\Users\Daddy\GitHub\JSCookbook\JSCookbook\Colors\WebColors.html', $XmlWriterSettings.Encoding.GetString($MemoryStream.ToArray()).Replace('&#160;', '&nbsp;'));
$XmlWriter.Close();
$MemoryStream.Dispose();