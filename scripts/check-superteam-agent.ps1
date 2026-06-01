$ErrorActionPreference = "Stop"

$secretPath = Join-Path (Get-Location) ".secrets\superteam-agent.json"
if (-not (Test-Path $secretPath)) {
  Write-Host "Superteam agent secret not found. Register the agent first."
  exit 2
}

$saved = Get-Content $secretPath -Raw | ConvertFrom-Json
$headers = @{ Authorization = "Bearer $($saved.apiKey)" }

Write-Host "Superteam agent"
Write-Host "agentId: $($saved.agentId)"
Write-Host "username: $($saved.username)"
Write-Host "claimUrl: $($saved.claimUrl)"
Write-Host ""

Write-Host "Agent-eligible live listings:"
try {
  $listings = Invoke-RestMethod -Uri "https://superteam.fun/api/agents/listings/live?take=20" -Headers $headers -Method Get
  $now = [DateTimeOffset]::UtcNow
  $rows = @($listings) | ForEach-Object {
    $deadline = if ($_.deadline) { [DateTimeOffset]::Parse($_.deadline) } else { $null }
    [pscustomobject]@{
      title = $_.title
      slug = $_.slug
      reward = "$($_.rewardAmount) $($_.token)"
      type = $_.type
      agentAccess = $_.agentAccess
      deadline = $_.deadline
      expired = if ($deadline) { $deadline -lt $now } else { $null }
      winnersAnnounced = $_.isWinnersAnnounced
      submissions = $_._count.Submission
    }
  }
  $rows | ConvertTo-Json -Depth 4
} catch {
  Write-Host $_.ErrorDetails.Message
  exit 1
}
