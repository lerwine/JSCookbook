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

Function Convert-HsbToRgb {
    [CmdletBinding()]
    Param(
      [Parameter(Mandatory = $true, Position = 0)]
      [ValidateRange(0.0, 360.0)]
      [float]$H,
      
      [Parameter(Mandatory = $true, Position = 1)]
      [ValidateRange(0.0, 1.0)]
      [float]$S,
      
      [Parameter(Mandatory = $true, Position = 2)]
      [ValidateRange(0.0, 1.0)]
      [Alias('v')]
      [float]$B
    )
   
    [float]$fMax = 0.0;
    [float]$fMin = 0.0;
    if ($B -lt 0.5) {
        [float]$fMax = $b + ($b * $s);
        [float]$fMin = $b - ($b * $s);
    } else {
        [float]$fMax = $b - ($b * $s) + $s;
        [float]$fMin = $b + ($b * $s) - $s;
    }

    [int]$iSextant = [Math]::Floor($h / ([float](60)));
    if ($H -ge 300.0) {
        [float]$H -= 360.0;
    }
    [float]$H /= 60.0;
    [float]$H -= 2.0 * [Math]::Floor((($iSextant + 1.0) % 6.0) / 2.0);
    [float]$fMid = 0.0;
    if (($iSextant % 2) -eq 0) {
        [float]$fMid = $H * ($fMax - $fMin) + $fMin;
    } else {
        [float]$fMid = $fMin - $H * ($fMax - $fMin);
    }
      
    $iMax = [Convert]::ToInt32($fMax * 255);
    $iMid = [Convert]::ToInt32($fMid * 255);
    $iMin = [Convert]::ToInt32($fMin * 255);

    switch ($iSextant) {
        1 { return @($iMid, $iMax, $iMin) }
        2 { return @($iMin, $iMax, $iMid) }
        3 { return @($iMin, $iMid, $iMax) }
        4 { return @($iMid, $iMin, $iMax) }
        5 { return @($iMax, $iMin, $iMid) }
    }
  
    return @($iMax, $iMid, $iMin);
    }

$SourceHtml = @'
<!DOCTYPE html []>
<html>
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>Web-Safe HTML colors</title>
    <meta name="description" content="Lifted from https://en.wikipedia.org/wiki/Web_colors on 2/9/2018" />
  </head>
  <body>
    <table id="htmlColors" style="padding:2px;">
      <caption>CSS 1–2.0, HTML 3.2–4, and VGA color names</caption>
      <thead>
        <tr>
          <th style="border-left:solid 4em #CCC;border-right:solid 2px #AAA;" tabindex="0" role="columnheader button" title="Sort ascending">Name</th>
          <th style="border-left:solid 2px #AAA;border-right:solid 1px #AAA;" title="Sort ascending" tabindex="0" role="columnheader button">
            <br />
            <small>(RGB)</small>
          </th>
          <th style="border-left:solid 1px #AAA;border-right:solid 0px #AAA;width:3em;" tabindex="0" role="columnheader button" title="Sort ascending">
            <br />
            <small>(RGB)</small>
          </th>
          <th style="border-left:solid 0px #AAA;border-right:solid 0px #AAA;width:3em;" tabindex="0" role="columnheader button" title="Sort ascending">
            <br />
            <small>(RGB)</small>
          </th>
          <th style="border-left:solid 0px #AAA;border-right:solid 2px #AAA;width:3em;" tabindex="0" role="columnheader button" title="Sort ascending">
            <br />
            <small>(RGB)</small>
          </th>
          <th style="border-left:solid 2px #AAA;border-right:solid 1px #AAA;width:3em;" tabindex="0" role="columnheader button" title="Sort ascending">
            <br />
            <small>(HSL/HSV)</small>
          </th>
          <th style="border-left:solid 1px #AAA;border-right:solid 0px #AAA;width:3em;" title="Sort ascending" tabindex="0" role="columnheader button">
            <br />
            <small>(HSL)</small>
          </th>
          <th style="border-left:solid 0px #AAA;border-right:solid 1px #AAA;width:3em;" title="Sort ascending" tabindex="0" role="columnheader button">
            <br />
            <small>(HSL)</small>
          </th>
          <th style="border-left:solid 1px #AAA;border-right:solid 0px #AAA;width:3em;" title="Sort ascending" tabindex="0" role="columnheader button">
            <br />
            <small>(HSV)</small>
          </th>
          <th style="border-left:solid 0px #AAA;border-right:solid 2px #AAA;width:3em;" title="Sort ascending" tabindex="0" role="columnheader button">
            <br />
            <small>(HSV)</small>
          </th>
          <th style="border-left:solid 2px #AAA;" title="Sort ascending" tabindex="0" role="columnheader button">; alias</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th style="border-left:solid 4em rgb(255,255,255); text-align:left; font-weight:normal;"></th>
          <td style="border-left:solid 2px #AAA;border-right:solid 1px #AAA;font-family:monospace;">#FFFFFF</td>
          <td style="border-left:solid 1px #AAA;border-right:solid 0px #AAA;text-align:right;padding-right: 21px;" title="255/255">100%</td>
          <td style="border-left:solid 0px #AAA;border-right:solid 0px #AAA;text-align:right;padding-right: 21px;" title="255/255">100%</td>
          <td style="border-left:solid 0px #AAA;border-right:solid 2px #AAA;text-align:right;padding-right: 21px;" title="255/255">100%</td>
          <td style="border-left:solid 2px #AAA;border-right:solid 1px #AAA;text-align:right;padding-right: 21px;" title="−360°">
            <span style="display:none">5000000000000000000♠</span>0°</td>
          <td style="border-left:solid 1px #AAA;border-right:solid 0px #AAA;text-align:right;padding-right: 21px;">0%</td>
          <td style="border-left:solid 0px #AAA;border-right:solid 1px #AAA;text-align:right;padding-right: 21px;">100%</td>
          <td style="border-left:solid 1px #AAA;border-right:solid 0px #AAA;text-align:right;padding-right: 21px;">0%</td>
          <td style="border-left:solid 0px #AAA;border-right:solid 2px #AAA;text-align:right;padding-right: 21px;">100%</td>
          <td style="border-left:solid 2px #AAA;">15 (white)</td>
        </tr>
        <tr>
          <th style="border-left:solid 4em rgb(192,192,192); text-align:left; font-weight:normal;"></th>
          <td style="border-left:solid 2px #AAA;border-right:solid 1px #AAA;font-family:monospace;">#C0C0C0</td>
          <td style="border-left:solid 1px #AAA;border-right:solid 0px #AAA;text-align:right;padding-right: 21px;" title="192/255">75%</td>
          <td style="border-left:solid 0px #AAA;border-right:solid 0px #AAA;text-align:right;padding-right: 21px;" title="192/255">75%</td>
          <td style="border-left:solid 0px #AAA;border-right:solid 2px #AAA;text-align:right;padding-right: 21px;" title="192/255">75%</td>
          <td style="border-left:solid 2px #AAA;border-right:solid 1px #AAA;text-align:right;padding-right: 21px;" title="−360°">
            <span style="display:none">5000000000000000000♠</span>0°</td>
          <td style="border-left:solid 1px #AAA;border-right:solid 0px #AAA;text-align:right;padding-right: 21px;">0%</td>
          <td style="border-left:solid 0px #AAA;border-right:solid 1px #AAA;text-align:right;padding-right: 21px;">75%</td>
          <td style="border-left:solid 1px #AAA;border-right:solid 0px #AAA;text-align:right;padding-right: 21px;">0%</td>
          <td style="border-left:solid 0px #AAA;border-right:solid 2px #AAA;text-align:right;padding-right: 21px;">75%</td>
          <td style="border-left:solid 2px #AAA;">07 (light gray)</td>
        </tr>
        <tr>
          <th style="border-left:solid 4em rgb(128,128,128); text-align:left; font-weight:normal;"></th>
          <td style="border-left:solid 2px #AAA;border-right:solid 1px #AAA;font-family:monospace;">#808080</td>
          <td style="border-left:solid 1px #AAA;border-right:solid 0px #AAA;text-align:right;padding-right: 21px;" title="128/255">50%</td>
          <td style="border-left:solid 0px #AAA;border-right:solid 0px #AAA;text-align:right;padding-right: 21px;" title="128/255">50%</td>
          <td style="border-left:solid 0px #AAA;border-right:solid 2px #AAA;text-align:right;padding-right: 21px;" title="128/255">50%</td>
          <td style="border-left:solid 2px #AAA;border-right:solid 1px #AAA;text-align:right;padding-right: 21px;" title="−360°">
            <span style="display:none">5000000000000000000♠</span>0°</td>
          <td style="border-left:solid 1px #AAA;border-right:solid 0px #AAA;text-align:right;padding-right: 21px;">0%</td>
          <td style="border-left:solid 0px #AAA;border-right:solid 1px #AAA;text-align:right;padding-right: 21px;">50%</td>
          <td style="border-left:solid 1px #AAA;border-right:solid 0px #AAA;text-align:right;padding-right: 21px;">0%</td>
          <td style="border-left:solid 0px #AAA;border-right:solid 2px #AAA;text-align:right;padding-right: 21px;">50%</td>
          <td style="border-left:solid 2px #AAA;">08 (dark gray)</td>
        </tr>
        <tr>
          <th style="border-left:solid 4em rgb(0,0,0); text-align:left; font-weight:normal;"></th>
          <td style="border-left:solid 2px #AAA;border-right:solid 1px #AAA;font-family:monospace;">#000000</td>
          <td style="border-left:solid 1px #AAA;border-right:solid 0px #AAA;text-align:right;padding-right: 21px;" title="0/255">0%</td>
          <td style="border-left:solid 0px #AAA;border-right:solid 0px #AAA;text-align:right;padding-right: 21px;" title="0/255">0%</td>
          <td style="border-left:solid 0px #AAA;border-right:solid 2px #AAA;text-align:right;padding-right: 21px;" title="0/255">0%</td>
          <td style="border-left:solid 2px #AAA;border-right:solid 1px #AAA;text-align:right;padding-right: 21px;" title="−360°">
            <span style="display:none">5000000000000000000♠</span>0°</td>
          <td style="border-left:solid 1px #AAA;border-right:solid 0px #AAA;text-align:right;padding-right: 21px;">0%</td>
          <td style="border-left:solid 0px #AAA;border-right:solid 1px #AAA;text-align:right;padding-right: 21px;">0%</td>
          <td style="border-left:solid 1px #AAA;border-right:solid 0px #AAA;text-align:right;padding-right: 21px;">0%</td>
          <td style="border-left:solid 0px #AAA;border-right:solid 2px #AAA;text-align:right;padding-right: 21px;">0%</td>
          <td style="border-left:solid 2px #AAA;">00 (black)</td>
        </tr>
        <tr>
          <th style="border-left:solid 4em rgb(255,0,0); text-align:left; font-weight:normal;"></th>
          <td style="border-left:solid 2px #AAA;border-right:solid 1px #AAA;font-family:monospace;">#FF0000</td>
          <td style="border-left:solid 1px #AAA;border-right:solid 0px #AAA;text-align:right;padding-right: 21px;" title="255/255">100%</td>
          <td style="border-left:solid 0px #AAA;border-right:solid 0px #AAA;text-align:right;padding-right: 21px;" title="0/255">0%</td>
          <td style="border-left:solid 0px #AAA;border-right:solid 2px #AAA;text-align:right;padding-right: 21px;" title="0/255">0%</td>
          <td style="border-left:solid 2px #AAA;border-right:solid 1px #AAA;text-align:right;padding-right: 21px;" title="−360°">
            <span style="display:none">5000000000000000000♠</span>0°</td>
          <td style="border-left:solid 1px #AAA;border-right:solid 0px #AAA;text-align:right;padding-right: 21px;">100%</td>
          <td style="border-left:solid 0px #AAA;border-right:solid 1px #AAA;text-align:right;padding-right: 21px;">50%</td>
          <td style="border-left:solid 1px #AAA;border-right:solid 0px #AAA;text-align:right;padding-right: 21px;">100%</td>
          <td style="border-left:solid 0px #AAA;border-right:solid 2px #AAA;text-align:right;padding-right: 21px;">100%</td>
          <td style="border-left:solid 2px #AAA;">12 (high red)</td>
        </tr>
        <tr>
          <th style="border-left:solid 4em rgb(128,0,0); text-align:left; font-weight:normal;"></th>
          <td style="border-left:solid 2px #AAA;border-right:solid 1px #AAA;font-family:monospace;">#800000</td>
          <td style="border-left:solid 1px #AAA;border-right:solid 0px #AAA;text-align:right;padding-right: 21px;" title="128/255">50%</td>
          <td style="border-left:solid 0px #AAA;border-right:solid 0px #AAA;text-align:right;padding-right: 21px;" title="0/255">0%</td>
          <td style="border-left:solid 0px #AAA;border-right:solid 2px #AAA;text-align:right;padding-right: 21px;" title="0/255">0%</td>
          <td style="border-left:solid 2px #AAA;border-right:solid 1px #AAA;text-align:right;padding-right: 21px;" title="−360°">
            <span style="display:none">5000000000000000000♠</span>0°</td>
          <td style="border-left:solid 1px #AAA;border-right:solid 0px #AAA;text-align:right;padding-right: 21px;">100%</td>
          <td style="border-left:solid 0px #AAA;border-right:solid 1px #AAA;text-align:right;padding-right: 21px;">25%</td>
          <td style="border-left:solid 1px #AAA;border-right:solid 0px #AAA;text-align:right;padding-right: 21px;">100%</td>
          <td style="border-left:solid 0px #AAA;border-right:solid 2px #AAA;text-align:right;padding-right: 21px;">50%</td>
          <td style="border-left:solid 2px #AAA;">04 (low red)</td>
        </tr>
        <tr>
          <th style="border-left:solid 4em rgb(255,255,0); text-align:left; font-weight:normal;"></th>
          <td style="border-left:solid 2px #AAA;border-right:solid 1px #AAA;font-family:monospace;">#FFFF00</td>
          <td style="border-left:solid 1px #AAA;border-right:solid 0px #AAA;text-align:right;padding-right: 21px;" title="255/255">100%</td>
          <td style="border-left:solid 0px #AAA;border-right:solid 0px #AAA;text-align:right;padding-right: 21px;" title="255/255">100%</td>
          <td style="border-left:solid 0px #AAA;border-right:solid 2px #AAA;text-align:right;padding-right: 21px;" title="0/255">0%</td>
          <td style="border-left:solid 2px #AAA;border-right:solid 1px #AAA;text-align:right;padding-right: 21px;" title="−300°">
            <span style="display:none">7001600000000000000♠</span>60°</td>
          <td style="border-left:solid 1px #AAA;border-right:solid 0px #AAA;text-align:right;padding-right: 21px;">100%</td>
          <td style="border-left:solid 0px #AAA;border-right:solid 1px #AAA;text-align:right;padding-right: 21px;">50%</td>
          <td style="border-left:solid 1px #AAA;border-right:solid 0px #AAA;text-align:right;padding-right: 21px;">100%</td>
          <td style="border-left:solid 0px #AAA;border-right:solid 2px #AAA;text-align:right;padding-right: 21px;">100%</td>
          <td style="border-left:solid 2px #AAA;">14 (yellow)</td>
        </tr>
        <tr>
          <th style="border-left:solid 4em rgb(128,128,0); text-align:left; font-weight:normal;"></th>
          <td style="border-left:solid 2px #AAA;border-right:solid 1px #AAA;font-family:monospace;">#808000</td>
          <td style="border-left:solid 1px #AAA;border-right:solid 0px #AAA;text-align:right;padding-right: 21px;" title="128/255">50%</td>
          <td style="border-left:solid 0px #AAA;border-right:solid 0px #AAA;text-align:right;padding-right: 21px;" title="128/255">50%</td>
          <td style="border-left:solid 0px #AAA;border-right:solid 2px #AAA;text-align:right;padding-right: 21px;" title="0/255">0%</td>
          <td style="border-left:solid 2px #AAA;border-right:solid 1px #AAA;text-align:right;padding-right: 21px;" title="−300°">
            <span style="display:none">7001600000000000000♠</span>60°</td>
          <td style="border-left:solid 1px #AAA;border-right:solid 0px #AAA;text-align:right;padding-right: 21px;">100%</td>
          <td style="border-left:solid 0px #AAA;border-right:solid 1px #AAA;text-align:right;padding-right: 21px;">25%</td>
          <td style="border-left:solid 1px #AAA;border-right:solid 0px #AAA;text-align:right;padding-right: 21px;">100%</td>
          <td style="border-left:solid 0px #AAA;border-right:solid 2px #AAA;text-align:right;padding-right: 21px;">50%</td>
          <td style="border-left:solid 2px #AAA;">06 (brown)</td>
        </tr>
        <tr>
          <th style="border-left:solid 4em rgb(0,255,0); text-align:left; font-weight:normal;"></th>
          <td style="border-left:solid 2px #AAA;border-right:solid 1px #AAA;font-family:monospace;">#00FF00</td>
          <td style="border-left:solid 1px #AAA;border-right:solid 0px #AAA;text-align:right;padding-right: 21px;" title="0/255">0%</td>
          <td style="border-left:solid 0px #AAA;border-right:solid 0px #AAA;text-align:right;padding-right: 21px;" title="255/255">100%</td>
          <td style="border-left:solid 0px #AAA;border-right:solid 2px #AAA;text-align:right;padding-right: 21px;" title="0/255">0%</td>
          <td style="border-left:solid 2px #AAA;border-right:solid 1px #AAA;text-align:right;padding-right: 21px;" title="−240°">
            <span style="display:none">7002120000000000000♠</span>120°</td>
          <td style="border-left:solid 1px #AAA;border-right:solid 0px #AAA;text-align:right;padding-right: 21px;">100%</td>
          <td style="border-left:solid 0px #AAA;border-right:solid 1px #AAA;text-align:right;padding-right: 21px;">50%</td>
          <td style="border-left:solid 1px #AAA;border-right:solid 0px #AAA;text-align:right;padding-right: 21px;">100%</td>
          <td style="border-left:solid 0px #AAA;border-right:solid 2px #AAA;text-align:right;padding-right: 21px;">100%</td>
          <td style="border-left:solid 2px #AAA;">10 (high green); green</td>
        </tr>
        <tr>
          <th style="border-left:solid 4em rgb(0,128,0); text-align:left; font-weight:normal;"></th>
          <td style="border-left:solid 2px #AAA;border-right:solid 1px #AAA;font-family:monospace;">#008000</td>
          <td style="border-left:solid 1px #AAA;border-right:solid 0px #AAA;text-align:right;padding-right: 21px;" title="0/255">0%</td>
          <td style="border-left:solid 0px #AAA;border-right:solid 0px #AAA;text-align:right;padding-right: 21px;" title="128/255">50%</td>
          <td style="border-left:solid 0px #AAA;border-right:solid 2px #AAA;text-align:right;padding-right: 21px;" title="0/255">0%</td>
          <td style="border-left:solid 2px #AAA;border-right:solid 1px #AAA;text-align:right;padding-right: 21px;" title="−240°">
            <span style="display:none">7002120000000000000♠</span>120°</td>
          <td style="border-left:solid 1px #AAA;border-right:solid 0px #AAA;text-align:right;padding-right: 21px;">100%</td>
          <td style="border-left:solid 0px #AAA;border-right:solid 1px #AAA;text-align:right;padding-right: 21px;">25%</td>
          <td style="border-left:solid 1px #AAA;border-right:solid 0px #AAA;text-align:right;padding-right: 21px;">100%</td>
          <td style="border-left:solid 0px #AAA;border-right:solid 2px #AAA;text-align:right;padding-right: 21px;">50%</td>
          <td style="border-left:solid 2px #AAA;">02 (low green)</td>
        </tr>
        <tr>
          <th style="border-left:solid 4em rgb(0,255,255); text-align:left; font-weight:normal;"></th>
          <td style="border-left:solid 2px #AAA;border-right:solid 1px #AAA;font-family:monospace;">#00FFFF</td>
          <td style="border-left:solid 1px #AAA;border-right:solid 0px #AAA;text-align:right;padding-right: 21px;" title="0/255">0%</td>
          <td style="border-left:solid 0px #AAA;border-right:solid 0px #AAA;text-align:right;padding-right: 21px;" title="255/255">100%</td>
          <td style="border-left:solid 0px #AAA;border-right:solid 2px #AAA;text-align:right;padding-right: 21px;" title="255/255">100%</td>
          <td style="border-left:solid 2px #AAA;border-right:solid 1px #AAA;text-align:right;padding-right: 21px;" title="−180°">
            <span style="display:none">7002180000000000000♠</span>180°</td>
          <td style="border-left:solid 1px #AAA;border-right:solid 0px #AAA;text-align:right;padding-right: 21px;">100%</td>
          <td style="border-left:solid 0px #AAA;border-right:solid 1px #AAA;text-align:right;padding-right: 21px;">50%</td>
          <td style="border-left:solid 1px #AAA;border-right:solid 0px #AAA;text-align:right;padding-right: 21px;">100%</td>
          <td style="border-left:solid 0px #AAA;border-right:solid 2px #AAA;text-align:right;padding-right: 21px;">100%</td>
          <td style="border-left:solid 2px #AAA;">11 (high cyan); cyan</td>
        </tr>
        <tr>
          <th style="border-left:solid 4em rgb(0,128,128); text-align:left; font-weight:normal;"></th>
          <td style="border-left:solid 2px #AAA;border-right:solid 1px #AAA;font-family:monospace;">#008080</td>
          <td style="border-left:solid 1px #AAA;border-right:solid 0px #AAA;text-align:right;padding-right: 21px;" title="0/255">0%</td>
          <td style="border-left:solid 0px #AAA;border-right:solid 0px #AAA;text-align:right;padding-right: 21px;" title="128/255">50%</td>
          <td style="border-left:solid 0px #AAA;border-right:solid 2px #AAA;text-align:right;padding-right: 21px;" title="128/255">50%</td>
          <td style="border-left:solid 2px #AAA;border-right:solid 1px #AAA;text-align:right;padding-right: 21px;" title="−180°">
            <span style="display:none">7002180000000000000♠</span>180°</td>
          <td style="border-left:solid 1px #AAA;border-right:solid 0px #AAA;text-align:right;padding-right: 21px;">100%</td>
          <td style="border-left:solid 0px #AAA;border-right:solid 1px #AAA;text-align:right;padding-right: 21px;">25%</td>
          <td style="border-left:solid 1px #AAA;border-right:solid 0px #AAA;text-align:right;padding-right: 21px;">100%</td>
          <td style="border-left:solid 0px #AAA;border-right:solid 2px #AAA;text-align:right;padding-right: 21px;">50%</td>
          <td style="border-left:solid 2px #AAA;">03 (low cyan)</td>
        </tr>
        <tr>
          <th style="border-left:solid 4em rgb(0,0,255); text-align:left; font-weight:normal;"></th>
          <td style="border-left:solid 2px #AAA;border-right:solid 1px #AAA;font-family:monospace;">#0000FF</td>
          <td style="border-left:solid 1px #AAA;border-right:solid 0px #AAA;text-align:right;padding-right: 21px;" title="0/255">0%</td>
          <td style="border-left:solid 0px #AAA;border-right:solid 0px #AAA;text-align:right;padding-right: 21px;" title="0/255">0%</td>
          <td style="border-left:solid 0px #AAA;border-right:solid 2px #AAA;text-align:right;padding-right: 21px;" title="255/255">100%</td>
          <td style="border-left:solid 2px #AAA;border-right:solid 1px #AAA;text-align:right;padding-right: 21px;" title="−120°">
            <span style="display:none">7002240000000000000♠</span>240°</td>
          <td style="border-left:solid 1px #AAA;border-right:solid 0px #AAA;text-align:right;padding-right: 21px;">100%</td>
          <td style="border-left:solid 0px #AAA;border-right:solid 1px #AAA;text-align:right;padding-right: 21px;">50%</td>
          <td style="border-left:solid 1px #AAA;border-right:solid 0px #AAA;text-align:right;padding-right: 21px;">100%</td>
          <td style="border-left:solid 0px #AAA;border-right:solid 2px #AAA;text-align:right;padding-right: 21px;">100%</td>
          <td style="border-left:solid 2px #AAA;">09 (high blue)</td>
        </tr>
        <tr>
          <th style="border-left:solid 4em rgb(0,0,128); text-align:left; font-weight:normal;"></th>
          <td style="border-left:solid 2px #AAA;border-right:solid 1px #AAA;font-family:monospace;">#000080</td>
          <td style="border-left:solid 1px #AAA;border-right:solid 0px #AAA;text-align:right;padding-right: 21px;" title="0/255">0%</td>
          <td style="border-left:solid 0px #AAA;border-right:solid 0px #AAA;text-align:right;padding-right: 21px;" title="0/255">0%</td>
          <td style="border-left:solid 0px #AAA;border-right:solid 2px #AAA;text-align:right;padding-right: 21px;" title="128/255">50%</td>
          <td style="border-left:solid 2px #AAA;border-right:solid 1px #AAA;text-align:right;padding-right: 21px;" title="−120°">
            <span style="display:none">7002240000000000000♠</span>240°</td>
          <td style="border-left:solid 1px #AAA;border-right:solid 0px #AAA;text-align:right;padding-right: 21px;">100%</td>
          <td style="border-left:solid 0px #AAA;border-right:solid 1px #AAA;text-align:right;padding-right: 21px;">25%</td>
          <td style="border-left:solid 1px #AAA;border-right:solid 0px #AAA;text-align:right;padding-right: 21px;">100%</td>
          <td style="border-left:solid 0px #AAA;border-right:solid 2px #AAA;text-align:right;padding-right: 21px;">50%</td>
          <td style="border-left:solid 2px #AAA;">01 (low blue)</td>
        </tr>
        <tr>
          <th style="border-left:solid 4em rgb(255,0,255); text-align:left; font-weight:normal;"></th>
          <td style="border-left:solid 2px #AAA;border-right:solid 1px #AAA;font-family:monospace;">#FF00FF</td>
          <td style="border-left:solid 1px #AAA;border-right:solid 0px #AAA;text-align:right;padding-right: 21px;" title="255/255">100%</td>
          <td style="border-left:solid 0px #AAA;border-right:solid 0px #AAA;text-align:right;padding-right: 21px;" title="0/255">0%</td>
          <td style="border-left:solid 0px #AAA;border-right:solid 2px #AAA;text-align:right;padding-right: 21px;" title="255/255">100%</td>
          <td style="border-left:solid 2px #AAA;border-right:solid 1px #AAA;text-align:right;padding-right: 21px;" title="−60°">
            <span style="display:none">7002300000000000000♠</span>300°</td>
          <td style="border-left:solid 1px #AAA;border-right:solid 0px #AAA;text-align:right;padding-right: 21px;">100%</td>
          <td style="border-left:solid 0px #AAA;border-right:solid 1px #AAA;text-align:right;padding-right: 21px;">50%</td>
          <td style="border-left:solid 1px #AAA;border-right:solid 0px #AAA;text-align:right;padding-right: 21px;">100%</td>
          <td style="border-left:solid 0px #AAA;border-right:solid 2px #AAA;text-align:right;padding-right: 21px;">100%</td>
          <td style="border-left:solid 2px #AAA;">13 (high magenta); magenta</td>
        </tr>
        <tr>
          <th style="border-left:solid 4em rgb(128,0,128); text-align:left; font-weight:normal;"></th>
          <td style="border-left:solid 2px #AAA;border-right:solid 1px #AAA;font-family:monospace;">#800080</td>
          <td style="border-left:solid 1px #AAA;border-right:solid 0px #AAA;text-align:right;padding-right: 21px;" title="128/255">50%</td>
          <td style="border-left:solid 0px #AAA;border-right:solid 0px #AAA;text-align:right;padding-right: 21px;" title="0/255">0%</td>
          <td style="border-left:solid 0px #AAA;border-right:solid 2px #AAA;text-align:right;padding-right: 21px;" title="128/255">50%</td>
          <td style="border-left:solid 2px #AAA;border-right:solid 1px #AAA;text-align:right;padding-right: 21px;" title="−60°">
            <span style="display:none">7002300000000000000♠</span>300°</td>
          <td style="border-left:solid 1px #AAA;border-right:solid 0px #AAA;text-align:right;padding-right: 21px;">100%</td>
          <td style="border-left:solid 0px #AAA;border-right:solid 1px #AAA;text-align:right;padding-right: 21px;">25%</td>
          <td style="border-left:solid 1px #AAA;border-right:solid 0px #AAA;text-align:right;padding-right: 21px;">100%</td>
          <td style="border-left:solid 0px #AAA;border-right:solid 2px #AAA;text-align:right;padding-right: 21px;">50%</td>
          <td style="border-left:solid 2px #AAA;">05 (low magenta)</td>
        </tr>
      </tbody>
      <tfoot></tfoot>
    </table>
    <table id="x11Colors" style="font-size:90%" cellpadding="4">
      <tbody>
        <tr style="vertical-align:top;">
          <td>
            <table border="0" id="x11LeftCol">
              <tbody>
                <tr>
                  <th style="background:lightgrey" rowspan="2"> name</th>
                  <th style="background:lightgrey" colspan="2">
                    <code>R   G   B</code>
                  </th>
                </tr>
                <tr>
                  <th style="background:lightgrey">
                    <code>Hex</code>
                  </th>
                  <th style="background:lightgrey">
                    <code>Decimal</code>
                  </th>
                </tr>
                <tr id="pinkColorStart">
                  <td colspan="3" style="background:whitesmoke;text-align:left;">
                    <span style="font-size: 120%;">
                      <b>Pink colors</b>
                    </span>
                  </td>
                </tr>
                <tr style="background:pink;color:black">
                  <td>
                    <code>Pink</code>
                  </td>
                  <td>
                    <code>FF C0 CB</code>
                  </td>
                  <td>
                    <code>255 192 203</code>
                  </td>
                </tr>
                <tr style="background:lightpink;color:black">
                  <td>
                    <code>LightPink</code>
                  </td>
                  <td>
                    <code>FF B6 C1</code>
                  </td>
                  <td>
                    <code>255 182 193</code>
                  </td>
                </tr>
                <tr style="background:hotpink;color:white">
                  <td>
                    <code>HotPink</code>
                  </td>
                  <td>
                    <code>FF 69 B4</code>
                  </td>
                  <td>
                    <code>255 105 180</code>
                  </td>
                </tr>
                <tr style="background:deeppink;color:white">
                  <td>
                    <code>DeepPink</code>
                  </td>
                  <td>
                    <code>FF 14 93</code>
                  </td>
                  <td>
                    <code>255  20 147</code>
                  </td>
                </tr>
                <tr style="background:palevioletred;color:white">
                  <td>
                    <code>PaleVioletRed</code>
                  </td>
                  <td>
                    <code>DB 70 93</code>
                  </td>
                  <td>
                    <code>219 112 147</code>
                  </td>
                </tr>
                <tr style="background:mediumvioletred;color:white">
                  <td>
                    <code>MediumVioletRed</code>
                  </td>
                  <td>
                    <code>C7 15 85</code>
                  </td>
                  <td>
                    <code>199  21 133</code>
                  </td>
                </tr>
                <tr id="redColorStart">
                  <td colspan="3" style="background:whitesmoke;text-align:left;">
                    <span style="font-size: 120%;">
                      <b>Red colors</b>
                    </span>
                  </td>
                </tr>
                <tr style="background:lightsalmon;color:black">
                  <td>
                    <code>LightSalmon</code>
                  </td>
                  <td>
                    <code>FF A0 7A</code>
                  </td>
                  <td>
                    <code>255 160 122</code>
                  </td>
                </tr>
                <tr style="background:salmon;color:black">
                  <td>
                    <code>Salmon</code>
                  </td>
                  <td>
                    <code>FA 80 72</code>
                  </td>
                  <td>
                    <code>250 128 114</code>
                  </td>
                </tr>
                <tr style="background:darksalmon;color:black">
                  <td>
                    <code>DarkSalmon</code>
                  </td>
                  <td>
                    <code>E9 96 7A</code>
                  </td>
                  <td>
                    <code>233 150 122</code>
                  </td>
                </tr>
                <tr style="background:lightcoral;color:black">
                  <td>
                    <code>LightCoral</code>
                  </td>
                  <td>
                    <code>F0 80 80</code>
                  </td>
                  <td>
                    <code>240 128 128</code>
                  </td>
                </tr>
                <tr style="background:indianred;color:white">
                  <td>
                    <code>IndianRed</code>
                  </td>
                  <td>
                    <code>CD 5C 5C</code>
                  </td>
                  <td>
                    <code>205  92  92</code>
                  </td>
                </tr>
                <tr style="background:crimson;color:white;color:white">
                  <td>
                    <code>Crimson</code>
                  </td>
                  <td>
                    <code>DC 14 3C</code>
                  </td>
                  <td>
                    <code>220  20  60</code>
                  </td>
                </tr>
                <tr style="background:fireBrick;color:white">
                  <td>
                    <code>FireBrick</code>
                  </td>
                  <td>
                    <code>B2 22 22</code>
                  </td>
                  <td>
                    <code>178  34  34</code>
                  </td>
                </tr>
                <tr style="background:darkred;color:white">
                  <td>
                    <code>DarkRed</code>
                  </td>
                  <td>
                    <code>8B 00 00</code>
                  </td>
                  <td>
                    <code>139   0   0</code>
                  </td>
                </tr>
                <tr style="background:red;color:white">
                  <td>
                    <code>Red</code>
                  </td>
                  <td>
                    <code>FF 00 00</code>
                  </td>
                  <td>
                    <code>255   0   0</code>
                  </td>
                </tr>
                <tr id="orangeColorStart">
                  <td colspan="3" style="background:whitesmoke;text-align:left;">
                    <span style="font-size: 120%;">
                      <b>Orange colors</b>
                    </span>
                  </td>
                </tr>
                <tr style="background:orangered;color:white">
                  <td>
                    <code>OrangeRed</code>
                  </td>
                  <td>
                    <code>FF 45 00</code>
                  </td>
                  <td>
                    <code>255  69   0</code>
                  </td>
                </tr>
                <tr style="background:tomato;color:white">
                  <td>
                    <code>Tomato</code>
                  </td>
                  <td>
                    <code>FF 63 47</code>
                  </td>
                  <td>
                    <code>255  99  71</code>
                  </td>
                </tr>
                <tr style="background:coral;color:black">
                  <td>
                    <code>Coral</code>
                  </td>
                  <td>
                    <code>FF 7F 50</code>
                  </td>
                  <td>
                    <code>255 127  80</code>
                  </td>
                </tr>
                <tr style="background:darkorange;color:black">
                  <td>
                    <code>DarkOrange</code>
                  </td>
                  <td>
                    <code>FF 8C 00</code>
                  </td>
                  <td>
                    <code>255 140   0</code>
                  </td>
                </tr>
                <tr style="background:orange;color:black">
                  <td>
                    <code>Orange</code>
                  </td>
                  <td>
                    <code>FF A5 00</code>
                  </td>
                  <td>
                    <code>255 165   0</code>
                  </td>
                </tr>
                <tr id="yellowColorStart">
                  <td colspan="3" style="background:whitesmoke;text-align:left;">
                    <span style="font-size: 120%;">
                      <b>Yellow colors</b>
                    </span>
                  </td>
                </tr>
                <tr style="background:yellow;color:black">
                  <td>
                    <code>Yellow</code>
                  </td>
                  <td>
                    <code>FF FF 00</code>
                  </td>
                  <td>
                    <code>255 255   0</code>
                  </td>
                </tr>
                <tr style="background:lightyellow;color:black">
                  <td>
                    <code>LightYellow</code>
                  </td>
                  <td>
                    <code>FF FF E0</code>
                  </td>
                  <td>
                    <code>255 255 224</code>
                  </td>
                </tr>
                <tr style="background:lemonchiffon;color:black">
                  <td>
                    <code>LemonChiffon</code>
                  </td>
                  <td>
                    <code>FF FA CD</code>
                  </td>
                  <td>
                    <code>255 250 205</code>
                  </td>
                </tr>
                <tr style="background:lightgoldenrodyellow;color:black">
                  <td>
                    <code>LightGoldenrodYellow</code> </td>
                  <td>
                    <code>FA FA D2</code>
                  </td>
                  <td>
                    <code>250 250 210</code>
                  </td>
                </tr>
                <tr style="background:papayawhip;color:black">
                  <td>
                    <code>PapayaWhip</code>
                  </td>
                  <td>
                    <code>FF EF D5</code>
                  </td>
                  <td>
                    <code>255 239 213</code>
                  </td>
                </tr>
                <tr style="background:moccasin;color:black">
                  <td>
                    <code>Moccasin</code>
                  </td>
                  <td>
                    <code>FF E4 B5</code>
                  </td>
                  <td>
                    <code>255 228 181</code>
                  </td>
                </tr>
                <tr style="background:peachpuff;color:black">
                  <td>
                    <code>PeachPuff</code>
                  </td>
                  <td>
                    <code>FF DA B9</code>
                  </td>
                  <td>
                    <code>255 218 185</code>
                  </td>
                </tr>
                <tr style="background:palegoldenrod;color:black">
                  <td>
                    <code>PaleGoldenrod</code>
                  </td>
                  <td>
                    <code>EE E8 AA</code>
                  </td>
                  <td>
                    <code>238 232 170</code>
                  </td>
                </tr>
                <tr style="background:khaki;color:black">
                  <td>
                    <code>Khaki</code>
                  </td>
                  <td>
                    <code>F0 E6 8C</code>
                  </td>
                  <td>
                    <code>240 230 140</code>
                  </td>
                </tr>
                <tr style="background:darkkhaki;color:black">
                  <td>
                    <code>DarkKhaki</code>
                  </td>
                  <td>
                    <code>BD B7 6B</code>
                  </td>
                  <td>
                    <code>189 183 107</code>
                  </td>
                </tr>
                <tr style="background:gold;color:black">
                  <td>
                    <code>Gold</code>
                  </td>
                  <td>
                    <code>FF D7 00</code>
                  </td>
                  <td>
                    <code>255 215   0</code>
                  </td>
                </tr>
                <tr id="brownColorStart">
                  <td colspan="3" style="background:whitesmoke;text-align:left;">
                    <span style="font-size: 120%;">
                      <b>Brown colors</b>
                    </span>
                  </td>
                </tr>
                <tr style="background:cornsilk;color:black">
                  <td>
                    <code>Cornsilk</code>
                  </td>
                  <td>
                    <code>FF F8 DC</code>
                  </td>
                  <td>
                    <code>255 248 220</code>
                  </td>
                </tr>
                <tr style="background:blanchedalmond;color:black">
                  <td>
                    <code>BlanchedAlmond</code>
                  </td>
                  <td>
                    <code>FF EB CD</code>
                  </td>
                  <td>
                    <code>255 235 205</code>
                  </td>
                </tr>
                <tr style="background:bisque;color:black">
                  <td>
                    <code>Bisque</code>
                  </td>
                  <td>
                    <code>FF E4 C4</code>
                  </td>
                  <td>
                    <code>255 228 196</code>
                  </td>
                </tr>
                <tr style="background:navajowhite;color:black">
                  <td>
                    <code>NavajoWhite</code>
                  </td>
                  <td>
                    <code>FF DE AD</code>
                  </td>
                  <td>
                    <code>255 222 173</code>
                  </td>
                </tr>
                <tr style="background:wheat;color:black">
                  <td>
                    <code>Wheat</code>
                  </td>
                  <td>
                    <code>F5 DE B3</code>
                  </td>
                  <td>
                    <code>245 222 179</code>
                  </td>
                </tr>
                <tr style="background:burlywood;color:black">
                  <td>
                    <code>BurlyWood</code>
                  </td>
                  <td>
                    <code>DE B8 87</code>
                  </td>
                  <td>
                    <code>222 184 135</code>
                  </td>
                </tr>
                <tr style="background:tan;color:black">
                  <td>
                    <code>Tan</code>
                  </td>
                  <td>
                    <code>D2 B4 8C</code>
                  </td>
                  <td>
                    <code>210 180 140</code>
                  </td>
                </tr>
                <tr style="background:rosybrown;color:black">
                  <td>
                    <code>RosyBrown</code>
                  </td>
                  <td>
                    <code>BC 8F 8F</code>
                  </td>
                  <td>
                    <code>188 143 143</code>
                  </td>
                </tr>
                <tr style="background:sandybrown;color:black">
                  <td>
                    <code>SandyBrown</code>
                  </td>
                  <td>
                    <code>F4 A4 60</code>
                  </td>
                  <td>
                    <code>244 164  96</code>
                  </td>
                </tr>
                <tr style="background:goldenrod;color:black">
                  <td>
                    <code>Goldenrod</code>
                  </td>
                  <td>
                    <code>DA A5 20</code>
                  </td>
                  <td>
                    <code>218 165  32</code>
                  </td>
                </tr>
                <tr style="background:darkgoldenrod;color:black">
                  <td>
                    <code>DarkGoldenrod</code>
                  </td>
                  <td>
                    <code>B8 86 0B</code>
                  </td>
                  <td>
                    <code>184 134  11</code>
                  </td>
                </tr>
                <tr style="background:Peru;color:black">
                  <td>
                    <code>Peru</code>
                  </td>
                  <td>
                    <code>CD 85 3F</code>
                  </td>
                  <td>
                    <code>205 133  63</code>
                  </td>
                </tr>
                <tr style="background:chocolate;color:white">
                  <td>
                    <code>Chocolate</code>
                  </td>
                  <td>
                    <code>D2 69 1E</code>
                  </td>
                  <td>
                    <code>210 105  30</code>
                  </td>
                </tr>
                <tr style="background:saddlebrown;color:white">
                  <td>
                    <code>SaddleBrown</code>
                  </td>
                  <td>
                    <code>8B 45 13</code>
                  </td>
                  <td>
                    <code>139  69  19</code>
                  </td>
                </tr>
                <tr style="background:sienna;color:white">
                  <td>
                    <code>Sienna</code>
                  </td>
                  <td>
                    <code>A0 52 2D</code>
                  </td>
                  <td>
                    <code>160  82  45</code>
                  </td>
                </tr>
                <tr style="background:brown;color:white">
                  <td>
                    <code>Brown</code>
                  </td>
                  <td>
                    <code>A5 2A 2A</code>
                  </td>
                  <td>
                    <code>165  42  42</code>
                  </td>
                </tr>
                <tr style="background:maroon;color:white">
                  <td>
                    <code>Maroon</code>
                  </td>
                  <td>
                    <code>80 00 00</code>
                  </td>
                  <td>
                    <code>128   0   0</code>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
          <td>
            <table id="x11CenterCol">
              <tbody>
                <tr>
                  <th style="background:lightgrey" rowspan="2"> name</th>
                  <th style="background:lightgrey" colspan="2">
                    <code>R   G   B</code>
                  </th>
                </tr>
                <tr>
                  <th style="background:lightgrey">
                    <code>Hex</code>
                  </th>
                  <th style="background:lightgrey">
                    <code>Decimal</code>
                  </th>
                </tr>
                <tr id="greenColorStart">
                  <td colspan="3" style="background:whitesmoke;text-align:left;">
                    <span style="font-size: 120%;">
                      <b>Green colors</b>
                    </span>
                  </td>
                </tr>
                <tr style="background:darkolivegreen;color:white">
                  <td>
                    <code>DarkOliveGreen</code>
                  </td>
                  <td>
                    <code>55 6B 2F</code>
                  </td>
                  <td>
                    <code> 85 107  47</code>
                  </td>
                </tr>
                <tr style="background:olive;color:white">
                  <td>
                    <code>Olive</code>
                  </td>
                  <td>
                    <code>80 80 00</code>
                  </td>
                  <td>
                    <code>128 128   0</code>
                  </td>
                </tr>
                <tr style="background:olivedrab;color:white">
                  <td>
                    <code>OliveDrab</code>
                  </td>
                  <td>
                    <code>6B 8E 23</code>
                  </td>
                  <td>
                    <code>107 142  35</code>
                  </td>
                </tr>
                <tr style="background:yellowgreen;color:black">
                  <td>
                    <code>YellowGreen</code>
                  </td>
                  <td>
                    <code>9A CD 32</code>
                  </td>
                  <td>
                    <code>154 205  50</code>
                  </td>
                </tr>
                <tr style="background:limegreen;color:black">
                  <td>
                    <code>LimeGreen</code>
                  </td>
                  <td>
                    <code>32 CD 32</code>
                  </td>
                  <td>
                    <code> 50 205  50</code>
                  </td>
                </tr>
                <tr style="background:lime;color:black">
                  <td>
                    <code>Lime</code>
                  </td>
                  <td>
                    <code>00 FF 00</code>
                  </td>
                  <td>
                    <code>  0 255   0</code>
                  </td>
                </tr>
                <tr style="background:lawngreen;color:black">
                  <td>
                    <code>LawnGreen</code>
                  </td>
                  <td>
                    <code>7C FC 00</code>
                  </td>
                  <td>
                    <code>124 252   0</code>
                  </td>
                </tr>
                <tr style="background:chartreuse;color:black">
                  <td>
                    <code>Chartreuse</code>
                  </td>
                  <td>
                    <code>7F FF 00</code>
                  </td>
                  <td>
                    <code>127 255   0</code>
                  </td>
                </tr>
                <tr style="background:greenyellow;color:black">
                  <td>
                    <code>GreenYellow</code>
                  </td>
                  <td>
                    <code>AD FF 2F</code>
                  </td>
                  <td>
                    <code>173 255  47</code>
                  </td>
                </tr>
                <tr style="background:springgreen;color:black">
                  <td>
                    <code>SpringGreen</code>
                  </td>
                  <td>
                    <code>00 FF 7F</code>
                  </td>
                  <td>
                    <code>  0 255 127</code>
                  </td>
                </tr>
                <tr style="background:mediumspringgreen;color:black">
                  <td>
                    <code>MediumSpringGreen</code> </td>
                  <td>
                    <code>00 FA 9A</code>
                  </td>
                  <td>
                    <code>  0 250 154</code>
                  </td>
                </tr>
                <tr style="background:lightgreen;color:black">
                  <td>
                    <code>LightGreen</code>
                  </td>
                  <td>
                    <code>90 EE 90</code>
                  </td>
                  <td>
                    <code>144 238 144</code>
                  </td>
                </tr>
                <tr style="background:palegreen;color:black">
                  <td>
                    <code>PaleGreen</code>
                  </td>
                  <td>
                    <code>98 FB 98</code>
                  </td>
                  <td>
                    <code>152 251 152</code>
                  </td>
                </tr>
                <tr style="background:darkseagreen;color:black">
                  <td>
                    <code>DarkSeaGreen</code>
                  </td>
                  <td>
                    <code>8F BC 8F</code>
                  </td>
                  <td>
                    <code>143 188 143</code>
                  </td>
                </tr>
                <tr style="background:mediumaquamarine;color:black">
                  <td>
                    <code>MediumAquamarine</code>
                  </td>
                  <td>
                    <code>66 CD AA</code>
                  </td>
                  <td>
                    <code>102 205 170</code>
                  </td>
                </tr>
                <tr style="background:mediumseagreen;color:black">
                  <td>
                    <code>MediumSeaGreen</code>
                  </td>
                  <td>
                    <code>3C B3 71</code>
                  </td>
                  <td>
                    <code> 60 179 113</code>
                  </td>
                </tr>
                <tr style="background:seagreen;color:white">
                  <td>
                    <code>SeaGreen</code>
                  </td>
                  <td>
                    <code>2E 8B 57</code>
                  </td>
                  <td>
                    <code> 46 139  87</code>
                  </td>
                </tr>
                <tr style="background:forestgreen;color:white">
                  <td>
                    <code>ForestGreen</code>
                  </td>
                  <td>
                    <code>22 8B 22</code>
                  </td>
                  <td>
                    <code> 34 139  34</code>
                  </td>
                </tr>
                <tr style="background:green;color:white">
                  <td>
                    <code>Green</code>
                  </td>
                  <td>
                    <code>00 80 00</code>
                  </td>
                  <td>
                    <code>  0 128   0</code>
                  </td>
                </tr>
                <tr style="background:darkgreen;color:white">
                  <td>
                    <code>DarkGreen</code>
                  </td>
                  <td>
                    <code>00 64 00</code>
                  </td>
                  <td>
                    <code>  0 100   0</code>
                  </td>
                </tr>
                <tr id="cyanColorStart">
                  <td colspan="3" style="background:whitesmoke;text-align:left;">
                    <span style="font-size: 120%;">
                      <b>Cyan colors</b>
                    </span>
                  </td>
                </tr>
                <tr style="background:aqua;color:black">
                  <td>
                    <code>Aqua</code>
                  </td>
                  <td>
                    <code>00 FF FF</code>
                  </td>
                  <td>
                    <code>  0 255 255</code>
                  </td>
                </tr>
                <tr style="background:cyan;color:black">
                  <td>
                    <code>Cyan</code>
                  </td>
                  <td>
                    <code>00 FF FF</code>
                  </td>
                  <td>
                    <code>  0 255 255</code>
                  </td>
                </tr>
                <tr style="background:lightcyan;color:black">
                  <td>
                    <code>LightCyan</code>
                  </td>
                  <td>
                    <code>E0 FF FF</code>
                  </td>
                  <td>
                    <code>224 255 255</code>
                  </td>
                </tr>
                <tr style="background:paleturquoise;color:black">
                  <td>
                    <code>PaleTurquoise</code>
                  </td>
                  <td>
                    <code>AF EE EE</code>
                  </td>
                  <td>
                    <code>175 238 238</code>
                  </td>
                </tr>
                <tr style="background:aquamarine;color:black">
                  <td>
                    <code>Aquamarine</code>
                  </td>
                  <td>
                    <code>7F FF D4</code>
                  </td>
                  <td>
                    <code>127 255 212</code>
                  </td>
                </tr>
                <tr style="background:turquoise;color:black">
                  <td>
                    <code>Turquoise</code>
                  </td>
                  <td>
                    <code>40 E0 D0</code>
                  </td>
                  <td>
                    <code> 64 224 208</code>
                  </td>
                </tr>
                <tr style="background:mediumturquoise;color:black">
                  <td>
                    <code>MediumTurquoise</code>
                  </td>
                  <td>
                    <code>48 D1 CC</code>
                  </td>
                  <td>
                    <code> 72 209 204</code>
                  </td>
                </tr>
                <tr style="background:darkturquoise;color:black">
                  <td>
                    <code>DarkTurquoise</code>
                  </td>
                  <td>
                    <code>00 CE D1</code>
                  </td>
                  <td>
                    <code>  0 206 209</code>
                  </td>
                </tr>
                <tr style="background:lightseagreen;color:black">
                  <td>
                    <code>LightSeaGreen</code>
                  </td>
                  <td>
                    <code>20 B2 AA</code>
                  </td>
                  <td>
                    <code> 32 178 170</code>
                  </td>
                </tr>
                <tr style="background:cadetblue;color:white">
                  <td>
                    <code>CadetBlue</code>
                  </td>
                  <td>
                    <code>5F 9E A0</code>
                  </td>
                  <td>
                    <code> 95 158 160</code>
                  </td>
                </tr>
                <tr style="background:darkcyan;color:white">
                  <td>
                    <code>DarkCyan</code>
                  </td>
                  <td>
                    <code>00 8B 8B</code>
                  </td>
                  <td>
                    <code>  0 139 139</code>
                  </td>
                </tr>
                <tr style="background:teal;color:white">
                  <td>
                    <code>Teal</code>
                  </td>
                  <td>
                    <code>00 80 80</code>
                  </td>
                  <td>
                    <code>  0 128 128</code>
                  </td>
                </tr>
                <tr id="blueColorStart">
                  <td colspan="3" style="background:whitesmoke;text-align:left;">
                    <span style="font-size: 120%;">
                      <b>Blue colors</b>
                    </span>
                  </td>
                </tr>
                <tr style="background:lightsteelblue;color:black">
                  <td>
                    <code>LightSteelBlue</code>
                  </td>
                  <td>
                    <code>B0 C4 DE</code>
                  </td>
                  <td>
                    <code>176 196 222</code>
                  </td>
                </tr>
                <tr style="background:powderblue;color:black">
                  <td>
                    <code>PowderBlue</code>
                  </td>
                  <td>
                    <code>B0 E0 E6</code>
                  </td>
                  <td>
                    <code>176 224 230</code>
                  </td>
                </tr>
                <tr style="background:lightblue;color:black">
                  <td>
                    <code>LightBlue</code>
                  </td>
                  <td>
                    <code>AD D8 E6</code>
                  </td>
                  <td>
                    <code>173 216 230</code>
                  </td>
                </tr>
                <tr style="background:skyblue;color:black">
                  <td>
                    <code>SkyBlue</code>
                  </td>
                  <td>
                    <code>87 CE EB</code>
                  </td>
                  <td>
                    <code>135 206 235</code>
                  </td>
                </tr>
                <tr style="background:lightskyblue;color:black">
                  <td>
                    <code>LightSkyBlue</code>
                  </td>
                  <td>
                    <code>87 CE FA</code>
                  </td>
                  <td>
                    <code>135 206 250</code>
                  </td>
                </tr>
                <tr style="background:deepskyblue;color:black">
                  <td>
                    <code>DeepSkyBlue</code>
                  </td>
                  <td>
                    <code>00 BF FF</code>
                  </td>
                  <td>
                    <code>  0 191 255</code>
                  </td>
                </tr>
                <tr style="background:dodgerblue;color:black">
                  <td>
                    <code>DodgerBlue</code>
                  </td>
                  <td>
                    <code>1E 90 FF</code>
                  </td>
                  <td>
                    <code> 30 144 255</code>
                  </td>
                </tr>
                <tr style="background:cornflowerblue;color:black">
                  <td>
                    <code>CornflowerBlue</code>
                  </td>
                  <td>
                    <code>64 95 ED</code>
                  </td>
                  <td>
                    <code>100 149 237</code>
                  </td>
                </tr>
                <tr style="background:steelblue;color:white">
                  <td>
                    <code>SteelBlue</code>
                  </td>
                  <td>
                    <code>46 82 B4</code>
                  </td>
                  <td>
                    <code> 70 130 180</code>
                  </td>
                </tr>
                <tr style="background:royalblue;color:white">
                  <td>
                    <code>RoyalBlue</code>
                  </td>
                  <td>
                    <code>41 69 E1</code>
                  </td>
                  <td>
                    <code> 65 105 225</code>
                  </td>
                </tr>
                <tr style="background:blue;color:white">
                  <td>
                    <code>Blue</code>
                  </td>
                  <td>
                    <code>00 00 FF</code>
                  </td>
                  <td>
                    <code>  0   0 255</code>
                  </td>
                </tr>
                <tr style="background:mediumblue;color:white">
                  <td>
                    <code>MediumBlue</code>
                  </td>
                  <td>
                    <code>00 00 CD</code>
                  </td>
                  <td>
                    <code>  0   0 205</code>
                  </td>
                </tr>
                <tr style="background:darkblue;color:white">
                  <td>
                    <code>DarkBlue</code>
                  </td>
                  <td>
                    <code>00 00 8B</code>
                  </td>
                  <td>
                    <code>  0   0 139</code>
                  </td>
                </tr>
                <tr style="background:navy;color:white">
                  <td>
                    <code>Navy</code>
                  </td>
                  <td>
                    <code>00 00 80</code>
                  </td>
                  <td>
                    <code>  0   0 128</code>
                  </td>
                </tr>
                <tr style="background:midnightblue;color:white">
                  <td>
                    <code>MidnightBlue</code>
                  </td>
                  <td>
                    <code>19 19 70</code>
                  </td>
                  <td>
                    <code> 25  25 112</code>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
          <td>
            <table id="x11RightCol">
              <tbody>
                <tr>
                  <th style="background:lightgrey" rowspan="2"> name</th>
                  <th style="background:lightgrey" colspan="2">
                    <code>R   G   B</code>
                  </th>
                </tr>
                <tr>
                  <th style="background:lightgrey">
                    <code>Hex</code>
                  </th>
                  <th style="background:lightgrey">
                    <code>Decimal</code>
                  </th>
                </tr>
                <tr id="purpleColorStart">
                  <td colspan="3" style="background:whitesmoke;text-align:left;">
                    <span style="font-size: 120%;">
                      <b>Purple, violet, and magenta colors</b>
                    </span>
                  </td>
                </tr>
                <tr style="background:lavender;color:black">
                  <td>
                    <code>Lavender</code>
                  </td>
                  <td>
                    <code>E6 E6 FA</code>
                  </td>
                  <td>
                    <code>230 230 250</code>
                  </td>
                </tr>
                <tr style="background:thistle;color:black">
                  <td>
                    <code>Thistle</code>
                  </td>
                  <td>
                    <code>D8 BF D8</code>
                  </td>
                  <td>
                    <code>216 191 216</code>
                  </td>
                </tr>
                <tr style="background:plum;color:black">
                  <td>
                    <code>Plum</code>
                  </td>
                  <td>
                    <code>DD A0 DD</code>
                  </td>
                  <td>
                    <code>221 160 221</code>
                  </td>
                </tr>
                <tr style="background:violet;color:black">
                  <td>
                    <code>Violet</code>
                  </td>
                  <td>
                    <code>EE 82 EE</code>
                  </td>
                  <td>
                    <code>238 130 238</code>
                  </td>
                </tr>
                <tr style="background:orchid;color:black">
                  <td>
                    <code>Orchid</code>
                  </td>
                  <td>
                    <code>DA 70 D6</code>
                  </td>
                  <td>
                    <code>218 112 214</code>
                  </td>
                </tr>
                <tr style="background:fuchsia;color:black">
                  <td>
                    <code>Fuchsia</code>
                  </td>
                  <td>
                    <code>FF 00 FF</code>
                  </td>
                  <td>
                    <code>255   0 255</code>
                  </td>
                </tr>
                <tr style="background:Magenta;color:black">
                  <td>
                    <code>Magenta</code>
                  </td>
                  <td>
                    <code>FF 00 FF</code>
                  </td>
                  <td>
                    <code>255   0 255</code>
                  </td>
                </tr>
                <tr style="background:mediumorchid;color:white">
                  <td>
                    <code>MediumOrchid</code>
                  </td>
                  <td>
                    <code>BA 55 D3</code>
                  </td>
                  <td>
                    <code>186  85 211</code>
                  </td>
                </tr>
                <tr style="background:mediumpurple;color:white">
                  <td>
                    <code>MediumPurple</code>
                  </td>
                  <td>
                    <code>93 70 DB</code>
                  </td>
                  <td>
                    <code>147 112 219</code>
                  </td>
                </tr>
                <tr style="background:blueviolet;color:white">
                  <td>
                    <code>BlueViolet</code>
                  </td>
                  <td>
                    <code>8A 2B E2</code>
                  </td>
                  <td>
                    <code>138  43 226</code>
                  </td>
                </tr>
                <tr style="background:darkviolet;color:white">
                  <td>
                    <code>DarkViolet</code>
                  </td>
                  <td>
                    <code>94 00 D3</code>
                  </td>
                  <td>
                    <code>148   0 211</code>
                  </td>
                </tr>
                <tr style="background:darkorchid;color:white">
                  <td>
                    <code>DarkOrchid</code>
                  </td>
                  <td>
                    <code>99 32 CC</code>
                  </td>
                  <td>
                    <code>153  50 204</code>
                  </td>
                </tr>
                <tr style="background:darkmagenta;color:white">
                  <td>
                    <code>DarkMagenta</code>
                  </td>
                  <td>
                    <code>8B 00 8B</code>
                  </td>
                  <td>
                    <code>139   0 139</code>
                  </td>
                </tr>
                <tr style="background:purple;color:white">
                  <td>
                    <code>Purple</code>
                  </td>
                  <td>
                    <code>80 00 80</code>
                  </td>
                  <td>
                    <code>128   0 128</code>
                  </td>
                </tr>
                <tr style="background:indigo;color:white">
                  <td>
                    <code>Indigo</code>
                  </td>
                  <td>
                    <code>4B 00 82</code>
                  </td>
                  <td>
                    <code> 75   0 130</code>
                  </td>
                </tr>
                <tr style="background:darkslateblue;color:white">
                  <td>
                    <code>DarkSlateBlue</code>
                  </td>
                  <td>
                    <code>48 3D 8B</code>
                  </td>
                  <td>
                    <code> 72  61 139</code>
                  </td>
                </tr>
                <tr style="background:slateblue;color:white">
                  <td>
                    <code>SlateBlue</code>
                  </td>
                  <td>
                    <code>6A 5A CD</code>
                  </td>
                  <td>
                    <code>106  90 205</code>
                  </td>
                </tr>
                <tr style="background:mediumslateblue;color:white">
                  <td>
                    <code>MediumSlateBlue</code> </td>
                  <td>
                    <code>7B 68 EE</code>
                  </td>
                  <td>
                    <code>123 104 238</code>
                  </td>
                </tr>
                <tr id="whiteColorStart">
                  <td colspan="3" style="background:whitesmoke;text-align:left;">
                    <span style="font-size: 120%;">
                      <b>White colors</b>
                    </span>
                  </td>
                </tr>
                <tr style="background:white;color:black">
                  <td>
                    <code>White</code>
                  </td>
                  <td>
                    <code>FF FF FF</code>
                  </td>
                  <td>
                    <code>255 255 255</code>
                  </td>
                </tr>
                <tr style="background:snow;color:black">
                  <td>
                    <code>Snow</code>
                  </td>
                  <td>
                    <code>FF FA FA</code>
                  </td>
                  <td>
                    <code>255 250 250</code>
                  </td>
                </tr>
                <tr style="background:honeydew;color:black">
                  <td>
                    <code>Honeydew</code>
                  </td>
                  <td>
                    <code>F0 FF F0</code>
                  </td>
                  <td>
                    <code>240 255 240</code>
                  </td>
                </tr>
                <tr style="background:mintcream;color:black">
                  <td>
                    <code>MintCream</code>
                  </td>
                  <td>
                    <code>F5 FF FA</code>
                  </td>
                  <td>
                    <code>245 255 250</code>
                  </td>
                </tr>
                <tr style="background:azure;color:black">
                  <td>
                    <code>Azure</code>
                  </td>
                  <td>
                    <code>F0 FF FF</code>
                  </td>
                  <td>
                    <code>240 255 255</code>
                  </td>
                </tr>
                <tr style="background:aliceblue;color:black">
                  <td>
                    <code>AliceBlue</code>
                  </td>
                  <td>
                    <code>F0 F8 FF</code>
                  </td>
                  <td>
                    <code>240 248 255</code>
                  </td>
                </tr>
                <tr style="background:ghostwhite;color:black">
                  <td>
                    <code>GhostWhite</code>
                  </td>
                  <td>
                    <code>F8 F8 FF</code>
                  </td>
                  <td>
                    <code>248 248 255</code>
                  </td>
                </tr>
                <tr style="background:whitesmoke;color:black">
                  <td>
                    <code>WhiteSmoke</code>
                  </td>
                  <td>
                    <code>F5 F5 F5</code>
                  </td>
                  <td>
                    <code>245 245 245</code>
                  </td>
                </tr>
                <tr style="background:seashell;color:black">
                  <td>
                    <code>Seashell</code>
                  </td>
                  <td>
                    <code>FF F5 EE</code>
                  </td>
                  <td>
                    <code>255 245 238</code>
                  </td>
                </tr>
                <tr style="background:beige;color:black">
                  <td>
                    <code>Beige</code>
                  </td>
                  <td>
                    <code>F5 F5 DC</code>
                  </td>
                  <td>
                    <code>245 245 220</code>
                  </td>
                </tr>
                <tr style="background:oldlace;color:black">
                  <td>
                    <code>OldLace</code>
                  </td>
                  <td>
                    <code>FD F5 E6</code>
                  </td>
                  <td>
                    <code>253 245 230</code>
                  </td>
                </tr>
                <tr style="background:floralwhite;color:black">
                  <td>
                    <code>FloralWhite</code>
                  </td>
                  <td>
                    <code>FF FA F0</code>
                  </td>
                  <td>
                    <code>255 250 240</code>
                  </td>
                </tr>
                <tr style="background:ivory;color:black">
                  <td>
                    <code>Ivory</code>
                  </td>
                  <td>
                    <code>FF FF F0</code>
                  </td>
                  <td>
                    <code>255 255 240</code>
                  </td>
                </tr>
                <tr style="background:antiquewhite;color:black">
                  <td>
                    <code>AntiqueWhite</code>
                  </td>
                  <td>
                    <code>FA EB D7</code>
                  </td>
                  <td>
                    <code>250 235 215</code>
                  </td>
                </tr>
                <tr style="background:linen;color:black">
                  <td>
                    <code>Linen</code>
                  </td>
                  <td>
                    <code>FA F0 E6</code>
                  </td>
                  <td>
                    <code>250 240 230</code>
                  </td>
                </tr>
                <tr style="background:lavenderblush;color:black">
                  <td>
                    <code>LavenderBlush</code>
                  </td>
                  <td>
                    <code>FF F0 F5</code>
                  </td>
                  <td>
                    <code>255 240 245</code>
                  </td>
                </tr>
                <tr style="background:mistyrose;color:black">
                  <td>
                    <code>MistyRose</code>
                  </td>
                  <td>
                    <code>FF E4 E1</code>
                  </td>
                  <td>
                    <code>255 228 225</code>
                  </td>
                </tr>
                <tr id="grayColorStart">
                  <td colspan="3" style="background:whitesmoke;text-align:left;">
                    <span style="font-size: 120%;">
                      <b>Gray and black colors</b>
                    </span>
                  </td>
                </tr>
                <tr style="background:gainsboro;color:black">
                  <td>
                    <code>Gainsboro</code>
                  </td>
                  <td>
                    <code>DC DC DC</code>
                  </td>
                  <td>
                    <code>220 220 220</code>
                  </td>
                </tr>
                <tr style="background:lightgray; color:black;">
                  <td>
                    <code>LightGray</code>
                  </td>
                  <td>
                    <code>D3 D3 D3</code>
                  </td>
                  <td>
                    <code>211 211 211</code>
                  </td>
                </tr>
                <tr style="background:silver;color:black">
                  <td>
                    <code>Silver</code>
                  </td>
                  <td>
                    <code>C0 C0 C0</code>
                  </td>
                  <td>
                    <code>192 192 192</code>
                  </td>
                </tr>
                <tr style="background:darkgray; color:black;">
                  <td>
                    <code>DarkGray</code>
                  </td>
                  <td>
                    <code>A9 A9 A9</code>
                  </td>
                  <td>
                    <code>169 169 169</code>
                  </td>
                </tr>
                <tr style="background:gray;color:white">
                  <td>
                    <code>Gray</code>
                  </td>
                  <td>
                    <code>80 80 80</code>
                  </td>
                  <td>
                    <code>128 128 128</code>
                  </td>
                </tr>
                <tr style="background:dimgray; color:white;">
                  <td>
                    <code>DimGray</code>
                  </td>
                  <td>
                    <code>69 69 69</code>
                  </td>
                  <td>
                    <code>105 105 105</code>
                  </td>
                </tr>
                <tr style="background:lightslategray; color:white;">
                  <td>
                    <code>LightSlateGray</code>
                  </td>
                  <td>
                    <code>77 88 99</code>
                  </td>
                  <td>
                    <code>119 136 153</code>
                  </td>
                </tr>
                <tr style="background:slategray; color:white;">
                  <td>
                    <code>SlateGray</code>
                  </td>
                  <td>
                    <code>70 80 90</code>
                  </td>
                  <td>
                    <code>112 128 144</code>
                  </td>
                </tr>
                <tr style="background:darkslategray; color:white;">
                  <td>
                    <code>DarkSlateGray</code>
                  </td>
                  <td>
                    <code>2F 4F 4F</code>
                  </td>
                  <td>
                    <code> 47  79  79</code>
                  </td>
                </tr>
                <tr style="background:black;color:white">
                  <td>
                    <code>Black</code>
                  </td>
                  <td>
                    <code>00 00 00</code>
                  </td>
                  <td>
                    <code>  0   0   0</code>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
    <table id="webSafeColors" style="width:90%; color:white; width:80%; text-align:center; margin:0 auto;">
      <caption style="color: black;">Web-safe colors</caption>
      <tbody>
        <tr>
          <td style="width:16%; background: #000;">*000*</td>
          <td style="width:16%; background: #300;">300</td>
          <td style="width:16%; background: #600;">600</td>
          <td style="width:16%; background: #900;">900</td>
          <td style="width:16%; background: #C00;">C00</td>
          <td style="width:16%; background: #F00;">*F00*</td>
        </tr>
        <tr>
          <td style="background: #003;">*003*</td>
          <td style="background: #303;">303</td>
          <td style="background: #603;">603</td>
          <td style="background: #903;">903</td>
          <td style="background: #C03;">C03</td>
          <td style="background: #F03;">*F03*</td>
        </tr>
        <tr>
          <td style="background: #006;">006</td>
          <td style="background: #306;">306</td>
          <td style="background: #606;">606</td>
          <td style="background: #906;">906</td>
          <td style="background: #C06;">C06</td>
          <td style="background: #F06;">F06</td>
        </tr>
        <tr>
          <td style="background: #009;">009</td>
          <td style="background: #309;">309</td>
          <td style="background: #609;">609</td>
          <td style="background: #909;">909</td>
          <td style="background: #C09;">C09</td>
          <td style="background: #F09;">F09</td>
        </tr>
        <tr>
          <td style="background: #00C;">00C</td>
          <td style="background: #30C;">30C</td>
          <td style="background: #60C;">60C</td>
          <td style="background: #90C;">90C</td>
          <td style="background: #C0C;">C0C</td>
          <td style="background: #F0C;">F0C</td>
        </tr>
        <tr>
          <td style="background: #00F;">*00F*</td>
          <td style="background: #30F;">30F</td>
          <td style="background: #60F;">60F</td>
          <td style="background: #90F;">90F</td>
          <td style="background: #C0F;">C0F</td>
          <td style="background: #F0F;">*F0F*</td>
        </tr>
        <tr>
          <td style="background: #030;">030</td>
          <td style="background: #330;">330</td>
          <td style="background: #630;">630</td>
          <td style="background: #930;">930</td>
          <td style="background: #C30;">C30</td>
          <td style="background: #F30;">F30</td>
        </tr>
        <tr>
          <td style="background: #033;">033</td>
          <td style="background: #333;">333</td>
          <td style="background: #633;">633</td>
          <td style="background: #933;">933</td>
          <td style="background: #C33;">C33</td>
          <td style="background: #F33;">F33</td>
        </tr>
        <tr>
          <td style="background: #036;">036</td>
          <td style="background: #336;">336</td>
          <td style="background: #636;">636</td>
          <td style="background: #936;">936</td>
          <td style="background: #C36;">C36</td>
          <td style="background: #F36;">F36</td>
        </tr>
        <tr>
          <td style="background: #039;">039</td>
          <td style="background: #339;">339</td>
          <td style="background: #639;">639</td>
          <td style="background: #939;">939</td>
          <td style="background: #C39;">C39</td>
          <td style="background: #F39;">F39</td>
        </tr>
        <tr>
          <td style="background: #03C;">03C</td>
          <td style="background: #33C;">33C</td>
          <td style="background: #63C;">63C</td>
          <td style="background: #93C;">93C</td>
          <td style="background: #C3C;">C3C</td>
          <td style="background: #F3C;">F3C</td>
        </tr>
        <tr>
          <td style="background: #03F;">03F</td>
          <td style="background: #33F;">33F</td>
          <td style="background: #63F;">63F</td>
          <td style="background: #93F;">93F</td>
          <td style="background: #C3F;">C3F</td>
          <td style="background: #F3F;">F3F</td>
        </tr>
        <tr>
          <td style="background: #060;">060</td>
          <td style="background: #360;">360</td>
          <td style="background: #660;">660</td>
          <td style="background: #960;">960</td>
          <td style="background: #C60;">C60</td>
          <td style="background: #F60;">F60</td>
        </tr>
        <tr>
          <td style="background: #063;">063</td>
          <td style="background: #363;">363</td>
          <td style="background: #663;">663</td>
          <td style="background: #963;">963</td>
          <td style="background: #C63;">C63</td>
          <td style="background: #F63;">F63</td>
        </tr>
        <tr>
          <td style="background: #066;">066</td>
          <td style="background: #366;">366</td>
          <td style="background: #666;">666</td>
          <td style="background: #966;">966</td>
          <td style="background: #C66;">C66</td>
          <td style="background: #F66;">F66</td>
        </tr>
        <tr>
          <td style="background: #069;">069</td>
          <td style="background: #369;">369</td>
          <td style="background: #669;">669</td>
          <td style="background: #969;">969</td>
          <td style="background: #C69;">C69</td>
          <td style="background: #F69;">F69</td>
        </tr>
        <tr>
          <td style="background: #06C;">06C</td>
          <td style="background: #36C;">36C</td>
          <td style="background: #66C;">66C</td>
          <td style="background: #96C;">96C</td>
          <td style="background: #C6C;">C6C</td>
          <td style="background: #F6C;">F6C</td>
        </tr>
        <tr>
          <td style="background: #06F;">06F</td>
          <td style="background: #36F;">36F</td>
          <td style="background: #66F;">66F</td>
          <td style="background: #96F;">96F</td>
          <td style="background: #C6F;">C6F</td>
          <td style="background: #F6F;">F6F</td>
        </tr>
        <tr style="color: black;">
          <td style="background: #090;">090</td>
          <td style="background: #390;">390</td>
          <td style="background: #690;">690</td>
          <td style="background: #990;">990</td>
          <td style="background: #C90;">C90</td>
          <td style="background: #F90;">F90</td>
        </tr>
        <tr style="color: black;">
          <td style="background: #093;">093</td>
          <td style="background: #393;">393</td>
          <td style="background: #693;">693</td>
          <td style="background: #993;">993</td>
          <td style="background: #C93;">C93</td>
          <td style="background: #F93;">F93</td>
        </tr>
        <tr style="color: black;">
          <td style="background: #096;">096</td>
          <td style="background: #396;">396</td>
          <td style="background: #696;">696</td>
          <td style="background: #996;">996</td>
          <td style="background: #C96;">C96</td>
          <td style="background: #F96;">F96</td>
        </tr>
        <tr style="color: black;">
          <td style="background: #099;">099</td>
          <td style="background: #399;">399</td>
          <td style="background: #699;">699</td>
          <td style="background: #999;">999</td>
          <td style="background: #C99;">C99</td>
          <td style="background: #F99;">F99</td>
        </tr>
        <tr style="color: black;">
          <td style="background: #09C;">09C</td>
          <td style="background: #39C;">39C</td>
          <td style="background: #69C;">69C</td>
          <td style="background: #99C;">99C</td>
          <td style="background: #C9C;">C9C</td>
          <td style="background: #F9C;">F9C</td>
        </tr>
        <tr style="color: black;">
          <td style="background: #09F;">09F</td>
          <td style="background: #39F;">39F</td>
          <td style="background: #69F;">69F</td>
          <td style="background: #99F;">99F</td>
          <td style="background: #C9F;">C9F</td>
          <td style="background: #F9F;">F9F</td>
        </tr>
        <tr style="color: black;">
          <td style="background: #0C0;">0C0</td>
          <td style="background: #3C0;">3C0</td>
          <td style="background: #6C0;">6C0</td>
          <td style="background: #9C0;">9C0</td>
          <td style="background: #CC0;">CC0</td>
          <td style="background: #FC0;">FC0</td>
        </tr>
        <tr style="color: black;">
          <td style="background: #0C3;">0C3</td>
          <td style="background: #3C3;">3C3</td>
          <td style="background: #6C3;">6C3</td>
          <td style="background: #9C3;">9C3</td>
          <td style="background: #CC3;">CC3</td>
          <td style="background: #FC3;">FC3</td>
        </tr>
        <tr style="color: black;">
          <td style="background: #0C6;">0C6</td>
          <td style="background: #3C6;">3C6</td>
          <td style="background: #6C6;">6C6</td>
          <td style="background: #9C6;">9C6</td>
          <td style="background: #CC6;">CC6</td>
          <td style="background: #FC6;">FC6</td>
        </tr>
        <tr style="color: black;">
          <td style="background: #0C9;">0C9</td>
          <td style="background: #3C9;">3C9</td>
          <td style="background: #6C9;">6C9</td>
          <td style="background: #9C9;">9C9</td>
          <td style="background: #CC9;">CC9</td>
          <td style="background: #FC9;">FC9</td>
        </tr>
        <tr style="color: black;">
          <td style="background: #0CC;">0CC</td>
          <td style="background: #3CC;">3CC</td>
          <td style="background: #6CC;">6CC</td>
          <td style="background: #9CC;">9CC</td>
          <td style="background: #CCC;">CCC</td>
          <td style="background: #FCC;">FCC</td>
        </tr>
        <tr style="color: black;">
          <td style="background: #0CF;">0CF</td>
          <td style="background: #3CF;">3CF</td>
          <td style="background: #6CF;">6CF</td>
          <td style="background: #9CF;">9CF</td>
          <td style="background: #CCF;">CCF</td>
          <td style="background: #FCF;">FCF</td>
        </tr>
        <tr style="color: black;">
          <td style="background: #0F0;">*0F0*</td>
          <td style="background: #3F0;">3F0</td>
          <td style="background: #6F0;">*6F0*</td>
          <td style="background: #9F0;">9F0</td>
          <td style="background: #CF0;">CF0</td>
          <td style="background: #FF0;">*FF0*</td>
        </tr>
        <tr style="color: black;">
          <td style="background: #0F3;">0F3</td>
          <td style="background: #3F3;">*3F3*</td>
          <td style="background: #6F3;">*6F3*</td>
          <td style="background: #9F3;">9F3</td>
          <td style="background: #CF3;">CF3</td>
          <td style="background: #FF3;">*FF3*</td>
        </tr>
        <tr style="color: black;">
          <td style="background: #0F6;">*0F6*</td>
          <td style="background: #3F6;">*3F6*</td>
          <td style="background: #6F6;">6F6</td>
          <td style="background: #9F6;">9F6</td>
          <td style="background: #CF6;">*CF6*</td>
          <td style="background: #FF6;">*FF6*</td>
        </tr>
        <tr style="color: black;">
          <td style="background: #0F9;">0F9</td>
          <td style="background: #3F9;">3F9</td>
          <td style="background: #6F9;">6F9</td>
          <td style="background: #9F9;">9F9</td>
          <td style="background: #CF9;">CF9</td>
          <td style="background: #FF9;">FF9</td>
        </tr>
        <tr style="color: black;">
          <td style="background: #0FC;">*0FC*</td>
          <td style="background: #3FC;">*3FC*</td>
          <td style="background: #6FC;">6FC</td>
          <td style="background: #9FC;">9FC</td>
          <td style="background: #CFC;">CFC</td>
          <td style="background: #FFC;">FFC</td>
        </tr>
        <tr style="color: black;">
          <td style="background: #0FF;">*0FF*</td>
          <td style="background: #3FF;">*3FF*</td>
          <td style="background: #6FF;">*6FF*</td>
          <td style="background: #9FF;">9FF</td>
          <td style="background: #CFF;">CFF</td>
          <td style="background: #FFF;">*FFF*</td>
        </tr>
      </tbody>
    </table>
  </body>
</html>
'@
$Script:AllColorData = [System.Collections.ObjectModel.Collection[System.Management.Automation.PSObject]]::new();
$Script:AllCssNames = [System.Collections.ObjectModel.Collection[System.Management.Automation.PSObject]]::new();
$Script:AllCssNumbers = [System.Collections.ObjectModel.Collection[System.Management.Automation.PSObject]]::new();
$Script:AllCssAliases = [System.Collections.ObjectModel.Collection[System.Management.Automation.PSObject]]::new();
$Script:AllX11Codes = [System.Collections.ObjectModel.Collection[System.Management.Automation.PSObject]]::new();
$Script:AllVGANames = [System.Collections.ObjectModel.Collection[System.Management.Automation.PSObject]]::new();
$Script:AllWindowsNames = [System.Collections.ObjectModel.Collection[System.Management.Automation.PSObject]]::new();

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

$WebColorsHtmlDocument = [System.Xml.XmlDocument]::new();
$WebColorsHtmlDocument.LoadXml($SourceHtml);

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

$XmlWriterSettings = [System.Xml.XmlWriterSettings]::new();
$XmlWriterSettings.Indent = $true;
$XmlWriterSettings.OmitXmlDeclaration = $true;
$XmlWriterSettings.Encoding = [System.Text.UTF8Encoding]::new($false);
$Script:OutputXmlDocument = [System.Xml.XmlDocument]::new();
$Script:OutputXmlDocument.AppendChild($Script:OutputXmlDocument.CreateElement('colors')) | Out-Null;
$TextWriter = [System.IO.StreamWriter]::new(($PSScriptRoot | Join-Path -ChildPath 'WebColors.json'), $XmlWriterSettings.Encoding);
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
    $H = $ColorInfo.Hue + 180.0;
    if ($H -gt 360.0) { $H -= 360.0 }
    $B = $ColorInfo.Brightness;
    if ($ColorInfo.Saturation -lt 0.5 -or ($B -gt 0.25 -and $B -lt 0.75)) {
        if ($B -lt 0.5) { $B = 1.0 } else { $B = 0.0 }
    } else {
        $B = 1.0 - $B;
    }
    $Rgb = Convert-HsbToRgb -H $H -S $ColorInfo.Saturation -B $B;
    $ColorInfo | Add-Member -MemberType NoteProperty -Name 'Inverse' -Value ($Rgb[0].ToString('x2') + $Rgb[1].ToString('x2') + $Rgb[2].ToString('x2'));
}
$Script:AllColorData = @($Script:AllColorData | Sort-Object -Property 'Hue', 'Brightness', 'Saturation', 'ID');

$CurrentLine = '';
foreach ($ColorInfo in $Script:AllColorData) {
  $rgb = Convert-HsbToRgb -H $ColorInfo.Hue -S $ColorInfo.Saturation -B $ColorInfo.Brightness;
  if ($rgb[0] -ne $ColorInfo.R -or $rgb[1] -ne $ColorInfo.G -or $rgb[2] -ne $ColorInfo.B) {
    Write-Warning -Message "Convert-HsbToRgb failed. Expected ($($ColorInfo.R), $($ColorInfo.G), $($ColorInfo.B)); Actual ($($rgb[0]), $($rgb[1]), $($rgb[2]))";
  }
    if ($CurrentLine.Length -gt 0) {
        $TextWriter.WriteLine("$CurrentLine,")
    }
    $CurrentLine = "        { `"id`": `"$($ColorInfo.ID)`"";
    
    if ($ColorInfo.Group -eq $null) {
        $cgd = $null;
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
    $XmlElement.Attributes.Append($Script:OutputXmlDocument.CreateAttribute('inverse')).Value = $ColorInfo.Inverse;
    
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
    $JSONPairs += @("`"inverse`": `"$($ColorInfo.Inverse)`"");
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

$XmlWriter = [System.Xml.XmlWriter]::Create($Path, $XmlWriterSettings);
$Script:OutputXmlDocument.WriteTo($XmlWriter);
$XmlWriter.Flush();
$XmlWriter.Close();
$TextWriter.Flush();
$TextWriter.Close();