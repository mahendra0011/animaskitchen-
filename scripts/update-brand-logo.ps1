Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\mahen\.gemini\antigravity-ide\brain\50ddbcd0-97ee-4e2f-88db-c58de7201863\.user_uploaded\media_1792835922124.jpg"
$src = [System.Drawing.Bitmap]::FromFile($srcPath)
Write-Host "Source image: $($src.Width) x $($src.Height)"

# 1. Detect content/circle bounds (crop out outer white border if any)
$minX = $src.Width
$maxX = 0
$minY = $src.Height
$maxY = 0

for ($y = 0; $y -lt $src.Height; $y += 2) {
    for ($x = 0; $x -lt $src.Width; $x += 2) {
        $p = $src.GetPixel($x, $y)
        # Check non-white pixels
        if ($p.R -lt 250 -or $p.G -lt 250 -or $p.B -lt 250) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}

Write-Host "Detected bounds: X=$minX..$maxX, Y=$minY..$maxY"
$pad = 4
$cropX = [Math]::Max(0, $minX - $pad)
$cropY = [Math]::Max(0, $minY - $pad)
$cropW = [Math]::Min($src.Width - $cropX, ($maxX - $minX + 1) + ($pad * 2))
$cropH = [Math]::Min($src.Height - $cropY, ($maxY - $minY + 1) + ($pad * 2))

# Make it square if possible centered on the circle
$side = [Math]::Max($cropW, $cropH)
$centerX = [int]($cropX + ($cropW / 2))
$centerY = [int]($cropY + ($cropH / 2))

$sqX = [Math]::Max(0, [int]($centerX - ($side / 2)))
$sqY = [Math]::Max(0, [int]($centerY - ($side / 2)))
if ($sqX + $side -gt $src.Width) { $side = $src.Width - $sqX }
if ($sqY + $side -gt $src.Height) { $side = $src.Height - $sqY }

$cropRect = New-Object System.Drawing.Rectangle($sqX, $sqY, $side, $side)
$cropped = $src.Clone($cropRect, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$src.Dispose()

Write-Host "Square crop size: $($cropped.Width) x $($cropped.Height)"

# 2. Make transparent background (outer corners outside the circle)
$transparent = New-Object System.Drawing.Bitmap($cropped.Width, $cropped.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$radius = $cropped.Width / 2.0
$radiusSq = $radius * $radius
$cRadiusSq = ($radius - 3) * ($radius - 3)

for ($y = 0; $y -lt $cropped.Height; $y++) {
    for ($x = 0; $x -lt $cropped.Width; $x++) {
        $dx = $x - $radius
        $dy = $y - $radius
        $distSq = ($dx * $dx) + ($dy * $dy)
        $p = $cropped.GetPixel($x, $y)
        
        # If outside circle, pure transparent
        if ($distSq -gt $radiusSq) {
            $transparent.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        } elseif ($distSq -gt $cRadiusSq) {
            # Anti-aliasing edge
            $factor = ($radiusSq - $distSq) / ($radiusSq - $cRadiusSq)
            $alpha = [int]([Math]::Min(255, [Math]::Max(0, $factor * 255)))
            $transparent.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, $p.R, $p.G, $p.B))
        } else {
            $transparent.SetPixel($x, $y, $p)
        }
    }
}

# Resize helper
function Resize-Image($image, $width, $height) {
    $destRect = New-Object System.Drawing.Rectangle(0, 0, $width, $height)
    $destImage = New-Object System.Drawing.Bitmap($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $graphics = [System.Drawing.Graphics]::FromImage($destImage)
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $graphics.DrawImage($image, $destRect, 0, 0, $image.Width, $image.Height, [System.Drawing.GraphicsUnit]::Pixel)
    $graphics.Dispose()
    return $destImage
}

# 3. Save as primary public logos
$cropped.Save("public\logo-solid.png", [System.Drawing.Imaging.ImageFormat]::Png)
$transparent.Save("public\logo-transparent.png", [System.Drawing.Imaging.ImageFormat]::Png)
$transparent.Save("public\logo.png", [System.Drawing.Imaging.ImageFormat]::Png)
$transparent.Save("public\logo-cropped.png", [System.Drawing.Imaging.ImageFormat]::Png)
$transparent.Save("public\logo-cropped-transparent.png", [System.Drawing.Imaging.ImageFormat]::Png)
$transparent.Save("public\brand-transparent.png", [System.Drawing.Imaging.ImageFormat]::Png)
$cropped.Save("public\logo.jpeg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$cropped.Save("public\navbar-logo.jpeg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$cropped.Save("public\navbar-banner.jpeg", [System.Drawing.Imaging.ImageFormat]::Jpeg)

Write-Host "Primary logos saved to public/"

# 4. Generate Favicons
$fav32 = Resize-Image $transparent 32 32
$fav192 = Resize-Image $transparent 192 192
$fav512 = Resize-Image $transparent 512 512

$fav32.Save("public\favicon-32x32.png", [System.Drawing.Imaging.ImageFormat]::Png)
$fav192.Save("public\favicon-192x192.png", [System.Drawing.Imaging.ImageFormat]::Png)
$fav512.Save("public\favicon-512x512.png", [System.Drawing.Imaging.ImageFormat]::Png)
$fav512.Save("public\favicon.png", [System.Drawing.Imaging.ImageFormat]::Png)
$fav32.Save("public\favicon.ico", [System.Drawing.Imaging.ImageFormat]::Png)

Write-Host "Favicons saved to public/"

# 5. Update Android launcher icons if exists
$mipmapSizes = @{
    "android\app\src\main\res\mipmap-mdpi" = 48
    "android\app\src\main\res\mipmap-hdpi" = 72
    "android\app\src\main\res\mipmap-xhdpi" = 96
    "android\app\src\main\res\mipmap-xxhdpi" = 144
    "android\app\src\main\res\mipmap-xxxhdpi" = 192
}

foreach ($folder in $mipmapSizes.Keys) {
    if (Test-Path $folder) {
        $sz = $mipmapSizes[$folder]
        $resized = Resize-Image $cropped $sz $sz
        $resized.Save("$folder\ic_launcher.png", [System.Drawing.Imaging.ImageFormat]::Png)
        $resized.Save("$folder\ic_launcher_round.png", [System.Drawing.Imaging.ImageFormat]::Png)
        $resized.Save("$folder\ic_launcher_foreground.png", [System.Drawing.Imaging.ImageFormat]::Png)
        $resized.Dispose()
        Write-Host "Updated Android launcher icons in $folder ($sz x $sz)"
    }
}

$cropped.Dispose()
$transparent.Dispose()
$fav32.Dispose()
$fav192.Dispose()
$fav512.Dispose()

Write-Host "Done! New logo successfully processed across all sizes and formats."
