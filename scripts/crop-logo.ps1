Add-Type -AssemblyName System.Drawing

$src = [System.Drawing.Bitmap]::FromFile("C:\Users\mahen\Downloads\WhatsApp Image 2026-10-11 at 7.00.43 AM.jpeg")
Write-Host "Source image: $($src.Width) x $($src.Height)"

# Bounding box from Y=498 to 1066, X=24 to 1582
# Add 10px safety padding
$x = [Math]::Max(0, 20)
$y = [Math]::Max(0, 490)
$w = [Math]::Min($src.Width - $x, 1565)
$h = [Math]::Min($src.Height - $y, 580)

Write-Host "Cropping rect: X=$x, Y=$y, W=$w, H=$h"

$rect = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
$cropped = $src.Clone($rect, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$src.Dispose()

# Also let's create a transparent version of this cropped logo (removing pure white background)
$transparent = New-Object System.Drawing.Bitmap($cropped.Width, $cropped.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

for ($cy = 0; $cy -lt $cropped.Height; $cy++) {
    for ($cx = 0; $cx -lt $cropped.Width; $cx++) {
        $p = $cropped.GetPixel($cx, $cy)
        # White background removal
        if ($p.R -gt 245 -and $p.G -gt 245 -and $p.B -gt 245) {
            $transparent.SetPixel($cx, $cy, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        } elseif ($p.R -gt 225 -and $p.G -gt 225 -and $p.B -gt 225) {
            $maxVal = [Math]::Max($p.R, [Math]::Max($p.G, $p.B))
            $a = [int]((255 - $maxVal) / 30.0 * 255)
            if ($a -lt 0) { $a = 0 }
            if ($a -gt 255) { $a = 255 }
            $transparent.SetPixel($cx, $cy, [System.Drawing.Color]::FromArgb($a, $p.R, $p.G, $p.B))
        } else {
            $transparent.SetPixel($cx, $cy, $p)
        }
    }
}

$cropped.Save("public\logo-cropped.png", [System.Drawing.Imaging.ImageFormat]::Png)
$transparent.Save("public\logo-cropped-transparent.png", [System.Drawing.Imaging.ImageFormat]::Png)

# Overwrite logo.png with this tightly cropped version!
$transparent.Save("public\logo.png", [System.Drawing.Imaging.ImageFormat]::Png)

$cropped.Dispose()
$transparent.Dispose()

Write-Host "Cropped logo saved successfully! Size: $w x $h"
