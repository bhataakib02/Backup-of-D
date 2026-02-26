# split_files.ps1
# Splits files > 95MB into multiple parts to bypass GitHub's 100MB limit.
# Originals are renamed to .orig and excluded from git.

if (-Not (Select-String -Path "D:\.gitignore" -Pattern "\.orig$")) {
    Add-Content -Path "D:\.gitignore" -Value "`n# Exclude original large files before splitting`n*.orig"
}

$maxSizeMB = 95
$maxSizeBytes = $maxSizeMB * 1024 * 1024

$largeFiles = Get-ChildItem -Path D:\ -Recurse -File -ErrorAction SilentlyContinue | Where-Object { $_.Length -gt $maxSizeBytes -and $_.FullName -notmatch "\.git\\" -and $_.FullName -notmatch "\.part\d+$" }

foreach ($file in $largeFiles) {
    Write-Host "Splitting $($file.FullName) ($([math]::Round($file.Length / 1MB, 2)) MB)..."
    
    $fileStream = [System.IO.File]::OpenRead($file.FullName)
    $buffer = New-Object byte[] $maxSizeBytes
    $part = 1
    
    while ($fileStream.Position -lt $fileStream.Length) {
        $bytesRead = $fileStream.Read($buffer, 0, $buffer.Length)
        $partName = "$($file.FullName).part$part"
        $outputStream = [System.IO.File]::Create($partName)
        $outputStream.Write($buffer, 0, $bytesRead)
        $outputStream.Close()
        $part++
    }
    
    $fileStream.Close()
    
    # Rename original to .orig so git ignores it
    Move-Item -Path $file.FullName -Destination "$($file.FullName).orig" -Force
    
    # Track the split file so we can ignore the original and add the parts
    Add-Content -Path "D:\.split_metadata.txt" -Value "$($file.FullName)"
    Write-Host "Done. Created $($part - 1) parts. Original moved to $($file.FullName).orig"
}
