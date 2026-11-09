# Publishes this folder to github.com/riwaqqatar/tools (GitHub Pages: https://riwaqqatar.github.io/tools/).
# First run: creates the public repo and turns on GitHub Pages. Later runs: upload whatever changed.
$gh = "$env:LOCALAPPDATA\Microsoft\WinGet\Packages\GitHub.cli_Microsoft.Winget.Source_8wekyb3d8bbwe\bin\gh.exe"
$repo = "riwaqqatar/tools"
Set-Location $PSScriptRoot
function Fail($msg) { Write-Host ""; Write-Host "STOPPED: $msg" -ForegroundColor Red; exit 1 }

# 1. Signed in?
& $gh auth status *> $null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Sign in to GitHub: copy the code below, then approve it in the browser." -ForegroundColor Yellow
    & $gh auth login --web --hostname github.com --git-protocol https --scopes repo,workflow
    if ($LASTEXITCODE -ne 0) { Fail "GitHub sign-in did not finish." }
}
& $gh auth setup-git

# 2. Create the repo the first time
& $gh repo view $repo *> $null
if ($LASTEXITCODE -ne 0) {
    & $gh repo create $repo --public --description "Riwaq free classroom tools for teachers"
    if ($LASTEXITCODE -ne 0) { Fail "Could not create $repo." }
}

# 3. Save + upload
if (-not (Test-Path .git)) { git init -q -b main }
git config user.name "Ahmad El Youssef"
git config user.email "ahmadyoussef62@users.noreply.github.com"
git add -A
git diff --cached --quiet
if ($LASTEXITCODE -ne 0) { git commit -q -m "Update Riwaq classroom tools" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>" }
git remote get-url origin *> $null
if ($LASTEXITCODE -ne 0) { git remote add origin "https://github.com/$repo.git" } else { git remote set-url origin "https://github.com/$repo.git" }
git push -u origin main
if ($LASTEXITCODE -ne 0) { Fail "Upload to GitHub failed." }

# 4. Turn on GitHub Pages (main branch, root) if it is not on yet
& $gh api "repos/$repo/pages" *> $null
if ($LASTEXITCODE -ne 0) {
    & $gh api -X POST "repos/$repo/pages" -f "source[branch]=main" -f "source[path]=/" *> $null
}

Write-Host ""
Write-Host "Done. In 1-2 minutes the tools are live at:" -ForegroundColor Green
Write-Host "  https://riwaqqatar.github.io/tools/          (put this in the Instagram bio)"
Write-Host "  https://riwaqqatar.github.io/tools/bahr/     (the tool itself)"
