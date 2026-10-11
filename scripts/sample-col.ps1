Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Bitmap]::FromFile("C:\Users\mahen\Downloads\WhatsApp Image 2026-10-11 at 7.00.43 AM.jpeg")
for ($y = 0; $y -lt 1600; $y += 50) {
    $p = $img.GetPixel(800, $y)
    Write-Host "Y=$y -> R=$($p.R), G=$($p.G), B=$($p.B)"
}
$img.Dispose()
