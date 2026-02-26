# restore.ps1
# Reassembles split files created by split_files.ps1

if (-Not (Test-Path ".split_metadata.txt")) {
    Write-Host "No split metadata found."
    exit
}

$metadata = Get-Content ".split_metadata.txt"

foreach ($originalPath in $metadata) {
    if (-Not (Test-Path "$originalPath.part1")) {
        Write-Warning "Parts for $originalPath not found. Skipping."
        continue
    }

    Write-Host "Reassembling $originalPath..."
    $outputStream = [System.IO.File]::Create($originalPath)
    $part = 1
    
    while (Test-Path "$($originalPath).part$part") {
        $bytesRead = [System.IO.File]::ReadAllBytes("$($originalPath).part$part")
        $outputStream.Write($bytesRead, 0, $bytesRead.Length)
        $part++
    }
    
    $outputStream.Close()
    Write-Host "Done."
}
