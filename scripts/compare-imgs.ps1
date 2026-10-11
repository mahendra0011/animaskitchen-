Add-Type -AssemblyName System.Drawing

$img1 = [System.Drawing.Bitmap]::FromFile("C:\Users\mahen\Downloads\WhatsApp Image 2026-10-11 at 7.00.43 AM.jpeg")
Write-Host "Img 7.00.43 AM size: $($img1.Width) x $($img1.Height)"
# sample a few points
Write-Host "Pixel (10, 10): $($img1.GetPixel(10, 10))"
Write-Host "Pixel (800, 800): $($img1.GetPixel(800, 800))"
$img1.Dispose()

$img2 = [System.Drawing.Bitmap]::FromFile("C:\Users\mahen\Downloads\WhatsApp Image 2026-10-11 at 6.29.52 AM.jpeg")
Write-Host "Img 6.29.52 AM size: $($img2.Width) x $($img2.Height)"
Write-Host "Pixel (10, 10): $($img2.GetPixel(10, 10))"
Write-Host "Pixel (800, 800): $($img2.GetPixel(800, 800))"
$img2.Dispose()
