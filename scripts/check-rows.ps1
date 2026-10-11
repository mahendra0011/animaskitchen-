Add-Type -AssemblyName System.Drawing

$img = [System.Drawing.Bitmap]::FromFile("C:\Users\mahen\Downloads\WhatsApp Image 2026-10-11 at 7.00.43 AM.jpeg")
Write-Host "Pixel at (100, 782): $($img.GetPixel(100, 782))"
Write-Host "Pixel at (24, 782): $($img.GetPixel(24, 782))"
Write-Host "Pixel at (800, 498): $($img.GetPixel(800, 498))"
Write-Host "Pixel at (800, 1066): $($img.GetPixel(800, 1066))"
Write-Host "Pixel at (800, 450): $($img.GetPixel(800, 450))"
Write-Host "Pixel at (800, 1150): $($img.GetPixel(800, 1150))"

# Let's find why Y range was 498 to 1066
# In 7.00.43 AM, the image has 1600x1600.
# Where is the circle boundary?
# Let's find any pixel with color not (255, 255, 255)
$nonWhiteCountByRow = @{}
for ($y = 0; $y -lt 1600; $y += 10) {
    $count = 0
    for ($x = 0; $x -lt 1600; $x += 10) {
        $p = $img.GetPixel($x, $y)
        if ($p.R -lt 250 -or $p.G -lt 250 -or $p.B -lt 250) {
            $count++
        }
    }
    if ($count -gt 0) {
        Write-Host "Row Y=$y has $count non-white pixels"
    }
}

$img.Dispose()
