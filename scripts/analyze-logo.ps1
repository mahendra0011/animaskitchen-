Add-Type -AssemblyName System.Drawing

$src = [System.Drawing.Bitmap]::FromFile("C:\Users\mahen\Downloads\WhatsApp Image 2026-10-11 at 7.00.43 AM.jpeg")
Write-Host "Original Image size: $($src.Width) x $($src.Height)"

# We want to crop out the empty white space above and below the logo content or crop tightly to the circular badge or inner text
# Let's inspect the bounding box of non-white content
$minX = $src.Width
$maxX = 0
$minY = $src.Height
$maxY = 0

for ($y = 0; $y -lt $src.Height; $y++) {
    for ($x = 0; $x -lt $src.Width; $x++) {
        $p = $src.GetPixel($x, $y)
        # Check if pixel is not plain white/background
        if ($p.R -lt 240 -or $p.G -lt 240 -or $p.B -lt 240) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}

Write-Host "Detected content bounds: X: $minX..$maxX, Y: $minY..$maxY"
$w = $maxX - $minX + 1
$h = $maxY - $minY + 1
Write-Host "Bounding box: $w x $h"

# Also let's check inside the circle if there is content bounds:
# Specifically the text and graphics inside the circle:
$innerMinX = $src.Width
$innerMaxX = 0
$innerMinY = $src.Height
$innerMaxY = 0

# Check text pixels (non-cream, non-circle border)
# Circle border is usually a light gold/orange line, inside is white/cream
for ($y = $minY + 20; $y -lt $maxY - 20; $y++) {
    for ($x = $minX + 20; $x -lt $maxX - 20; $x++) {
        $p = $src.GetPixel($x, $y)
        # dark text / green / red colors
        if ($p.R -lt 220 -or $p.G -lt 220 -or $p.B -lt 220) {
            if ($x -lt $innerMinX) { $innerMinX = $x }
            if ($x -gt $innerMaxX) { $innerMaxX = $x }
            if ($y -lt $innerMinY) { $innerMinY = $y }
            if ($y -gt $innerMaxY) { $innerMaxY = $y }
        }
    }
}
Write-Host "Inner text/graphic bounds: X: $innerMinX..$innerMaxX, Y: $innerMinY..$innerMaxY"

$src.Dispose()
