Add-Type -AssemblyName System.Drawing

$sizes = @(72, 96, 128, 144, 152, 192, 512)

foreach ($size in $sizes) {
    $bmp = New-Object System.Drawing.Bitmap($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    
    # Fill background with blue color
    $g.FillRectangle([System.Drawing.Brushes]::DodgerBlue, 0, 0, $size, $size)
    
    # Draw text "PH" as placeholder for paw emoji
    $fontSize = [math]::Floor($size * 0.4)
    $font = New-Object System.Drawing.Font("Arial", $fontSize, [System.Drawing.FontStyle]::Bold)
    $textSize = $g.MeasureString("PH", $font)
    $x = ($size - $textSize.Width) / 2
    $y = ($size - $textSize.Height) / 2
    
    $g.DrawString("PH", $font, [System.Drawing.Brushes]::White, $x, $y)
    
    # Save the image
    $filename = "icon-$size.png"
    $bmp.Save($filename, [System.Drawing.Imaging.ImageFormat]::Png)
    
    $g.Dispose()
    $bmp.Dispose()
    $font.Dispose()
    
    Write-Host "Created $filename"
}

Write-Host "All icons created successfully!"