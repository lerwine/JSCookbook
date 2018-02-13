Param(
    [bool]$ForceRebuild = $false
)
$Script:ColorsXmlDocument = [System.Xml.XmlDocument]::new();
$Path = $PSScriptRoot | Join-Path -ChildPath 'WebColors.xml';
$Script:ColorsXmlDocument.Load($Path);

if ($Script:ColorsXmlDocument.SelectSingleNode('/colors/color') -eq $null -or $ForceRebuild) {
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
    [System.Xml.XmlElement]$ColorXmlElement = $Script:ColorsXmlDocument.SelectSingleNode("/colors/color[@r=$R and @g=$G and @b=$B]");
    if ($ColorXmlElement -eq $null) {
        $ColorXmlElement = $Script:ColorsXmlDocument.DocumentElement.AppendChild($Script:ColorsXmlDocument.CreateElement('color'));
        $ColorXmlElement.Attributes.Append($Script:ColorsXmlDocument.CreateAttribute('r')).Value = $R.ToString();
        $ColorXmlElement.Attributes.Append($Script:ColorsXmlDocument.CreateAttribute('g')).Value = $G.ToString();
        $ColorXmlElement.Attributes.Append($Script:ColorsXmlDocument.CreateAttribute('b')).Value = $B.ToString();
        $ColorXmlElement.Attributes.Append($Script:ColorsXmlDocument.CreateAttribute("is$Source")).Value = 'true';
    } else {
        $XmlAttribute = $ColorXmlElement.SelectSingleNode("@is$Source");
        if ($XmlAttribute -eq $null) {
            $ColorXmlElement.Attributes.Append($Script:ColorsXmlDocument.CreateAttribute("is$Source")).Value = 'true';
        }
    }
    if ($PSBoundParameters.ContainsKey('Brightness')) {
        $XmlAttribute = $ColorXmlElement.SelectSingleNode('@brightness');
        if ($XmlAttribute -eq $null) {
            $ColorXmlElement.Attributes.Append($Script:ColorsXmlDocument.CreateAttribute('brightness')).Value = [System.Xml.XmlConvert]::ToString($Brightness);
        }
    }
    if ($PSBoundParameters.ContainsKey('Saturation')) {
        $XmlAttribute = $ColorXmlElement.SelectSingleNode('@saturation');
        if ($XmlAttribute -eq $null) {
            $ColorXmlElement.Attributes.Append($Script:ColorsXmlDocument.CreateAttribute('saturation')).Value = [System.Xml.XmlConvert]::ToString($Saturation);
        }
    }
    if ($PSBoundParameters.ContainsKey('Hue')) {
        $XmlAttribute = $ColorXmlElement.SelectSingleNode('@hue');
        if ($XmlAttribute -eq $null) {
            $ColorXmlElement.Attributes.Append($Script:ColorsXmlDocument.CreateAttribute('hue')).Value = [System.Xml.XmlConvert]::ToString($Hue);
        }
    }
    if ($PSBoundParameters.ContainsKey('ColorGroup')) {
        if ($ColorXmlElement.SelectSingleNode("group[.=`"$($ColorGroup.Replace('"', '&quot;'))`"]") -eq $null) {
            $ColorXmlElement.AppendChild($Script:ColorsXmlDocument.CreateElement('group')).InnerText = $ColorGroup;
        }
    }
    if ($CssName.Length -gt 0) {
        $XmlElement = $ColorXmlElement.SelectSingleNode("cssName[translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz')=`"$($CssName.ToLower().Replace('"', '&quot;'))`"]");
        if ($XmlElement -eq $null) {
            $XmlElement = $ColorXmlElement.AppendChild($Script:ColorsXmlDocument.CreateElement('cssName'))
            $XmlElement.InnerText = $CssName;
        }
        $XmlAttribute = $XmlElement.SelectSingleNode("@is$Source");
        if ($XmlAttribute -eq $null) {
            $XmlElement.Attributes.Append($Script:ColorsXmlDocument.CreateAttribute("is$Source")).Value = 'true';
        } else {
            $XmlAttribute.Value = 'true';
        }
    }
    if ($CssAlias.Length -gt 0) {
        if ($ColorXmlElement.SelectSingleNode("cssAlias[translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz')=`"$($CssAlias.ToLower().Replace('"', '&quot;'))`"]") -eq $null) {
            $ColorXmlElement.AppendChild($Script:ColorsXmlDocument.CreateElement('cssAlias')).InnerText = $CssAlias;
        }
    }
    if ($PSBoundParameters.ContainsKey('CssNumber')) {
        if ($ColorXmlElement.SelectSingleNode("cssNumber[.=$CssNumber]") -eq $null) {
            $ColorXmlElement.AppendChild($Script:ColorsXmlDocument.CreateElement('cssNumber')).InnerText = $CssNumber.ToString();
        }
    }
    if ($X11Code.Length -gt 0) {
        if ($ColorXmlElement.SelectSingleNode("x11Code[translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz')=`"$($X11Code.ToLower().Replace('"', '&quot;'))`"]") -eq $null) {
            $ColorXmlElement.AppendChild($Script:ColorsXmlDocument.CreateElement('x11Code')).InnerText = $X11Code;
        }
    }
    if ($VgaName.Length -gt 0) {
        if ($ColorXmlElement.SelectSingleNode("vgaName[translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz')=`"$($VgaName.ToLower().Replace('"', '&quot;'))`"]") -eq $null) {
            $ColorXmlElement.AppendChild($Script:ColorsXmlDocument.CreateElement('vgaName')).InnerText = $VgaName;
        }
    }
    if ($WindowsName.Length -gt 0) {
        if ($ColorXmlElement.SelectSingleNode("windowsName[translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz')=`"$($WindowsName.ToLower().Replace('"', '&quot;'))`"]") -eq $null) {
            $ColorXmlElement.AppendChild($Script:ColorsXmlDocument.CreateElement('windowsName')).InnerText = $WindowsName;
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

    foreach ($PropertyInfo in @([System.Drawing.Color].GetProperties() | Where-Object { $_.CanRead -and $_.GetGetMethod().IsStatic })) {
        [System.Drawing.Color]$Color = $PropertyInfo.GetValue($null);
        if ($Color.A -eq 0) { continue }
        $n = $Color.Name;
        if ($n -eq $null -or $n.Length -eq 0) { $n = $PropertyInfo.Name }
        Add-ColorInfo -R $Color.R -G $Color.G -B $Color.B -Brightness $Color.GetBrightness() -Saturation $Color.GetSaturation() -Hue $Color.GetHue() -WindowsName $n -Source 'Windows';
    }

    $ColorGroupDefs = @(
        @{ colorGroup = 'pink'; XPath = '//*[@id="x11LeftCol"]/tbody/tr[count(preceding-sibling::tr[@id="redColorStart"])=0]' },
        @{ colorGroup = 'red'; XPath = '//*[@id="x11LeftCol"]/tbody/tr[not(count(preceding-sibling::tr[@id="redColorStart"])=0) and count(preceding-sibling::tr[@id="orangeColorStart"])=0]' },
        @{ colorGroup = 'orange'; XPath = '//*[@id="x11LeftCol"]/tbody/tr[not(count(preceding-sibling::tr[@id="orangeColorStart"])=0) and count(preceding-sibling::tr[@id="yellowColorStart"])=0]' },
        @{ colorGroup = 'yellow'; XPath = '//*[@id="x11LeftCol"]/tbody/tr[not(count(preceding-sibling::tr[@id="yellowColorStart"])=0) and count(preceding-sibling::tr[@id="brownColorStart"])=0]' },
        @{ colorGroup = 'brown'; XPath = '//*[@id="x11LeftCol"]/tbody/tr[not(count(preceding-sibling::tr[@id="brownColorStart"])=0)]' },
        @{ colorGroup = 'green'; XPath = '//*[@id="x11CenterCol"]/tbody/tr[count(preceding-sibling::tr[@id="cyanColorStart"])=0]' },
        @{ colorGroup = 'cyan'; XPath = '//*[@id="x11CenterCol"]/tbody/tr[not(count(preceding-sibling::tr[@id="cyanColorStart"])=0) and count(preceding-sibling::tr[@id="blueColorStart"])=0]' },
        @{ colorGroup = 'blue'; XPath = '//*[@id="x11CenterCol"]/tbody/tr[not(count(preceding-sibling::tr[@id="blueColorStart"])=0)]' },
        @{ colorGroup = 'purple'; XPath = '//*[@id="x11RightCol"]/tbody/tr[count(preceding-sibling::tr[@id="whiteColorStart"])=0]' },
        @{ colorGroup = 'white'; XPath = '//*[@id="x11RightCol"]/tbody/tr[not(count(preceding-sibling::tr[@id="whiteColorStart"])=0) and count(preceding-sibling::tr[@id="grayColorStart"])=0]' },
        @{ colorGroup = 'gray'; XPath = '//*[@id="x11RightCol"]/tbody/tr[not(count(preceding-sibling::tr[@id="grayColorStart"])=0)]' }
    );
    $ColorGroupDefs | ForEach-Object {
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

    @($Script:ColorsXmlDocument.SelectNodes('/colors/color[count(cssName)=0 and not(count(cssAlias)=0)]')) | ForEach-Object {
        $XmlNodeList = $_.SelectNodes('cssAlias');
        $SourceElement = @($XmlNodeList)[$XmlNodeList.Count - 1];
        $XmlElement = $_.AppendChild($Script:ColorsXmlDocument.CreateElement('cssName'));
        $XmlElement.InnerText = $SourceElement.InnerText;
        $XmlElement.Attributes.Append($Script:ColorsXmlDocument.CreateAttribute('isHtmlColor')).Value = 'true';
        $_.RemoveChild($SourceElement) | Out-Null;
    }

    $AllColorInfo = @(@($Script:ColorsXmlDocument.SelectNodes('/colors/color')) | ForEach-Object {
        [float]$brightness = -1.0;
        [float]$hue = -1.0;
        [float]$saturation = -1.0;
        $a = $_.SelectSingleNode('@brightness');
        if ($a -ne $null) { $brightness = [System.Xml.XmlConvert]::ToSingle($a.Value) }
        $a = $_.SelectSingleNode('@hue');
        if ($a -ne $null) { $hue = [System.Xml.XmlConvert]::ToSingle($a.Value) }
        $a = $_.SelectSingleNode('@saturation');
        if ($a -ne $null) { $saturation = [System.Xml.XmlConvert]::ToSingle($a.Value) }
        if ($brightness -lt 0.0 -or $hue -lt 0.0 -or $saturation -lt 0.0) {
            $Color = [System.Drawing.Color]::FromArgb(255, [System.Int32]::Parse($_.SelectSingleNode('@r').Value),
                [System.Int32]::Parse($_.SelectSingleNode('@g').Value), [System.Int32]::Parse($_.SelectSingleNode('@b').Value));
            $brightness = $Color.GetBrightness();
            $saturation = $Color.GetSaturation();
            $hue = $Color.GetHue();
            $_.Attributes.Append($Script:ColorsXmlDocument.CreateAttribute('brightness')).Value = [System.Xml.XmlConvert]::ToString($brightness);
            $_.Attributes.Append($Script:ColorsXmlDocument.CreateAttribute('saturation')).Value = [System.Xml.XmlConvert]::ToString($saturation);
            $_.Attributes.Append($Script:ColorsXmlDocument.CreateAttribute('hue')).Value = [System.Xml.XmlConvert]::ToString($hue);
        }
        $Properties = @{
            Brightness = $brightness;
            Hue = $hue;
            Saturation = $saturation;
            SourceElement = $Script:ColorsXmlDocument.DocumentElement.RemoveChild($_);
        };
        $XmlNodeList = $_.SelectNodes('group');
        if ($XmlNodeList.Count -gt 0) { $Properties['Group'] = @($XmlNodeList)[$XmlNodeList.Count -1].InnerText }
        New-Object -TypeName 'System.Management.Automation.PSObject' -Property $Properties;
    });

    $GroupedColors = @($AllColorInfo | Where-Object { $_.Group -ne $null });
    foreach ($UngroupedItem in @($AllColorInfo | Where-Object { $_.Group -eq $null })) {
        $ShortestDistance = [float]::MaxValue;
        $ClosestItem = $GroupedColors[0];
        foreach ($GroupedItem in $GroupedColors) {
            $b = ($UnGroupedItem.Brightness - $GroupedItem.Brightness) * 18.0;
            $s = ($UnGroupedItem.Saturation - $GroupedItem.Saturation) * 18.0;
            $h = ($UnGroupedItem.Hue - $GroupedItem.Hue) / 10.0;
            if ($h -lt -180.0) {
                $h += 180.0;
            } else {
                if ($h -gt 180.0) { $h -= 180.0 }
            }
            $d = [System.Math]::Sqrt(($b * $b) + ($s * $s) + ($h * $h));
            if ($d -lt $ShortestDistance) {
                $ShortestDistance = $d;
                $ClosestItem = $GroupedItem;
                if ($d -eq 0.0) { break }
            }
        }
        $UngroupedItem.SourceElement.AppendChild($Script:ColorsXmlDocument.CreateElement('group')).InnerText = $ClosestItem.Group;
        $UngroupedItem | Add-Member -MemberType NoteProperty -Name 'Group' -Value $ClosestItem.Group;
    }

    $AllColorInfo = @(@($AllColorInfo | Sort-Object -Property 'Hue', 'Brightness', 'Saturation') | ForEach-Object {
        $XmlNodeList = $_.SourceElement.SelectNodes('windowsName');
        $_ | Add-Member -MemberType NoteProperty -Name 'TargetElement' -Value $Script:ColorsXmlDocument.DocumentElement.AppendChild($Script:ColorsXmlDocument.CreateElement('color'));
        for ($i = $XmlNodeList.Count - 1; $i -ge 0; $i--) {
            $Name = ConvertFrom-CamelCase -Name $XmlNodeList[$i].InnerText;
            if (($AllColorInfo | Where-Object { $_.Name -ne $null -and $_.Name -ieq $Name }) -eq $null) {
                $_.TargetElement.Attributes.Append($Script:ColorsXmlDocument.CreateAttribute('name')).Value = $Name;
                $_ | Add-Member -MemberType NoteProperty -Name 'Name' -Value $Name;
                break;
            }
        }
        $_ | Write-Output;
    });

    @($AllColorInfo | Where-Object { $_.Name -eq $null }) | ForEach-Object {
        $XmlNodeList = $_.SourceElement.SelectNodes('x11Code');
        for ($i = $XmlNodeList.Count - 1; $i -ge 0; $i--) {
            $Name = ConvertFrom-CamelCase -Name $XmlNodeList[$i].InnerText;
            if (($AllColorInfo | Where-Object { $_.Name -ne $null -and $_.Name -ieq $Name }) -eq $null) {
                $_.TargetElement.Attributes.Append($Script:ColorsXmlDocument.CreateAttribute('name')).Value = $Name;
                $_ | Add-Member -MemberType NoteProperty -Name 'Name' -Value $Name;
                break;
            }
        }
    }
    @($AllColorInfo | Where-Object { $_.Name -eq $null }) | ForEach-Object {
        $XmlNodeList = $_.SourceElement.SelectNodes('cssName');
        for ($i = $XmlNodeList.Count - 1; $i -ge 0; $i--) {
            $Name = ConvertFrom-CamelCase -Name $XmlNodeList[$i].InnerText;
            if (($AllColorInfo | Where-Object { $_.Name -ne $null -and $_.Name -ieq $Name }) -eq $null) {
                $_.TargetElement.Attributes.Append($Script:ColorsXmlDocument.CreateAttribute('name')).Value = $Name;
                $_ | Add-Member -MemberType NoteProperty -Name 'Name' -Value $Name;
                break;
            }
        }
    }
    @($AllColorInfo | Where-Object { $_.Name -eq $null }) | ForEach-Object {
        $XmlNodeList = $_.SourceElement.SelectNodes('cssAlias');
        for ($i = $XmlNodeList.Count - 1; $i -ge 0; $i--) {
            $Name = ConvertFrom-CamelCase -Name $XmlNodeList[$i].InnerText;
            if (($AllColorInfo | Where-Object { $_.Name -ne $null -and $_.Name -ieq $Name }) -eq $null) {
                $_.TargetElement.Attributes.Append($Script:ColorsXmlDocument.CreateAttribute('name')).Value = $Name;
                $_ | Add-Member -MemberType NoteProperty -Name 'Name' -Value $Name;
                break;
            }
        }
    }
    @($AllColorInfo | Where-Object { $_.Name -eq $null }) | ForEach-Object {
        $XmlNodeList = $_.SourceElement.SelectNodes('vgaName');
        for ($i = $XmlNodeList.Count - 1; $i -ge 0; $i--) {
            $Name = ConvertFrom-CamelCase -Name $XmlNodeList[$i].InnerText;
            if (($AllColorInfo | Where-Object { $_.Name -ne $null -and $_.Name -ieq $Name }) -eq $null) {
                $_.TargetElement.Attributes.Append($Script:ColorsXmlDocument.CreateAttribute('name')).Value = $Name;
                $_ | Add-Member -MemberType NoteProperty -Name 'Name' -Value $Name;
                break;
            }
        }
    }

    @($AllColorInfo | Where-Object { $_.Name -eq $null }) | ForEach-Object {
        $_.TargetElement.Attributes.Append($Script:ColorsXmlDocument.CreateAttribute('name')).Value = "#$([int]::Parse($_.SourceElement.SelectSingleNode('@r').Value).ToString('x2'))$([int]::Parse($_.SourceElement.SelectSingleNode('@g').Value).ToString('x2'))$([int]::Parse($_.SourceElement.SelectSingleNode('@b').Value).ToString('x2'))";
        $_ | Add-Member -MemberType NoteProperty -Name 'Name' -Value $Name;
    }

    $AllColorInfo | ForEach-Object {
        $TargetElement = $_.TargetElement;
        $SourceElement = $_.SourceElement;
        @('r', 'g', 'b', 'brightness', 'saturation', 'hue') | ForEach-Object {
            $TargetElement.Attributes.Append($Script:ColorsXmlDocument.CreateAttribute($_)).Value = $SourceElement.SelectSingleNode("@$_").Value;
        }
        ('group', 'cssName', 'cssNumber', 'windowsName', 'x11Code', 'vgaName') | ForEach-Object {
            $XmlNodeList = $SourceElement.SelectNodes($_);
            if ($XmlNodeList.Count -gt 0) {
                $XmlElement = @($XmlNodeList)[$XmlNodeList.Count - 1];
                $TargetElement.Attributes.Append($Script:ColorsXmlDocument.CreateAttribute($_)).Value = $XmlElement.InnerText;
                $SourceElement.RemoveChild($XmlElement) | Out-Null;
            }
        }
        ('group', 'cssName', 'cssNumber', 'windowsName', 'x11Code', 'vgaName') | ForEach-Object {
            $XmlNodeList = $SourceElement.SelectNodes($_);
            if ($XmlNodeList.Count -gt 0) {
                $XmlElement = @($XmlNodeList)[$XmlNodeList.Count - 1];
                if ($TargetElement.SelectSingleNode("@$_").Value -ine $XmlElement.InnerText) {
                    $TargetElement.Attributes.Append($Script:ColorsXmlDocument.CreateAttribute("alt$($_.Substring(0, 1).ToUpper())$($_.Substring(1))")).Value = $XmlElement.InnerText;
                }
                $SourceElement.RemoveChild($XmlElement) | Out-Null;
            }
        }
        $XmlNodeList = $SourceElement.SelectNodes('cssAlias');
        if ($XmlNodeList.Count -gt 0) {
            $XmlElement = @($XmlNodeList)[$XmlNodeList.Count - 1];
            if ($TargetElement.SelectSingleNode("@cssName").Value -ieq $XmlElement.InnerText) {
                $SourceElement.RemoveChild($XmlElement) | Out-Null;
            } else {
                $a = $TargetElement.SelectSingleNode("@altCssName");
                if ($a -eq $null) {
                    $TargetElement.Attributes.Append($Script:ColorsXmlDocument.CreateAttribute('altCssName')).Value = $XmlElement.InnerText;
                    $SourceElement.RemoveChild($XmlElement) | Out-Null;
                }
            }
        }
        @('isWindows', 'isX11', 'isHtmlColor', 'isWebSafeColor') | ForEach-Object {
            $a = $SourceElement.SelectSingleNode("@$_");
            if ($q -eq $null) {
                $TargetElement.Attributes.Append($Script:ColorsXmlDocument.CreateAttribute($_)).Value = 'false';
            } else {
                $TargetElement.Attributes.Append($Script:ColorsXmlDocument.CreateAttribute($_)).Value = $a.Value;
            }
        }
        $SourceElement.SelectNodes('*') | ForEach-Object {
            $TargetElement.AppendChild($_.CloneNode($true)) | Out-Null;
        }
    }

    $Script:OutputXmlDocument = [System.Xml.XmlDocument]::new();
    $Script:OutputXmlDocument.AppendChild($Script:OutputXmlDocument.CreateElement('colors')) | Out-Null;
    $groupNamesElement = $Script:OutputXmlDocument.DocumentElement.AppendChild($Script:OutputXmlDocument.CreateElement('groupNames'));
    $ColorGroupDefs | ForEach-Object { $groupNamesElement.AppendChild($Script:OutputXmlDocument.CreateElement('n')).InnerText = $_.colorGroup }

    $allAttributeNames = @('name', 'cssName', 'cssNumber', 'windowsName', 'x11Code');
    $primaryAttributeNames = @('name', 'vgaName', 'r', 'g', 'b', 'brightness', 'saturation', 'hue', 'group', 'cssNumber', 'isWindows', 'isX11', 'isHtmlColor', 'isWebSafeColor');
    foreach ($SourceElement in @($Script:ColorsXmlDocument.SelectNodes('/colors/color'))) {
        $XmlElement = $Script:OutputXmlDocument.DocumentElement.AppendChild($Script:OutputXmlDocument.CreateElement('color'));
        $XmlElement.Attributes.Append($Script:OutputXmlDocument.CreateAttribute('id')).Value = [int]::Parse($SourceElement.SelectSingleNode("@r").Value).ToString('x2') + [int]::Parse($SourceElement.SelectSingleNode("@g").Value).ToString('x2') + [int]::Parse($SourceElement.SelectSingleNode("@b").Value).ToString('x2');
        $primaryAttributeNames | ForEach-Object {
            $a = $SourceElement.SelectSingleNode("@$_");
            if ($a -ne $null -and ($_ -ne 'name' -or -not $a.Value.StartsWith('#'))) {
                $XmlElement.Attributes.Append($Script:OutputXmlDocument.CreateAttribute($_)).Value = $a.Value;
            }
        }
    }
    $allCssNames = @();
    $allWindowsNames = @();
    $allX11Codes = @();
    foreach ($SourceElement in @($Script:ColorsXmlDocument.SelectNodes('/colors/color'))) {
        $id = [int]::Parse($SourceElement.SelectSingleNode("@r").Value).ToString('x2') + [int]::Parse($SourceElement.SelectSingleNode("@g").Value).ToString('x2') + [int]::Parse($SourceElement.SelectSingleNode("@b").Value).ToString('x2');
        foreach ($a in $SourceElement.SelectNodes('@cssName|@altCssName')) {
            $allCssNames += @(New-Object -TypeName 'System.Management.Automation.PSObject' -Property @{ id = $id; value = $a.Value; lc = $a.Value.ToLower() });
        }
        foreach ($a in $SourceElement.SelectNodes('@windowsName|@altWindowsName')) {
            $allWindowsNames += @(New-Object -TypeName 'System.Management.Automation.PSObject' -Property @{ id = $id; value = $a.Value; lc = $a.Value.ToLower() });
        }
        foreach ($a in $SourceElement.SelectNodes('@x11Code|@altS11Code')) {
            $allX11Codes += @(New-Object -TypeName 'System.Management.Automation.PSObject' -Property @{ id = $id; value = $a.Value; lc = $a.Value.ToLower() });
        }
    }

    $cssNamesElement = $Script:OutputXmlDocument.DocumentElement.AppendChild($Script:OutputXmlDocument.CreateElement('cssNames'));
    ($allCssNames | Sort-Object -Property 'lc', 'value') | ForEach-Object {
        $XmlElement = $cssNamesElement.AppendChild($Script:OutputXmlDocument.CreateElement('n'));
        $XmlElement.Attributes.Append($Script:OutputXmlDocument.CreateAttribute('id')).Value = $_.id;
        $XmlElement.InnerText = $_.value;
    }
    $windowsNamesElement = $Script:OutputXmlDocument.DocumentElement.AppendChild($Script:OutputXmlDocument.CreateElement('windowsNames'));
    ($allWindowsNames | Sort-Object -Property 'lc', 'value') | ForEach-Object {
        $XmlElement = $windowsNamesElement.AppendChild($Script:OutputXmlDocument.CreateElement('n'));
        $XmlElement.Attributes.Append($Script:OutputXmlDocument.CreateAttribute('id')).Value = $_.id;
        $XmlElement.InnerText = $_.value;
    }
    $x11CodesElement = $Script:OutputXmlDocument.DocumentElement.AppendChild($Script:OutputXmlDocument.CreateElement('x11Codes'));
    ($allX11Codes | Sort-Object -Property 'lc', 'value') | ForEach-Object {
        $XmlElement = $x11CodesElement.AppendChild($Script:OutputXmlDocument.CreateElement('n'));
        $XmlElement.Attributes.Append($Script:OutputXmlDocument.CreateAttribute('id')).Value = $_.id;
        $XmlElement.InnerText = $_.value;
    }

    $Script:OutputXmlDocument.DocumentElement.AppendChild($Script:OutputXmlDocument.CreateElement('originalData')).AppendChild($Script:OutputXmlDocument.CreateCDataSection($originalDataText)) | Out-Null;

    $XmlWriterSettings = [System.Xml.XmlWriterSettings]::new();
    $XmlWriterSettings.Indent = $true;
    $XmlWriterSettings.OmitXmlDeclaration = $true;
    $XmlWriterSettings.Encoding = [System.Text.UTF8Encoding]::new($false);
    $XmlWriter = [System.Xml.XmlWriter]::Create($Path, $XmlWriterSettings);
    $Script:OutputXmlDocument.WriteTo($XmlWriter);
    $XmlWriter.Flush();
    $XmlWriter.Close();

    $Script:ColorsXmlDocument = $Script:OutputXmlDocument;
}

$cssNumberLines = @();
$attributeNames = @(@{ name = 'id'; isString = $true; isDecimal = $false }, @{ name = 'name'; isString = $true; isDecimal = $false },
    @{ name = 'vgaName'; isString = $true; isDecimal = $false }, @{ name = 'r'; isString = $false; isDecimal = $false },
    @{ name = 'g'; isString = $false; isDecimal = $false }, @{ name = 'b'; isString = $false; isDecimal = $false },
    @{ name = 'brightness'; isString = $false; isDecimal = $true }, @{ name = 'saturation'; isString = $false; isDecimal = $true },
    @{ name = 'hue'; isString = $false; isDecimal = $true }, @{ name = 'group'; isString = $true; isDecimal = $false }, 
    @{ name = 'isWindows'; isString = $false; isDecimal = $false }, @{ name = 'isX11'; isString = $false; isDecimal = $false },
    @{ name = 'isHtmlColor'; isString = $false; isDecimal = $false });
$TextWriter = [System.IO.StreamWriter]::new(($PSScriptRoot | Join-Path -ChildPath 'WebColors.json'), ([System.Text.UTF8Encoding]::new($false)));
$TextWriter.WriteLine("{");
$CurrentLine = "";
($Script:ColorsXmlDocument.SelectNodes('/colors/groupNames/n')) | ForEach-Object {
    if ($CurrentLine.Length -eq 0) {
        $CurrentLine = "    `"groupNames`": [ `"$($_.Value)`"";
    } else {
        $CurrentLine += ",";
        if (($CurrentLine.Length + $_.Value.Length + 3) -gt 120) {
            $TextWriter.WriteLine($CurrentLine);
            $CurrentLine = "        `"$($_.Value)`"";
        }
    }
}
$TextWriter.WriteLine("$CurrentLine ],");
$TextWriter.WriteLine('    "colors": [');
$NotFirstColor = $false;
$cssNumberValues = @();
$JSONLines = @($Script:ColorsXmlDocument.SelectNodes('/colors/color')) | ForEach-Object {
    $a = $_.SelectSingleNode('cssNumber');
    if ($a -ne $null) {
        $cssNumberValues = @(New-Object -TypeName 'System.Management.Automation.PSObject' -Property @{ n = [int]::Parse($a.Value); id = $_.SelectSingleNode('id').Value });
    }
    $XmlElement = $_;
    $CurrentLine = "";
    $attributeNames | ForEach-Object {
        $a = $XmlElement.SelectSingleNode("@$($_.name)");
        $Text = "`"$($_.name)`": ";
        if ($a -eq $null) {
            $Text + "null";
        } else {
            if ($_.isString) {
                $Text + "`"$($a.Value)`"";
            } else {
                if ($a.Value.Length -eq 0) {
                    $Text + "null";
                } else {
                    if ($_.isDecimal -and -not $a.Value.Contains('.')) {
                        $Text + "$($a.Value).0";
                    } else {
                        $Text + $a.Value;
                    }
                }
            }
        }
        if ($CurrentLine.Length -eq 0) {
            if ($NotFirstColor) {
                $TextWriter.WriteLine(",");
                $NotFirstColor = $true;
            }
            $CurrentLine = "        { $Text";
        } else {
            $CurrentLine += ",";
            if (($CurrentLine.Length + $Text.Length + 1) -gt 120) {
                $TextWriter.WriteLine($CurrentLine);
                $CurrentLine = "            $Text";
            }
        }
    }
    $TextWriter.Write("$CurrentLine }");
}
$TextWriter.WriteLine();
$TextWriter.WriteLine("    ],");
$CurrentLine = "";
($cssNumberValues | Sort-Object -Property 'n') | ForEach-Object {
    $Text = "{ `"number`": $($_.n), `"id`": `"$($_.id)`" }";
    if ($CurrentLine.Length -eq 0) {
        $CurrentLine = "    `"cssNumbers`": [ $Text";
    } else {
        $CurrentLine += ",";
        if (($CurrentLine.Length + $_.Value.Length + 2) -gt 120) {
            $TextWriter.WriteLine($CurrentLine);
            $CurrentLine = "        $Text";
        }
    }
}
$TextWriter.WriteLine("$CurrentLine ],");
$TextWriter.Flush();
$TextWriter.Close();