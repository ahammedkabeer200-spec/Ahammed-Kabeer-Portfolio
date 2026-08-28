# Auto-sync watcher for Ahammed Kabeer Career Portfolio
$repoPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $repoPath

$host.UI.RawUI.WindowTitle = "Website Auto-Sync to GitHub (Active)"
Clear-Host
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "   Ahammed Kabeer Website - Real-Time GitHub Auto-Sync " -ForegroundColor Yellow
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "Monitoring folder: $repoPath" -ForegroundColor Gray
Write-Host "Status: Watching for file changes..." -ForegroundColor Green
Write-Host "Tip: Keep this window open or minimized while editing." -ForegroundColor DarkGray
Write-Host ""

$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = $repoPath
$watcher.IncludeSubdirectories = $true
$watcher.EnableRaisingEvents = $true
$watcher.NotifyFilter = [System.IO.NotifyFilters]::FileName -bor [System.IO.NotifyFilters]::LastWrite

$global:hasChanges = $false
$global:lastChangeTime = [DateTime]::MinValue

$action = {
    param($source, $event)
    $path = $event.FullPath
    # Ignore .git folder and log/bat watcher files
    if ($path -match '\\\.git' -or $path -match '\.sync-lock') { return }
    
    $global:hasChanges = $true
    $global:lastChangeTime = [DateTime]::Now
}

$createdEvent = Register-ObjectEvent $watcher 'Created' -Action $action
$changedEvent = Register-ObjectEvent $watcher 'Changed' -Action $action
$deletedEvent = Register-ObjectEvent $watcher 'Deleted' -Action $action
$renamedEvent = Register-ObjectEvent $watcher 'Renamed' -Action $action

try {
    while ($true) {
        Start-Sleep -Seconds 2
        
        # Debounce: wait until 5 seconds have passed since the last change
        if ($global:hasChanges -and (([DateTime]::Now - $global:lastChangeTime).TotalSeconds -ge 5)) {
            $global:hasChanges = $false
            
            $status = git status --porcelain
            if (-not [string]::IsNullOrWhiteSpace($status)) {
                $timeStr = Get-Date -Format "HH:mm:ss"
                Write-Host "[$timeStr] Change detected. Preparing upload to GitHub..." -ForegroundColor Cyan
                
                git add .
                $commitMsg = "Auto-update website: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
                git commit -m $commitMsg | Out-Null
                
                Write-Host "[$timeStr] Pushing to GitHub..." -ForegroundColor DarkCyan
                $pushResult = git push origin main 2>&1
                
                if ($LASTEXITCODE -eq 0) {
                    Write-Host "[$timeStr] SUCCESS: Uploaded to GitHub! Live site is updating." -ForegroundColor Green
                } else {
                    Write-Host "[$timeStr] ERROR pushing to GitHub: $pushResult" -ForegroundColor Red
                }
                Write-Host "[$timeStr] Watching for next change..." -ForegroundColor Gray
                Write-Host ""
            }
        }
    }
} finally {
    Unregister-Event $createdEvent.Id -ErrorAction SilentlyContinue
    Unregister-Event $changedEvent.Id -ErrorAction SilentlyContinue
    Unregister-Event $deletedEvent.Id -ErrorAction SilentlyContinue
    Unregister-Event $renamedEvent.Id -ErrorAction SilentlyContinue
    $watcher.Dispose()
}
