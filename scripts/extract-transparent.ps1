Add-Type -AssemblyName System.Drawing

$inputPath = "C:\Users\mahen\Downloads\WhatsApp Image 2026-10-11 at 6.29.52 AM.jpeg"
$outputPath = "public\brand-transparent.png"

$src = [System.Drawing.Bitmap]::FromFile($inputPath)
$bmp = New-Object System.Drawing.Bitmap($src.Width, $src.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

$minX = $src.Width
$maxX = 0
$minY = $src.Height
$maxY = 0

for ($y = 0; $y -lt $src.Height; $y++) {
    for ($x = 0; $x -lt $src.Width; $x++) {
        $p = $src.GetPixel($x, $y)
        if ($p.R -gt 240 -and $p.G -gt 240 -and $p.B -gt 240) {
            $bmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        } elseif ($p.R -gt 215 -and $p.G -gt 215 -and $p.B -gt 215) {
            $maxVal = [Math]::Max($p.R, [Math]::Max($p.G, $p.B))
            $a = [int]((255 - $maxVal) / 40.0 * 255)
            if ($a -lt 0) { $a = 0 }
            if ($a -gt 255) { $a = 255 }
            $bmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($a, $p.R, $p.G, $p.B))
            if ($a -gt 25) {
                if ($x -lt $minX) { $minX = $x }
                if ($x -gt $maxX) { $maxX = $x }
                if ($y -lt $minY) { $minY = $y }
                if ($y -gt $maxY) { $maxY = $y }
            }
        } else {
            $bmp.SetPixel($x, $y, $p)
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}
$src.Dispose()

$w = $maxX - $minX + 1
$h = $maxY - $minY + 1
$rect = New-Object System.Drawing.Rectangle($minX, $minY, $w, $h)
$cropped = $bmp.Clone($rect, $bmp.PixelFormat)
$bmp.Dispose()

$cropped.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
$cropped.Dispose()

Write-Host "Brand transparent PNG created successfully! Size: $w x $h"
