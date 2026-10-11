Add-Type -AssemblyName System.Drawing

$img1 = [System.Drawing.Bitmap]::FromFile("C:\Users\mahen\Downloads\WhatsApp Image 2026-10-11 at 7.00.43 AM.jpeg")
Write-Host "Img 1: $($img1.Width) x $($img1.Height)"

# Find circular border or circle bounds
# In 7.00.43 AM, let's find the circle diameter and center
# Step across center horizontal line (y = 800)
$leftX = -1
$rightX = -1
for ($x = 0; $x -lt 1600; $x++) {
    $p = $img1.GetPixel($x, 800)
    # Circle has gold border or background differs from outer white (255, 255, 255)
    if ($p.R -lt 250 -or $p.G -lt 250 -or $p.B -lt 250) {
        if ($leftX -eq -1) { $leftX = $x }
        $rightX = $x
    }
}

$topY = -1
$bottomY = -1
for ($y = 0; $y -lt 1600; $y++) {
    $p = $img1.GetPixel(800, $y)
    if ($p.R -lt 250 -or $p.G -lt 250 -or $p.B -lt 250) {
        if ($topY -eq -1) { $topY = $y }
        $bottomY = $y
    }
}

Write-Host "Circle horizontal: $leftX to $rightX (width: $($rightX - $leftX))"
Write-Host "Circle vertical: $topY to $bottomY (height: $($bottomY - $topY))"

$img1.Dispose()
