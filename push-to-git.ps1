param($gitit=0, $msg="Automated commit before publishing")

Write-Host "vvvvvvvvvvvvvvvvvv"
Write-Host "= starting local ="
Write-Host "vvvvvvvvvvvvvvvvvv"
Write-Host ""

# Build site
Write-Host "Building site"
# same as rm site.zip
npx @11ty/eleventy

Write-Host ""
Write-Host "Add to local Git"
git add -A .

Write-Host "Commit to local Git"
git commit -m $msg
    
Write-Host "Push to main Git"
git push

