Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\mahen\Downloads\WhatsApp Image 2026-10-11 at 7.29.42 AM.jpeg"
$src = [System.Drawing.Bitmap]::FromFile($srcPath)
Write-Host "Source image size: $($src.Width) x $($src.Height)"

# 1. First, find content bounds (crop out outer white border/padding if any)
$minX = $src.Width
$maxX = 0
$minY = $src.Height
$maxY = 0

for ($y = 0; $y -lt $src.Height; $y += 2) {
    for ($x = 0; $x -lt $src.Width; $x += 2) {
        $p = $src.GetPixel($x, $y)
        if ($p.R -lt 248 -or $p.G -lt 248 -or $p.B -lt 248) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}

Write-Host "Content bounds: X=$minX..$maxX, Y=$minY..$maxY"
$pad = 10
$cropX = [Math]::Max(0, $minX - $pad)
$cropY = [Math]::Max(0, $minY - $pad)
$cropW = [Math]::Min($src.Width - $cropX, ($maxX - $minX + 1) + ($pad * 2))
$cropH = [Math]::Min($src.Height - $cropY, ($maxY - $minY + 1) + ($pad * 2))

$cropRect = New-Object System.Drawing.Rectangle($cropX, $cropY, $cropW, $cropH)
$cropped = $src.Clone($cropRect, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$src.Dispose()

Write-Host "Cropped size: $($cropped.Width) x $($cropped.Height)"

# 2. Make transparent background version (remove pure white around the chef and text)
$transparent = New-Object System.Drawing.Bitmap($cropped.Width, $cropped.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
for ($y = 0; $y -lt $cropped.Height; $y++) {
    for ($x = 0; $x -lt $cropped.Width; $x++) {
        $p = $cropped.GetPixel($x, $y)
        # Background is pure/near white
        if ($p.R -gt 248 -and $p.G -gt 248 -and $p.B -gt 248) {
            $transparent.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        } elseif ($p.R -gt 232 -and $p.G -gt 232 -and $p.B -gt 232) {
            $maxVal = [Math]::Max($p.R, [Math]::Max($p.G, $p.B))
            $a = [int]((255 - $maxVal) / 23.0 * 255)
            if ($a -lt 0) { $a = 0 }
            if ($a -gt 255) { $a = 255 }
            $transparent.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($a, $p.R, $p.G, $p.B))
        } else {
            $transparent.SetPixel($x, $y, $p)
        }
    }
}

# 3. Save as primary logo assets
$transparent.Save("public\logo.png", [System.Drawing.Imaging.ImageFormat]::Png)
$cropped.Save("public\logo-solid.png", [System.Drawing.Imaging.ImageFormat]::Png)
Write-Host "Saved public\logo.png and public\logo-solid.png"

# 4. Generate Favicons (32x32, 64x64, 192x192, 512x512)
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

$fav32 = Resize-Image $transparent 32 32
$fav64 = Resize-Image $transparent 64 64
$fav192 = Resize-Image $transparent 192 192
$fav512 = Resize-Image $transparent 512 512

$fav32.Save("public\favicon-32x32.png", [System.Drawing.Imaging.ImageFormat]::Png)
$fav192.Save("public\favicon-192x192.png", [System.Drawing.Imaging.ImageFormat]::Png)
$fav512.Save("public\favicon-512x512.png", [System.Drawing.Imaging.ImageFormat]::Png)
$fav512.Save("public\favicon.png", [System.Drawing.Imaging.ImageFormat]::Png)
$fav32.Save("public\favicon.ico", [System.Drawing.Imaging.ImageFormat]::Png) # standard browser accepts png in ico
Write-Host "Saved favicons (32, 192, 512, ico)"

# 5. Update Android launcher icons in all mipmap folders
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
$fav64.Dispose()
$fav192.Dispose()
$fav512.Dispose()

Write-Host "All logo, favicon, and mobile app icons generated successfully!"
