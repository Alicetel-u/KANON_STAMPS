# Convert master PNGs into:
#   stamps/<id>.png         512px send/copy file
#   stamps/thumbs/<id>.webp 320px display thumbnail
#
# Usage:
#   ./tools/build-stamps.ps1
#   ./tools/build-stamps.ps1 path\to\one.png
#
# Masters live in _masters/ (gitignored). Drop a 1254px PNG there and rerun.

$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$masters = Join-Path $root '_masters'
$stamps = Join-Path $root 'stamps'
$thumbs = Join-Path $stamps 'thumbs'
$ffmpeg = (Get-Command ffmpeg -ErrorAction SilentlyContinue).Source
if (-not $ffmpeg) { throw 'ffmpeg が見つかりません' }

New-Item -ItemType Directory -Force -Path $stamps, $thumbs | Out-Null

if ($args.Count -gt 0) {
  $files = $args | ForEach-Object { Get-Item -LiteralPath $_ }
} else {
  if (-not (Test-Path $masters)) { throw "_masters フォルダがありません: $masters" }
  $files = Get-ChildItem -LiteralPath $masters -Filter *.png -File
}

if (-not $files) { throw '変換する PNG がありません' }

function Convert-One([string]$src, [string]$id) {
  $png = Join-Path $stamps "$id.png"
  $webp = Join-Path $thumbs "$id.webp"
  & $ffmpeg -hide_banner -loglevel error -y -i $src -vf 'scale=512:512:flags=lanczos' -pix_fmt rgba $png
  if ($LASTEXITCODE -ne 0) { throw "PNG failed: $id" }
  & $ffmpeg -hide_banner -loglevel error -y -i $src -vf 'scale=320:320:flags=lanczos' -c:v libwebp -q:v 80 -compression_level 6 $webp
  if ($LASTEXITCODE -ne 0) { throw "WebP failed: $id" }
  $p = (Get-Item -LiteralPath $png).Length
  $w = (Get-Item -LiteralPath $webp).Length
  '{0}: send={1:N0}KB thumb={2:N0}KB' -f $id, ($p / 1KB), ($w / 1KB)
}

foreach ($file in $files) {
  Convert-One $file.FullName $file.BaseName
}
