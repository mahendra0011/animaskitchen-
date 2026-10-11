Add-Type -AssemblyName System.Drawing

$src = [System.Drawing.Bitmap]::FromFile("C:\Users\mahen\Downloads\WhatsApp Image 2026-10-11 at 7.00.43 AM.jpeg")
Write-Host "Original: $($src.Width) x $($src.Height)"

# Circle ring bounds in WhatsApp Image 2026-10-11 at 7.00.43 AM.jpeg:
# Let's inspect rows from y=0 to 1600 to find top of circle, bottom of circle, left of circle, right of circle
$minX = 1600
$maxX = 0
$minY = 1600
$maxY = 0

for ($y = 0; $y -lt $src.Height; $y += 2) {
    for ($x = 0; $x -lt $src.Width; $x += 2) {
        $p = $src.GetPixel($x, $y)
        # Any pixel not pure white outside
        if ($p.R -lt 250 -or $p.G -lt 250 -or $p.B -lt 250) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}

Write-Host "Circle outer bounds: minX=$minX, maxX=$maxX, minY=$minY, maxY=$maxY"

# Now let's find the inner logo content bounds (text, chef hat, leaves, spoon, tagline)
$contentMinX = 1600
$contentMaxX = 0
$contentMinY = 1600
$contentMaxY = 0

# Scan inside
for ($y = $minY; $y -le $maxY; $y += 2) {
    for ($x = $minX; $x -le $maxX; $x += 2) {
        $p = $src.GetPixel($x, $y)
        # Check for non-cream / non-white (the text, green leaves, red 'Maa', orange hat, brown spoon)
        # The inner background of the circle is cream (~255, 244, 205).
        # Text/graphics are dark green (R < 100, G > 60), red (R > 180, G < 50, B < 50), orange, brown
        $isBg = ($p.R -gt 235 -and $p.G -gt 225 -and $p.B -gt 190) -or ($p.R -gt 245 -and $p.G -gt 245 -and $p.B -gt 245)
        if (-not $isBg) {
            if ($x -lt $contentMinX) { $contentMinX = $x }
            if ($x -gt $contentMaxX) { $contentMaxX = $x }
            if ($y -lt $contentMinY) { $contentMinY = $y }
            if ($y -gt $contentMaxY) { $contentMaxY = $y }
        }
    }
}

Write-Host "Content inner bounds: minX=$contentMinX, maxX=$contentMaxX, minY=$contentMinY, maxY=$contentMaxY"
Write-Host "Content size: $($contentMaxX - $contentMinX) x $($contentMaxY - $contentMinY)"

$src.Dispose()
