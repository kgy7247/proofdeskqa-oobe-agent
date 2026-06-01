$ErrorActionPreference = "Stop"

$rpc = "https://api.mainnet-beta.solana.com"
$wallets = @(
  [pscustomobject]@{
    label = "user_settlement_wallet"
    address = "2ngZYnmBNJNvJsxupQLE1j5GhdKLZfAHse1BkgDxBwWD"
  },
  [pscustomobject]@{
    label = "virtuals_agent_sol_wallet"
    address = "8MNSiALJ5FmB7huPeUL67MGZTZPxjvR7oDoXLNR9FweU"
  }
)

function Invoke-SolanaRpc($method, $params) {
  $body = @{
    jsonrpc = "2.0"
    id = 1
    method = $method
    params = $params
  } | ConvertTo-Json -Depth 8

  Invoke-RestMethod -Uri $rpc -Method Post -ContentType "application/json" -Body $body
}

$rows = foreach ($wallet in $wallets) {
  $balance = Invoke-SolanaRpc "getBalance" @($wallet.address)
  $lamports = [decimal]$balance.result.value
  $sol = $lamports / 1000000000

  [pscustomobject]@{
    label = $wallet.label
    address = $wallet.address
    sol = [math]::Round($sol, 9)
    lamports = $lamports
  }
}

$rows | ConvertTo-Json -Depth 4
